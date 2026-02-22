import { downloadFile, convertBase64ToFormat } from '../utils/imageUtils';

export default function GalleryModal({ selectedImage, getImageUrl, isFavorite, tags, getImageTags, toggleTag, onClose, onFavorite, onDelete }) {
  if (!selectedImage) return null;

  const imageUrl = getImageUrl(selectedImage);

  const handleDownload = async (format) => {
    if (!imageUrl) return;
    const converted = await convertBase64ToFormat(imageUrl, format);
    downloadFile(converted, `gallery-image-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`, format);
  };

  return (
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
        zIndex: 1000,
        padding: '24px'
      }}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div 
        role="document"
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          background: 'var(--card)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt={selectedImage.prompt || 'Downloaded image'}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />
        {selectedImage.prompt && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '14px' }}>{selectedImage.prompt}</p>
          </div>
        )}
        
        {tags.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: 'none',
                  background: getImageTags(selectedImage.id).includes(tag.id) ? 'var(--primary)' : 'var(--muted)',
                  color: getImageTags(selectedImage.id).includes(tag.id) ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
        
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}>
          <button 
            className="download-btn"
            onClick={() => handleDownload('png')}
          >
            PNG
          </button>
          <button 
            className="download-btn secondary"
            onClick={() => handleDownload('jpeg')}
          >
            JPEG
          </button>
          <button 
            className="download-btn secondary"
            onClick={() => handleDownload('webp')}
          >
            WEBP
          </button>
          <button 
            className="download-btn"
            onClick={() => onFavorite(selectedImage)}
            style={{ 
              background: isFavorite(selectedImage.id) ? 'var(--primary)' : 'var(--secondary)',
              border: '1px solid var(--border)'
            }}
            title={isFavorite(selectedImage.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite(selectedImage.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button 
            className="download-btn"
            onClick={() => onDelete(selectedImage)}
            style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
