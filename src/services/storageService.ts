import { auth } from '../lib/firebase';

/**
 * Sube un archivo al servidor local Express (/api/upload).
 * El servidor convierte la imagen a WebP y la guarda en /uploads/.
 * @param file El archivo a subir
 * @param _path Ignorado (compatibilidad con la firma anterior)
 * @returns Promise con la URL relativa de la imagen subida
 */
export const handleFileUpload = async (
  file: File | Blob,
  _path?: string
): Promise<string> => {
  if (!file) throw new Error('No file provided');

  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Usuario no autenticado');

  const formData = new FormData();
  // Si es un Blob (imagen recortada), crear un File con nombre
  if (file instanceof File) {
    formData.append('file', file, file.name);
  } else {
    formData.append('file', file, `image-${Date.now()}.jpg`);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(err.message || `Upload failed: ${response.status}`);
  }

  const data = await response.json();
  return data.url; // Ej: /uploads/1234567890-987654321.webp
};

/**
 * Elimina una imagen del servidor local vía /api/media/:filename.
 * También maneja URLs de Firebase Storage (ignora silenciosamente).
 * @param url La URL de la imagen a eliminar
 */
export const deleteImageFromFirebase = async (url: string): Promise<void> => {
  try {
    if (!url) return;

    // Si es una URL de /uploads/ local, eliminar del servidor
    if (url.startsWith('/uploads/')) {
      const filename = url.split('/uploads/')[1];
      if (!filename) return;

      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const response = await fetch(`/api/media/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        console.warn('Error eliminando archivo del servidor:', await response.text());
      } else {
        console.log('Imagen eliminada del servidor:', filename);
      }
      return;
    }

    // URLs externas (Unsplash, Firebase, etc.) → ignorar silenciosamente
    console.log('URL externa, no se elimina localmente:', url);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    // No crashear la UI si falla la eliminación
  }
};
