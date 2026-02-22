const DB_NAME = 'scribbles-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db = null;

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('conversationId', 'conversationId', { unique: false });
      }
    };
  });
}

export async function saveImage(imageData) {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.add(imageData);
    
    request.onsuccess = () => {
      resolve(imageData.id);
    };
    
    request.onerror = () => {
      console.error('Failed to save image:', request.error);
      reject(request.error);
    };
  });
}

export async function updateImage(id, updates) {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const imageData = getRequest.result;
      if (!imageData) {
        resolve(null);
        return;
      }
      
      const updatedData = { ...imageData, ...updates };
      const putRequest = store.put(updatedData);
      
      putRequest.onsuccess = () => {
        resolve(updatedData);
      };
      
      putRequest.onerror = () => {
        reject(putRequest.error);
      };
    };
    
    getRequest.onerror = () => {
      reject(getRequest.error);
    };
  });
}

export async function getImage(id) {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => {
      console.error('Failed to get image:', request.error);
      reject(request.error);
    };
  });
}

export async function getAllImages() {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    
    request.onerror = () => {
      console.error('Failed to get all images:', request.error);
      reject(request.error);
    };
  });
}

export async function deleteImage(id) {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = () => {
      console.error('Failed to delete image:', request.error);
      reject(request.error);
    };
  });
}

export async function clearAllImages() {
  const database = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.clear();
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = () => {
      console.error('Failed to clear images:', request.error);
      reject(request.error);
    };
  });
}

export async function getStorageUsage() {
  const images = await getAllImages();
  
  let totalBytes = 0;
  
  images.forEach(img => {
    if (img.formats) {
      Object.values(img.formats).forEach(format => {
        if (format && format.data) {
          totalBytes += format.data.length * 0.75;
        }
      });
    }
    if (img.zipData) {
      totalBytes += img.zipData.length * 0.75;
    }
  });
  
  return {
    imageCount: images.length,
    bytes: Math.round(totalBytes),
    formatted: formatBytes(totalBytes)
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
