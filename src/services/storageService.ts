import { api } from './api';

/**
 * Sube un archivo de imagen al servidor via /api/upload.php
 * @param file File o Blob a subir
 * @param _path Ignorado (compatibilidad con firma anterior)
 * @returns URL pública de la imagen subida
 */
export const handleFileUpload = async (
  file: File | Blob,
  _path?: string
): Promise<string> => {
  return api.upload.file(file);
};

/**
 * Elimina una imagen del servidor via /api/media.php
 * @param url URL de la imagen (se busca en la BD por URL para obtener el ID)
 */
export const deleteImageFromFirebase = async (url: string): Promise<void> => {
  try {
    if (!url) return;
    // Buscar la media por URL y eliminarla
    const mediaList = await api.media.getAll();
    const item = mediaList.find(m => m.url === url);
    if (item) {
      await api.media.delete(item.id);
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    // No crashear la UI
  }
};
