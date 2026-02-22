import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { getDownloadedImages, deleteImageFromStorage } from '../utils/imageUtils';
import GalleryHeader from './GalleryHeader';
import GalleryGrid from './GalleryGrid';
import GalleryModal from './GalleryModal';

export default function ImageGallery({ onBack }) {
  const { favorites, addToFavorites, removeFromFavorites, refreshStorageStats, tags, addTagToImage, removeTagFromImage } = useChat();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [downloadedImages, setDownloadedImages] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const isLoading = downloadedImages === null;

  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await getDownloadedImages();
        setDownloadedImages(images);
      } catch (error) {
        console.error('Failed to load downloaded images:', error);
        setDownloadedImages([]);
      }
    };
    loadImages();
  }, []);

  const isFavorite = (imageId) => {
    if (favorites.some(f => f.imageId === imageId)) {
      return true;
    }
    const imgData = downloadedImages?.find(img => img.id === imageId);
    if (imgData) {
      const imageUrl = getImageUrl(imgData);
      return favorites.some(f => f.image === imageUrl);
    }
    return false;
  };

  const filteredImages = downloadedImages === null 
    ? [] 
    : filter === 'all' 
      ? downloadedImages 
      : filter === 'favorites' 
        ? downloadedImages.filter(img => isFavorite(img.id))
        : downloadedImages;

  const getImageUrl = (imgData) => {
    if (imgData.formats?.png?.data) {
      return `data:image/png;base64,${imgData.formats.png.data}`;
    }
    if (imgData.formats?.jpeg?.data) {
      return `data:image/jpeg;base64,${imgData.formats.jpeg.data}`;
    }
    if (imgData.formats?.webp?.data) {
      return `data:image/webp;base64,${imgData.formats.webp.data}`;
    }
    return null;
  };

  const handleFavorite = async (imgData) => {
    const imageUrl = getImageUrl(imgData);
    if (!imageUrl) return;
    
    if (isFavorite(imgData.id)) {
      const fav = favorites.find(f => f.imageId === imgData.id || f.image === imageUrl);
      if (fav) {
        removeFromFavorites(fav.id);
      }
    } else {
      addToFavorites(imageUrl, imgData.prompt);
      const currentFavs = JSON.parse(localStorage.getItem('scribbles_favorites') || '[]');
      const updatedFavs = currentFavs.map(f => {
        if (f.image === imageUrl) {
          return { ...f, imageId: imgData.id };
        }
        return f;
      });
      localStorage.setItem('scribbles_favorites', JSON.stringify(updatedFavs));
    }
  };

  const handleDelete = async (imgData) => {
    try {
      await deleteImageFromStorage(imgData.id);
      await refreshStorageStats();
      setDownloadedImages(prev => prev.filter(img => img.id !== imgData.id));
      setShowDeleteConfirm(null);
      if (selectedImage?.id === imgData.id) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const getImageTags = (imgId) => {
    const fav = favorites.find(f => f.imageId === imgId);
    return fav?.tags || [];
  };

  const toggleTag = (imgData, tagId) => {
    const imageUrl = getImageUrl(imgData);
    if (!imageUrl) return;
    
    const currentTags = getImageTags(imgData.id);
    if (currentTags.includes(tagId)) {
      removeTagFromImage(imageUrl, tagId);
    } else {
      addTagToImage(imageUrl, tagId);
    }
  };

  return (
    <main className="chat-area">
      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--muted-foreground)' }}>Loading images...</p>
        </div>
      ) : (
        <>
          <GalleryHeader 
            filter={filter}
            setFilter={setFilter}
            downloadedImages={downloadedImages}
            onBack={onBack}
          />
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <GalleryGrid 
              filteredImages={filteredImages}
              getImageUrl={getImageUrl}
              isFavorite={isFavorite}
              onSelect={setSelectedImage}
              onFavorite={handleFavorite}
              onDelete={(img) => setShowDeleteConfirm(img)}
            />
          </div>
        </>
      )}

      <GalleryModal 
        selectedImage={selectedImage}
        getImageUrl={getImageUrl}
        isFavorite={isFavorite}
        tags={tags}
        getImageTags={getImageTags}
        toggleTag={(tagId) => toggleTag(selectedImage, tagId)}
        onClose={() => setSelectedImage(null)}
        onFavorite={handleFavorite}
        onDelete={(img) => setShowDeleteConfirm(img)}
      />

      {showDeleteConfirm && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '24px'
          }}
          onClick={() => setShowDeleteConfirm(null)}
          onKeyDown={(e) => e.key === 'Escape' && setShowDeleteConfirm(null)}
        >
          <div 
            role="document"
            style={{
              background: 'var(--card)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Delete Image?</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--muted-foreground)', fontSize: '14px' }}>
              This will permanently remove this image from your gallery and storage. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="download-btn secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="download-btn"
                onClick={() => handleDelete(showDeleteConfirm)}
                style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
