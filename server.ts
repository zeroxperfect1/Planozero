import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import sharp from 'sharp';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory logs for the admin dashboard
const logs: { timestamp: string; level: 'info' | 'error'; message: string }[] = [];

// Override console methods to capture logs
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  originalLog(...args);
  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
  });
  if (logs.length > 200) logs.shift();
};

console.error = (...args) => {
  originalError(...args);
  logs.push({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
  });
  if (logs.length > 200) logs.shift();
};

// Initialize Firebase Admin for auth verification
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig = { projectId: '' };
if (fs.existsSync(firebaseConfigPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
}

if (firebaseConfig.projectId && !admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // WWW Redirect Middleware
  app.use((req, res, next) => {
    const host = req.get('host');
    if (host === 'planozero.cl') {
      return res.redirect(301, `https://www.planozero.cl${req.originalUrl}`);
    }
    next();
  });

  // Request logging middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      const timestamp = new Date().toISOString();
      const body = req.method !== 'GET' ? JSON.stringify(req.body, null, 2) : '';
      console.log(`[${timestamp}] ${req.method} ${req.url} ${body ? '\nBody: ' + body : ''}`);
    }
    next();
  });

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Auth check failed:', error);
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // Database helper
  const getDb = () => getFirestore(admin.apps[0], (firebaseConfig as any).firestoreDatabaseId || undefined);

  // Common Error handler for API routes
  const apiErrorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.url.startsWith('/api')) {
      console.error('API Error:', err);
      return res.status(err.status || 500).json({
        error: err.name || 'Server Error',
        message: err.message || 'An unexpected error occurred',
        details: err.message
      });
    }
    next(err);
  };

  // Configure Multer for processing images before saving
  const storage = multer.memoryStorage();

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Increase to 10MB to allow for processing overhead
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP and SVG are allowed.') as any, false);
      }
    }
  });

  // API Routes
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      uploadsDir: fs.existsSync(uploadsDir),
      sharp: typeof sharp === 'function',
      recentLogs: logs.slice(-20)
    });
  });

  // Page Layouts Endpoints (Standardized for End-to-End flow)
  app.get('/api/pages', async (req, res) => {
    try {
      const db = getDb();
      const snapshot = await db.collection('pages').orderBy('order', 'asc').get();
      const pages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });

  app.post('/api/pages', authenticate, async (req, res) => {
    try {
      const db = getDb();
      const pageData = req.body;
      
      // Sanitization: Ensure required fields
      if (!pageData.slug || !pageData.title) {
        return res.status(400).json({ error: 'Missing title or slug' });
      }

      // Check for duplicates
      const q = await db.collection('pages').where('slug', '==', pageData.slug).limit(1).get();
      if (!q.empty) {
        // Update instead of create
        const docId = q.docs[0].id;
        await db.collection('pages').doc(docId).set({
          ...pageData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        return res.json({ success: true, id: docId, action: 'updated' });
      }

      const docRef = await db.collection('pages').add({
        ...pageData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      res.status(201).json({ success: true, id: docRef.id, action: 'created' });
    } catch (error) {
      console.error('Error saving page:', error);
      res.status(500).json({ error: 'Failed to save page' });
    }
  });

  app.put('/api/pages/:id', authenticate, async (req, res) => {
    try {
      const db = getDb();
      const { id } = req.params;
      const pageData = req.body;

      await db.collection('pages').doc(id).set({
        ...pageData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      res.json({ success: true, id });
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({ error: 'Failed to update page' });
    }
  });

  app.delete('/api/pages/:id', authenticate, async (req, res) => {
    try {
      const db = getDb();
      await db.collection('pages').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // Serve robots.txt and sitemap.xml explicitly
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send('Not found');
    }
  });

  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.type('application/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Not found');
    }
  });

  // Logs endpoint (Admin only)
  app.get('/api/admin/logs', authenticate, (req, res) => {
    // Only allow admin email
    const userEmail = (req as any).user?.email;
    if (userEmail !== 'raul.mella.castro@gmail.com') {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }
    res.json(logs);
  });

  app.delete('/api/admin/logs', authenticate, (req, res) => {
    const userEmail = (req as any).user?.email;
    if (userEmail !== 'raul.mella.castro@gmail.com') {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }
    logs.length = 0;
    res.json({ success: true });
  });

  // Email Responder endpoint
  app.post('/api/admin/respond-email', authenticate, async (req, res) => {
    const userEmail = (req as any).user?.email;
    if (userEmail !== 'raul.mella.castro@gmail.com') {
      return res.status(403).json({ error: 'Unauthorized: Admin access only' });
    }

    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
      console.error('Email configuration missing in env');
      return res.status(503).json({ error: 'Email service not configured' });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'raul@planozero.cl',
        to,
        subject,
        text: message,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #18181b; line-height: 1.6;">
            <div style="background-color: #000; padding: 40px; border-radius: 40px 40px 0 0; text-align: center;">
              <h1 style="color: #FF5F1F; margin: 0; font-size: 24px; text-transform: uppercase;">PLANOZERO</h1>
            </div>
            <div style="padding: 40px; background-color: #fff; border: 1px solid #e4e4e7; border-radius: 0 0 40px 40px;">
              <h2 style="font-size: 20px; font-weight: 800; margin-top: 0;">Respuesta a tu mensaje</h2>
              <p style="white-space: pre-wrap;">${message}</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f4f4f5; font-size: 14px; color: #71717a;">
                <p>Saludos,<br>Raúl Mella - PLANOZERO</p>
                <p style="font-size: 10px; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">Esta es una respuesta directa desda el Panel Administrativo de PLANOZERO.</p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('Admin response email sent: %s', info.messageId);
      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      console.error('Email response failure:', error);
      res.status(500).json({ 
        error: 'Failed to send email', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Upload endpoint (Protected)
  app.post('/api/upload', authenticate, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Multer error during upload:', err);
        return res.status(400).json({ 
          error: 'Error de archivo', 
          message: err.message,
          code: (err as any).code
        });
      }
      next();
    });
  }, async (req, res) => {
    console.log('Upload request received:', req.file?.originalname);
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      let filename = '';
      let buffer: Buffer;
      let mimetype = req.file.mimetype;

      // Only convert raster images to webp. SVGs should stay SVGs.
      if (req.file.mimetype.startsWith('image/') && req.file.mimetype !== 'image/svg+xml') {
        console.log('Converting image to webp...');
        filename = `${uniqueSuffix}.webp`;
        mimetype = 'image/webp';
        buffer = await sharp(req.file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        console.log('Conversion successful');
      } else {
        // For SVGs or other non-convertible types
        const ext = path.extname(req.file.originalname).toLowerCase();
        filename = `${uniqueSuffix}${ext}`;
        buffer = req.file.buffer;
      }

      const filePath = path.join(uploadsDir, filename);
      console.log('Writing to:', filePath);
      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      res.json({ 
        url: fileUrl, 
        filename: filename, 
        size: buffer.length,
        mimetype: mimetype 
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({ 
        error: 'Error al procesar la imagen',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Delete endpoint (Protected + Path Traversal Protection)
  app.delete('/api/media/:filename', authenticate, async (req, res) => {
    const filename = req.params.filename;
    
    // Security: Sanitize filename to prevent path traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadsDir, safeFilename);

    // Security check: ensure the resulting path is still inside the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    try {
      await fs.promises.access(filePath);
      await fs.promises.unlink(filePath);
      res.json({ success: true, message: 'File deleted' });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'File not found' });
      } else {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete physical file' });
      }
    }
  });

  // API Catch-all (to prevent falling into Vite SPA for 404s)
  app.use('/api', (req, res) => {
    console.log(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ error: 'API route not found' });
  });

  // Apply API error handler before Vite
  app.use(apiErrorHandler);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist', 'client');
    console.log(`[Server] Serving static files from: ${distPath}`);
    
    if (!fs.existsSync(distPath)) {
      console.error(`[Server] ERROR: dist/client directory not found! Deployment might be incomplete.`);
    }

    app.use(express.static(distPath));
    
    const indexPath = path.join(distPath, 'index.html');
    let cachedHtml: string | null = null;

    // Catch-all for SPA - Fixed for Express 5 (using *all to capture everything)
    app.get('*all', async (req, res, next) => {
      // Skip if it's an API, Uploads, robots.txt or sitemap.xml request that leaked through
      if (req.url.startsWith('/api') || req.url.startsWith('/uploads') || req.url === '/robots.txt' || req.url === '/sitemap.xml') {
        return next();
      }
      
      try {
        if (!cachedHtml) {
          if (fs.existsSync(indexPath)) {
            cachedHtml = await fs.promises.readFile(indexPath, 'utf8');
          } else {
            console.error(`[Server] index.html not found at ${indexPath}`);
            return res.status(500).send('Critical Error: index.html not found. Deployment might be broken.');
          }
        }
        let html = cachedHtml || '';

      // SEO Injection for Blog Posts
      const blogMatch = req.path.match(/\/blog\/([^\/]+)/);
      if (blogMatch && blogMatch[1] && admin.apps.length > 0) {
        const slugOrId = blogMatch[1];
        console.log(`[SEO Injection] Processing: ${slugOrId}`);
        
        try {
          const db = getDb();
          let postData: any = null;

          // Try by slug first
          const slugQuery = await db.collection('posts')
            .where('slug', '==', slugOrId)
            .limit(1)
            .get();
          
          if (!slugQuery.empty) {
            postData = slugQuery.docs[0].data();
          } else {
            // Fallback to ID
            const idDoc = await db.collection('posts').doc(slugOrId).get();
            if (idDoc.exists) {
              postData = idDoc.data();
            }
          }

          if (postData && postData.published) {
            const title = `${postData.title} | PLANOZERO`;
            const description = postData.excerpt || '';
            const image = postData.image || 'https://planozero.cl/logo_planozero.png';
            const url = `https://www.planozero.cl${req.path}`;
            const publishedAt = postData.createdAt ? new Date(postData.createdAt._seconds * 1000).toISOString() : new Date().toISOString();
            const modifiedAt = postData.updatedAt ? new Date(postData.updatedAt._seconds * 1000).toISOString() : publishedAt;

            // Inject Meta Tags
            const metaTags = `
              <title>${title}</title>
              <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
              <link rel="canonical" href="${url}" />
              <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
              <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
              <meta property="og:image" content="${image}" />
              <meta property="og:url" content="${url}" />
              <meta property="og:type" content="article" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
              <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
              <meta name="twitter:image" content="${image}" />
              <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": "${title.replace(/"/g, '\\"')}",
                "description": "${description.replace(/"/g, '\\"')}",
                "image": "${image}",
                "author": {
                  "@type": "Organization",
                  "name": "PLANOZERO"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "PLANOZERO",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://planozero.cl/logo-planozero.svg"
                  }
                },
                "datePublished": "${publishedAt}",
                "dateModified": "${modifiedAt}",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "${url}"
                }
              }
              </script>
            `;

            // Replace standard title, description and canonical
            html = html.replace(/<title>.*?<\/title>/, metaTags);
            html = html.replace(/<meta name="description" content=".*?" \/>/, '');
            html = html.replace(/<link rel="canonical" href=".*?" \/>/, '');
            
            console.log(`[SEO Injection] Success for: ${postData.title}`);
          }
        } catch (dbError) {
          console.error('[SEO Injection] Firestore error:', dbError);
        }
      }

      res.send(html);
    } catch (err) {
      console.error('[Server] Catch-all error:', err);
      next(err);
    }
  });
}

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

}

startServer().catch(err => {
  console.error("Critical server start failure:", err);
});
