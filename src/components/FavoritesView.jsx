import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { downloadFile, convertBase64ToFormat, deleteImageFromStorage } from '../utils/imageUtils';

export default function FavoritesView({ onBack }) {
  const { favorites, removeFromFavorites, tags, addTagToImage, removeTagFromImage, refreshStorageStats } = useChat();
  const [selectedTag, setSelectedTag] = useState('all');
  const [editingTagsFor, setEditingTagsFor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDownload = async (image, format) => {
    const base64 = image.split(',')[1];
    const converted = await convertBase64ToFormat(image, format);
    downloadFile(converted, `favorite-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`, format);
  };

  const handleDelete = async (fav) => {
    try {
      if (fav.imageId) {
        await deleteImageFromStorage(fav.imageId);
        await refreshStorageStats();
      }
      removeFromFavorites(fav.id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredFavorites = selectedTag === 'all' 
    ? favorites 
    : favorites.filter(f => f.tags?.includes(selectedTag));

  const toggleTag = (favId, tagId) => {
    const fav = favorites.find(f => f.id === favId);
    if (fav.tags?.includes(tagId)) {
      removeTagFromImage(fav.image, tagId);
    } else {
      addTagToImage(fav.image, tagId);
    }
  };

  return (
    <main className="chat-area">
      <header className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onBack}
            style={{ 
              padding: '8px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--foreground)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="chat-title">Favorites</h1>
        </div>
        
        <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          {favorites.length} saved image{favorites.length !== 1 ? 's' : ''}
        </span>
      </header>

      {tags.length > 0 && (
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedTag('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: selectedTag === 'all' ? 'var(--primary)' : 'var(--secondary)',
              color: selectedTag === 'all' ? 'var(--primary-foreground)' : 'var(--foreground)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: selectedTag === tag.id ? 'var(--primary)' : 'var(--secondary)',
                color: selectedTag === tag.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {favorites.length === 0 ? (
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p>No favorites yet</p>
            <p style={{ fontSize: '13px' }}>Click the heart icon on any image to save it here</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: 'var(--muted-foreground)' 
          }}>
            <p>No images with this tag</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {filteredFavorites.map((fav) => (
              <div 
                key={fav.id}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--secondary)'
                }}
              >
                <img 
                  src={fav.image} 
                  alt={fav.prompt || 'Favorite image'}
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '12px' }}>
                  <p style={{ 
                    margin: '0 0 8px', 
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {fav.prompt || 'No prompt'}
                  </p>
                  
                  {tags.length > 0 && (
                    <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(fav.id, tag.id)}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            border: 'none',
                            background: fav.tags?.includes(tag.id) ? 'var(--primary)' : 'var(--muted)',
                            color: fav.tags?.includes(tag.id) ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p style={{ 
                    margin: '0 0 12px', 
                    fontSize: '11px', 
                    color: 'var(--muted-foreground)' 
                  }}>
                    {formatDate(fav.createdAt)}
                  </p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="download-btn"
                      onClick={() => handleDownload(fav.image, 'png')}
                      style={{ flex: 1, fontSize: '11px', padding: '6px' }}
                    >
                      PNG
                    </button>
                    <button 
                      className="download-btn secondary"
                      onClick={() => handleDownload(fav.image, 'jpeg')}
                      style={{ flex: 1, fontSize: '11px', padding: '6px' }}
                    >
                      JPEG
                    </button>
                    <button 
                      className="download-btn secondary"
                      onClick={() => setShowDeleteConfirm(fav)}
                      style={{ 
                        flex: 1, 
                        fontSize: '11px', 
                        padding: '6px',
                        background: 'var(--destructive)',
                        color: 'var(--destructive-foreground)'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Remove from Favorites?</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--muted-foreground)', fontSize: '14px' }}>
              This will remove this image from your favorites. {showDeleteConfirm.imageId ? 'The image will also be deleted from storage.' : ''} This action cannot be undone.
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
