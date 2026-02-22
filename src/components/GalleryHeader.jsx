export default function GalleryHeader({ filter, setFilter, downloadedImages, onBack }) {
  return (
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
        <h1 className="chat-title">Image Gallery</h1>
      </div>
      
      <div className="header-actions">
        <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
          {downloadedImages?.length || 0} image{(downloadedImages?.length || 0) !== 1 ? 's' : ''}
        </span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            fontSize: '13px'
          }}
        >
          <option value="all">All Images</option>
          <option value="favorites">Favorites Only</option>
        </select>
      </div>
    </header>
  );
}
