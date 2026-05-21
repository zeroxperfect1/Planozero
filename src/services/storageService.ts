import { auth, storage } from '../lib/firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

/**
 * Sube un archivo directamente a Firebase Storage desde el browser.
 * No requiere servidor Node.js — funciona en cualquier hosting estático.
 * @param file El archivo o Blob a subir
 * @param _path Ignorado (compatibilidad con firma anterior)
 * @returns Promise con la URL pública de descarga
 */
export const handleFileUpload = (
  file: File | Blob,
  _path?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      reject(new Error('Usuario no autenticado'));
      return;
    }

    // Construye la ruta en Storage: uploads/{uid}/{timestamp}-{random}.ext
    const ext = file instanceof File
      ? file.name.split('.').pop() || 'jpg'
      : 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const storagePath = `uploads/${user.uid}/${filename}`;

    const storageRef = ref(storage, storagePath);
    const metadata = {
      contentType: file instanceof File ? file.type : 'image/jpeg',
      customMetadata: {
        originalName: file instanceof File ? file.name : filename,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.uid,
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload: ${Math.round(progress)}%`);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Elimina una imagen de Firebase Storage usando su URL de descarga.
 * También ignora URLs externas (Unsplash, etc.) silenciosamente.
 * @param url La URL completa de descarga de Firebase Storage
 */
export const deleteImageFromFirebase = async (url: string): Promise<void> => {
  try {
    if (!url) return;

    // Solo procesa URLs de Firebase Storage
    if (!url.includes('firebasestorage.googleapis.com')) {
      console.log('URL externa ignorada (no Firebase Storage):', url.substring(0, 60));
      return;
    }

    // Extrae la ruta del objeto desde la URL
    const decodedUrl = decodeURIComponent(url);
    const pathPart = decodedUrl.split('/o/')[1]?.split('?')[0];

    if (!pathPart) {
      console.warn('No se pudo extraer la ruta de Storage de la URL');
      return;
    }

    const storageRef = ref(storage, pathPart);
    await deleteObject(storageRef);
    console.log('Imagen eliminada de Firebase Storage:', pathPart);
  } catch (error: any) {
    // Si el objeto no existe, ignorar silenciosamente
    if (error?.code === 'storage/object-not-found') {
      console.log('Imagen no encontrada en Storage (ya eliminada?)');
      return;
    }
    console.error('Error al eliminar imagen de Storage:', error);
    // No crashear la UI
  }
};
