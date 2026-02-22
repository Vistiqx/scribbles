import { useState, useRef, useCallback } from 'react';

export default function ImageEditorUpload({ attachedImages, onFilesAdded, onRemoveImage, fileInputRef }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    onFilesAdded(files);
  }, [onFilesAdded]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'var(--secondary)',
          transition: 'border-color 0.2s, background 0.2s'
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>Drop image here or click to browse</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files);
          onFilesAdded(files);
          e.target.value = '';
        }}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />
      {attachedImages.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          {attachedImages.map((img, i) => (
            <div key={img.substring(0, 30)} style={{ position: 'relative', width: '80px', height: '80px' }}>
              <img 
                src={img} 
                alt="" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <button
                onClick={() => onRemoveImage(i)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--destructive)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
