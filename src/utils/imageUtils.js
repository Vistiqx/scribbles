import JSZip from 'jszip';
import * as storageManager from './storageManager.js';

export async function downloadFile(base64Data, filename, format, imageMetadata = {}, originalImageData = null) {
  console.log('downloadFile called:', { filename, format, dataLength: base64Data?.length });
  
  // Only save to storage on first download, not for each format
  if (!imageMetadata._saved) {
    imageMetadata._saved = true;
    try {
      // Use original image data if available, otherwise use the base64Data
      const imageToSave = originalImageData || base64Data;
      await storageManager.saveImageToStorage(imageToSave, {
        prompt: imageMetadata.prompt,
        conversationId: imageMetadata.conversationId,
        messageId: imageMetadata.messageId
      });
      console.log('Image saved to storage');
    } catch (error) {
      console.error('Failed to save image to storage:', error);
    }
  }
  
  if (!base64Data || typeof base64Data !== 'string') {
    console.error('Invalid base64 data');
    alert('Download failed: Invalid image data');
    return;
  }
  
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  const dataUrl = `data:${mimeType};base64,${base64Data}`;
  
  console.log('Created dataUrl, length:', dataUrl.length);
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function convertBase64ToFormat(base64String, format) {
  console.log('Converting format:', format, 'Input length:', base64String?.length);
  
  return new Promise((resolve, reject) => {
    if (!base64String || typeof base64String !== 'string') {
      reject(new Error('Invalid base64 string'));
      return;
    }

    let base64Data = base64String;
    let mimeType = 'image/png';
    
    if (base64String.includes(',')) {
      const parts = base64String.split(',');
      const header = parts[0];
      base64Data = parts[1];
      
      console.log('Header:', header);
      
      if (header.includes('image/png')) mimeType = 'image/png';
      else if (header.includes('image/jpeg')) mimeType = 'image/jpeg';
      else if (header.includes('image/webp')) mimeType = 'image/webp';
      else if (header.includes('image/gif')) mimeType = 'image/gif';
      
      console.log('Detected mimeType:', mimeType);
    }
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('Binary length:', bytes.length, 'First bytes:', bytes[0], bytes[1], bytes[2]);
    
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    console.log('Created blob, size:', blob.size);
    
    const img = new Image();
    img.onload = async () => {
      console.log('Image loaded, size:', img.width, img.height);
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const outputMimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
        const quality = format === 'webp' ? 0.92 : (format === 'jpeg' ? 0.95 : undefined);
        console.log('Output mimeType:', outputMimeType, 'Quality:', quality);
        
        const dataUrl = canvas.toDataURL(outputMimeType, quality);
        console.log('Output dataUrl length:', dataUrl.length);
        resolve(dataUrl.split(',')[1]);
      } catch (error) {
        console.error('Canvas error:', error);
        reject(error);
      }
    };
    img.onerror = (e) => {
      console.error('Image load error:', e);
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export async function downloadAllFormats(base64String, filename = 'scribbles-image', imageMetadata = {}) {
  // Only save once, not multiple times
  if (!imageMetadata._saved) {
    imageMetadata._saved = true;
    try {
      await storageManager.saveImageToStorage(base64String, {
        prompt: imageMetadata.prompt,
        conversationId: imageMetadata.conversationId,
        messageId: imageMetadata.messageId
      });
      console.log('Image saved to storage');
    } catch (error) {
      console.error('Failed to save image to storage:', error);
    }
  }
  
  const zip = new JSZip();
  const formats = ['png', 'jpeg', 'webp'];
  
  for (const format of formats) {
    try {
      const converted = await convertBase64ToFormat(base64String, format);
      const ext = format === 'jpeg' ? 'jpg' : format;
      zip.file(`${filename}.${ext}`, converted, { base64: true });
    } catch (error) {
      console.error(`Failed to convert to ${format}:`, error);
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `${filename}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function getImageFromStorage(imageId) {
  const formats = await storageManager.getImageFormats(imageId);
  if (formats && formats.png) {
    return `data:image/png;base64,${formats.png}`;
  }
  if (formats && formats.jpeg) {
    return `data:image/jpeg;base64,${formats.jpeg}`;
  }
  if (formats && formats.webp) {
    return `data:image/webp;base64,${formats.webp}`;
  }
  return null;
}

export async function deleteImageFromStorage(imageId) {
  await storageManager.deleteImageFromStorage(imageId);
}

export async function getStorageStats() {
  return storageManager.getStorageStats();
}

export async function getDownloadedImages() {
  return storageManager.getDownloadedImages();
}

export async function clearAllImageStorage() {
  await storageManager.clearAllStorage();
}
