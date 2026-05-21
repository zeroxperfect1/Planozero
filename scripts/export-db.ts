/**
 * Script de exportación de Firestore → JSON local
 * Uso: npx tsx scripts/export-db.ts
 *
 * Exporta todas las colecciones del proyecto a:
 *   firestore-backup-YYYY-MM-DD.json
 *
 * Útil para homologar ambientes y hacer backups de producción.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Lee la config del proyecto
const config = JSON.parse(readFileSync(join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));

// Inicializa Admin SDK con Application Default Credentials
// (requiere GOOGLE_APPLICATION_CREDENTIALS apuntando a service-account.json)
initializeApp({
  projectId: config.projectId,
  databaseURL: `https://${config.projectId}.firebaseio.com`,
});

const db = getFirestore(config.firestoreDatabaseId);

const COLLECTIONS = [
  'pages',
  'posts',
  'menus',
  'contacts',
  'media',
  'contentTypes',
  'dynamicContent',
];

async function exportAll() {
  console.log(`\n🔄 Exportando Firestore (${config.projectId})...\n`);

  const backup: Record<string, any[]> = {};
  let totalDocs = 0;

  for (const col of COLLECTIONS) {
    try {
      const snapshot = await db.collection(col).get();
      backup[col] = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
      }));
      console.log(`  ✅ ${col}: ${snapshot.size} documentos`);
      totalDocs += snapshot.size;
    } catch (e: any) {
      console.warn(`  ⚠️  ${col}: ${e.message}`);
      backup[col] = [];
    }
  }

  const date = new Date().toISOString().split('T')[0];
  const filename = `firestore-backup-${date}.json`;

  writeFileSync(
    join(process.cwd(), filename),
    JSON.stringify({ exportedAt: new Date().toISOString(), projectId: config.projectId, data: backup }, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Exportación completa`);
  console.log(`   Documentos: ${totalDocs}`);
  console.log(`   Archivo:    ${filename}\n`);
}

exportAll().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
