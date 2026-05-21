import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, Twitter, Linkedin, Link2, X, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence } from 'motion/react';

interface Post {
  id: string;
  slug?: string;
  title: string;
  content: string;
  excerpt: string;
  date: any;
  author: string;
  authorImage?: string;
  category: string;
  image: string;
  keywords?: string;
  createdAt?: any;
}

const ShareModal = ({ isOpen, onClose, title, url }: { isOpen: boolean, onClose: () => void, title: string, url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: '#0077b5',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: '#1DA1F2',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      icon: <span className="font-bold">f</span>,
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Compartir</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: link.color }}
                  >
                    {link.name === 'Facebook' ? <span className="text-xl font-black italic">f</span> : link.icon}
                  </div>
                  <span className="font-bold uppercase italic tracking-tight group-hover:text-[#FF5F1F] transition-colors">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3">O copiar enlace</span>
              <div className="flex gap-2">
                <div className="flex-grow bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 text-xs font-mono text-zinc-500 truncate border border-zinc-200 dark:border-zinc-800">
                  {url}
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-4 rounded-xl transition-all flex items-center justify-center ${
                    copied ? 'bg-green-500 text-white' : 'bg-[#FF5F1F] text-white hover:bg-[#FF4F0F]'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        // Try searching by slug first (optimized for SEO URLs)
        // Mandatory: Include published constraint to satisfy security rules for guest users
        const q = query(
          collection(db, 'posts'), 
          where('published', '==', true),
          where('slug', '==', id), 
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const postData = { id: docSnap.id, ...docSnap.data() } as Post;
          setPost(postData);
          fetchRelatedPosts(postData.category, docSnap.id);
        } else {
          // Fallback to ID for legacy links or unpublished check
          // If we are a guest, this might still trigger a permission error if the post isn't published
          const docRef = doc(db, 'posts', id);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const postData = { id: docSnap.id, ...docSnap.data() } as Post;
              setPost(postData);
              fetchRelatedPosts(postData.category, docSnap.id);
            } else {
              setPost(null);
            }
          } catch (e: any) {
            // SILENT: If it's a permission error, it likely means it's not published or doesn't exist
            // Firestore often returns permission denied if we don't have permission to know if it exists
            console.warn("Direct doc access failed - post might be draft or non-existent:", id);
            setPost(null);
          }
        }
      } catch (error: any) {
        // Only log/handle critical errors, don't crash for missing permissions (common for drafts)
        const isPermissionError = error?.message?.toLowerCase().includes('permission') || 
                                 error?.code === 'permission-denied';
        
        if (!isPermissionError) {
          console.error("Critical error fetching post:", error);
          handleFirestoreError(error, OperationType.GET, `posts/${id}`);
        } else {
          console.log("Post access denied (likely draft):", id);
          setPost(null);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async (category: string, currentId: string) => {
      try {
        // Query published posts first (security requirement)
        const q = query(
          collection(db, 'posts'),
          where('published', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const related = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Post))
          .filter(p => p.id !== currentId && p.category === category)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FF5F1F]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 px-6">
        <h1 className="text-4xl font-black mb-4">ARTÍCULO_NO_ENCONTRADO</h1>
        <Link to="/blog" className="text-[#FF5F1F] font-mono underline uppercase">Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#FF5F1F] selection:text-white pt-20">
      <Helmet>
        <html lang="es-CL" />
        <title>{`${post.title} | PLANOZERO`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | PLANOZERO`} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="article:published_time" content={post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.keywords && <meta name="keywords" content={post.keywords} />}
        <meta name="author" content={post.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image,
            "datePublished": post.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "PLANOZERO",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.svg`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${window.location.origin}/blog/${post.slug || post.id}`
            }
          })}
        </script>
      </Helmet>
      <main id="main-content" className="max-w-4xl mx-auto px-6 flex-grow">
        <div className="flex justify-between items-center mb-12">
          <Logo />
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-[#FF5F1F] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            VOLVER_AL_JOURNAL
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 text-xs font-mono text-[#FF5F1F] mb-6 uppercase tracking-widest">
            <span className="bg-[#FF5F1F]/10 px-3 py-1 rounded-full">{post.category}</span>
            <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date?.toDate?.()?.toLocaleDateString() || post.date}</div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-12">
            {post.title}
          </h1>

          <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden mb-16 grayscale hover:grayscale-0 transition-all duration-1000">
            <img src={post.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-24">
            <div className="lg:col-span-1 space-y-8">
              <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-4">Escrito por</span>
                <div className="flex items-center gap-3">
                  {post.authorImage ? (
                    <img 
                      src={post.authorImage} 
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                      <span className="text-xs font-mono text-[#FF5F1F] font-bold">
                        {post.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <span className="font-bold">{post.author}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div 
                className="prose prose-zinc dark:prose-invert max-w-none 
                  prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-black prose-h1:tracking-tighter prose-h1:uppercase prose-h1:italic
                  prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tight prose-h2:uppercase prose-h2:italic
                  prose-p:text-lg prose-p:leading-relaxed text-zinc-600 dark:text-zinc-400
                  prose-blockquote:border-l-4 prose-blockquote:border-[#FF5F1F] prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-3xl
                  prose-img:rounded-[40px] prose-img:shadow-2xl prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800
                  prose-a:text-[#FF5F1F] prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
              >
                {(() => {
                  let content = post.content;
                  
                  // Comprehensive check for HTML entities
                  const hasEntities = /&[a-z0-9]+;|&#[0-9]+;|&#x[a-f0-9]+;/i.test(content);
                  
                  if (hasEntities) {
                    const txt = document.createElement('textarea');
                    txt.innerHTML = content;
                    content = txt.value;
                    // Double decoding for common edge cases
                    if (/&[a-z0-9]+;|&#[0-9]+;|&#x[a-f0-9]+;/i.test(content)) {
                      txt.innerHTML = content;
                      content = txt.value;
                    }
                  }

                  // If it's definitely HTML or was decoded into HTML
                  if (/<[a-z][\s\S]*>/i.test(content)) {
                    return <div dangerouslySetInnerHTML={{ __html: content }} />;
                  }
                  
                  // Fallback to Markdown
                  return <ReactMarkdown>{content}</ReactMarkdown>;
                })()}
              </div>
            </div>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="pt-20 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-end justify-between mb-12">
                <div className="max-w-md">
                  <span className="text-[10px] font-mono text-[#FF5F1F] tracking-widest uppercase mb-4 block underline underline-offset-8">Continúa Leyendo</span>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Lectura Sugerida</h2>
                </div>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-2xl font-black italic uppercase text-xs hover:bg-[#FF5F1F] dark:hover:bg-[#FF5F1F] hover:text-white transition-all shadow-lg shadow-[#FF5F1F]/10 group"
                >
                  <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Compartir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost, i) => (
                  <motion.div 
                    key={rPost.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      to={`/blog/${rPost.slug || rPost.id}`}
                      className="group block p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-[#FF5F1F] hover:shadow-xl hover:shadow-[#FF5F1F]/5 transition-all duration-300 h-full"
                    >
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-zinc-100">
                        <img 
                          src={rPost.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'} 
                          alt={rPost.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-[8px] font-mono text-zinc-400 uppercase mb-3 tracking-widest">{rPost.category}</div>
                      <h3 className="text-lg font-bold group-hover:text-[#FF5F1F] transition-colors leading-tight mb-4">
                        {rPost.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-[#FF5F1F] uppercase mt-auto">
                        Leer más <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <div className="h-24"></div>
      <Footer />
      
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)}
        title={post.title}
        url={window.location.href}
      />
    </div>
  );
};

export default PostDetail;
