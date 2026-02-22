import JSZip from 'jszip';

export async function convertImageLocally(file, options = {}) {
  const { format = 'png', quality = 90 } = options;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
          const qualityValue = format === 'png' ? undefined : quality / 100;
          const dataUrl = canvas.toDataURL(mimeType, qualityValue);
          
          const base64 = dataUrl.split(',')[1];
          const originalSize = file.size;
          const convertedSize = Math.round((base64.length * 3) / 4);
          
          resolve({
            base64,
            dataUrl,
            originalSize,
            convertedSize,
            format,
            width: img.width,
            height: img.height,
            filename: `${file.name.split('.')[0]}.${format}`
          });
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function convertImagesBatch(files, options = {}) {
  const { format = 'png', quality = 90, onProgress } = options;
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await convertImageLocally(files[i], { format, quality });
      results.push(result);
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Failed to convert ${files[i].name}:`, error);
    }
  }
  
  return results;
}

export async function downloadConvertedImage(result) {
  const { dataUrl, filename } = result;
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadBatchAsZip(results) {
  const zip = new JSZip();
  
  for (const result of results) {
    zip.file(result.filename, result.base64, { base64: true });
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `converted-images-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
