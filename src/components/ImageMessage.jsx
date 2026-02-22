import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { downloadFile, downloadAllFormats, convertBase64ToFormat } from '../utils/imageUtils';

export default function ImageMessage({ image, prompt, conversationId, messageId }) {
  const [isDownloading, setIsDownloading] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const { addToFavorites, removeFromFavorites, favorites, refreshStorageStats, tags, addTagToImage, removeTagFromImage } = useChat();

  const isFavorite = favorites.some(f => f.image === image);
  
  const getImageTags = () => {
    const fav = favorites.find(f => f.image === image);
    return fav?.tags || [];
  };
  
  const toggleTag = (tagId) => {
    const currentTags = getImageTags();
    if (currentTags.includes(tagId)) {
      removeTagFromImage(image, tagId);
    } else {
      addTagToImage(image, tagId);
    }
  };

  if (!image) {
    return (
      <div className="image-container">
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
          No image data available
        </div>
      </div>
    );
  }

  const getBase64Data = (dataUrl) => {
    if (!dataUrl) return null;
    if (dataUrl.includes(',')) {
      return dataUrl.split(',')[1];
    }
    return dataUrl;
  };

  const handleDownload = async (format) => {
    if (isDownloading) return;
    
    setIsDownloading(format);
    try {
      const metadata = { prompt, conversationId, messageId };
      if (format === 'all') {
        await downloadAllFormats(image, 'scribbles-image', metadata);
      } else {
        let base64Data;
        if (format === 'png') {
          base64Data = getBase64Data(image);
          if (!base64Data) {
            base64Data = await convertBase64ToFormat(image, format);
          }
        } else {
          base64Data = await convertBase64ToFormat(image, format);
        }
        const filename = `scribbles-image.${format === 'jpeg' ? 'jpg' : format}`;
        // Pass original image data to avoid saving duplicates
        downloadFile(base64Data, filename, format, metadata, image);
      }
      await refreshStorageStats();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleImageError = () => {
    console.error('Failed to load image');
    setImageError(true);
  };

  return (
    <div className="image-container">
      {imageError ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--destructive)' }}>
          Failed to load image
        </div>
      ) : (
        <img 
          src={image} 
          alt="Generated" 
          onError={handleImageError}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <div className="download-buttons">
        <button 
          className="download-btn"
          onClick={() => handleDownload('png')}
          disabled={isDownloading || imageError}
        >
          {isDownloading === 'png' ? '...' : 'PNG'}
        </button>
        <button 
          className="download-btn secondary"
          onClick={() => handleDownload('jpeg')}
          disabled={isDownloading || imageError}
        >
          {isDownloading === 'jpeg' ? '...' : 'JPEG'}
        </button>
        <button 
          className="download-btn secondary"
          onClick={() => handleDownload('webp')}
          disabled={isDownloading || imageError}
        >
          {isDownloading === 'webp' ? '...' : 'WEBP'}
        </button>
        <button 
          className="download-btn"
          onClick={() => handleDownload('all')}
          disabled={isDownloading || imageError}
        >
          {isDownloading === 'all' ? '...' : 'All (ZIP)'}
        </button>
        <button 
          className="download-btn"
          onClick={() => isFavorite ? removeFromFavorites(favorites.find(f => f.image === image)?.id) : addToFavorites(image, prompt)}
          disabled={isDownloading || imageError}
          style={{
            background: isFavorite ? 'var(--primary)' : 'var(--secondary)',
            border: '1px solid var(--border)'
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        {tags.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button 
              className="download-btn"
              onClick={() => setShowTagMenu(!showTagMenu)}
              disabled={isDownloading || imageError}
              style={{
                background: getImageTags().length > 0 ? 'var(--primary)' : 'var(--secondary)',
                border: '1px solid var(--border)',
                minWidth: '32px',
                padding: '6px'
              }}
              title="Tag image"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              {getImageTags().length > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--primary)', borderRadius: '50%', width: '14px', height: '14px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getImageTags().length}
                </span>
              )}
            </button>
            {showTagMenu && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                right: '0',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                maxWidth: '200px',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginBottom: '8px'
              }}>
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      border: 'none',
                      background: getImageTags().includes(tag.id) ? 'var(--primary)' : 'var(--muted)',
                      color: getImageTags().includes(tag.id) ? 'var(--primary-foreground)' : 'var(--foreground)',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
