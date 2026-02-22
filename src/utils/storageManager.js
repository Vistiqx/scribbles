import { v4 as uuidv4 } from 'uuid';
import * as imageDb from './imageDb.js';

const STORAGE_KEYS = {
  FAVORITES: 'scribbles_favorites',
  CONVERSATIONS: 'scribbles_conversations',
  DOWNLOADED_IMAGES: 'scribbles_downloaded_images',
  SETTINGS: 'scribbles_settings'
};

async function convertToAllFormats(imageData) {
  const formats = {};
  
  let base64Data = imageData;
  if (imageData.includes(',')) {
    base64Data = imageData.split(',')[1];
  }
  
  formats.png = { data: base64Data, mimeType: 'image/png' };
  
  const jpegData = await convertFormat(imageData, 'jpeg');
  if (jpegData) {
    formats.jpeg = { data: jpegData, mimeType: 'image/jpeg' };
  }
  
  const webpData = await convertFormat(imageData, 'webp');
  if (webpData) {
    formats.webp = { data: webpData, mimeType: 'image/webp' };
  }
  
  return formats;
}

async function convertFormat(imageData, format) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
      const quality = format === 'webp' ? 0.92 : 0.95;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = () => resolve(null);
    img.src = imageData;
  });
}

export async function saveImageToStorage(imageData, metadata = {}) {
  // Check if image already exists in IndexedDB by comparing the base64 data
  const allImages = await imageDb.getAllImages();
  
  // Extract base64 data for comparison
  let base64ForComparison = imageData;
  if (imageData.includes(',')) {
    base64ForComparison = imageData.split(',')[1];
  }
  
  // Find existing image by comparing PNG data
  for (const existingImage of allImages) {
    if (existingImage.formats?.png?.data === base64ForComparison) {
      // Image already exists, just mark as downloaded if not already
      if (!existingImage.isDownloaded) {
        await imageDb.updateImage(existingImage.id, {
          isDownloaded: true,
          downloadedAt: new Date().toISOString()
        });
      }
      
      // Add to downloaded list if not already there
      const downloadedImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADED_IMAGES) || '[]');
      if (!downloadedImages.includes(existingImage.id)) {
        downloadedImages.push(existingImage.id);
        localStorage.setItem(STORAGE_KEYS.DOWNLOADED_IMAGES, JSON.stringify(downloadedImages));
      }
      
      return existingImage.id;
    }
  }
  
  // Image doesn't exist, create new entry
  const id = uuidv4();
  const formats = await convertToAllFormats(imageData);
  
  const imageRecord = {
    id,
    formats,
    prompt: metadata.prompt || '',
    createdAt: new Date().toISOString(),
    isFavorite: metadata.isFavorite || false,
    isDownloaded: true,
    downloadedAt: new Date().toISOString(),
    conversationId: metadata.conversationId || null,
    messageId: metadata.messageId || null,
    tags: []
  };
  
  await imageDb.saveImage(imageRecord);
  
  const downloadedImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADED_IMAGES) || '[]');
  if (!downloadedImages.includes(id)) {
    downloadedImages.push(id);
    localStorage.setItem(STORAGE_KEYS.DOWNLOADED_IMAGES, JSON.stringify(downloadedImages));
  }
  
  return id;
}

export async function getImageFormats(imageId) {
  const imageData = await imageDb.getImage(imageId);
  if (!imageData) return null;
  
  return {
    png: imageData.formats?.png?.data || null,
    jpeg: imageData.formats?.jpeg?.data || null,
    webp: imageData.formats?.webp?.data || null,
    original: imageData.formats?.png?.data || imageData.formats?.jpeg?.data || imageData.formats?.webp?.data
  };
}

export async function deleteImageFromStorage(imageId) {
  await imageDb.deleteImage(imageId);
  
  const downloadedImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADED_IMAGES) || '[]');
  const updated = downloadedImages.filter(id => id !== imageId);
  localStorage.setItem(STORAGE_KEYS.DOWNLOADED_IMAGES, JSON.stringify(updated));
  
  const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  const updatedFavorites = favorites.filter(fav => fav.imageId !== imageId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
}

export async function getDownloadedImages() {
  let downloadedIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADED_IMAGES) || '[]');
  
  // Remove duplicates
  downloadedIds = [...new Set(downloadedIds)];
  
  // Save deduplicated list
  localStorage.setItem(STORAGE_KEYS.DOWNLOADED_IMAGES, JSON.stringify(downloadedIds));
  
  const images = [];
  
  for (const id of downloadedIds) {
    const imgData = await imageDb.getImage(id);
    if (imgData) {
      images.push(imgData);
    }
  }
  
  return images;
}

export async function getStorageStats() {
  const usage = await imageDb.getStorageUsage();
  const downloadedIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADED_IMAGES) || '[]');
  
  return {
    ...usage,
    downloadedCount: downloadedIds.length,
    limit: 500 * 1024 * 1024,
    limitFormatted: '500 MB'
  };
}

export async function clearAllStorage() {
  await imageDb.clearAllImages();
  localStorage.setItem(STORAGE_KEYS.DOWNLOADED_IMAGES, JSON.stringify([]));
}
