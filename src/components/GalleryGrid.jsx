export default function GalleryGrid({ filteredImages, getImageUrl, isFavorite, onSelect, onFavorite, onDelete }) {
  if (filteredImages.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px', 
        color: 'var(--muted-foreground)' 
      }}>
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1"
          style={{ margin: '0 auto 16px', opacity: 0.5 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p>No downloaded images yet</p>
        <p style={{ fontSize: '13px' }}>Download an image from chat to add it to your gallery</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
      gap: '16px' 
    }}>
      {filteredImages.map((imgData) => {
        const imageUrl = getImageUrl(imgData);
        if (!imageUrl) return null;
        
        return (
          <div 
            key={imgData.id}
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--secondary)'
            }}
          >
            <img 
              src={imageUrl} 
              alt={imgData.prompt || 'Downloaded image'}
              style={{ 
                width: '100%', 
                aspectRatio: '1',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => onSelect(imgData)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(imgData)}
              role="button"
              tabIndex={0}
            />
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                onClick={() => onFavorite(imgData)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: 'none',
                  background: isFavorite(imgData.id) ? 'var(--primary)' : 'rgba(0,0,0,0.6)',
                  color: 'white',
                  cursor: 'pointer'
                }}
                title={isFavorite(imgData.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite(imgData.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button
                onClick={() => onDelete(imgData)}
                style={{
                  padding: '6px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  cursor: 'pointer'
                }}
                title="Delete image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
