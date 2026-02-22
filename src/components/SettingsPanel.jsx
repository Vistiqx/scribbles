import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import ThemeSelector from './ThemeSelector';

export default function SettingsPanel({ isOpen, onClose }) {
  const { settings, updateSettings, clearAllConversations, tags, addTag, removeTag, exportData, importData, allConversations, favorites, clearAllFavorites, storageStats, clearAllImageStorage, refreshStorageStats } = useChat();
  const [newTagName, setNewTagName] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showClearConfirm, setShowClearConfirm] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      refreshStorageStats();
    }
    return () => {
      initialized.current = false;
    };
  }, [isOpen, refreshStorageStats]);

  const handleClearOldImages = () => {
    setShowClearConfirm('oldImages');
  };

  const handleClearFavorites = () => {
    setShowClearConfirm('favorites');
  };

  const handleClearImageCache = async () => {
    setShowClearConfirm('imageCache');
  };

  const handleDeleteAllConversations = () => {
    setShowClearConfirm('deleteAllConversations');
  };

  const confirmClear = async () => {
    if (showClearConfirm === 'oldImages') {
      const updated = allConversations.map(conv => ({
        ...conv,
        messages: conv.messages?.map(msg => ({
          ...msg,
          image: msg.role === 'user' ? msg.image : null
        })) || []
      }));
      localStorage.setItem('scribbles_conversations', JSON.stringify(updated));
      window.location.reload();
    } else if (showClearConfirm === 'favorites') {
      clearAllFavorites();
    } else if (showClearConfirm === 'imageCache') {
      await clearAllImageStorage();
      await refreshStorageStats();
      alert('Image cache cleared successfully.');
    } else if (showClearConfirm === 'deleteAllConversations') {
      clearAllConversations();
      onClose?.();
    }
    setShowClearConfirm(null);
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  const handleExport = (format) => {
    const data = exportData(format);
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([data], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scribbles-${format}-${Date.now()}.${format === 'json' ? 'json' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const success = importData(text);
        
        if (success) {
          alert('Import successful! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Failed to import file');
      }
    };
    input.click();
  };

  return (
    <>
      <div 
        className="overlay" 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose?.()}
        role="presentation"
      ></div>
      <div className="settings-panel">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '12px 16px',
              background: activeTab === 'general' ? 'transparent' : 'transparent',
              color: activeTab === 'general' ? 'var(--primary)' : 'var(--muted-foreground)',
              border: 'none',
              borderBottom: activeTab === 'general' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('data')}
            style={{
              padding: '12px 16px',
              background: activeTab === 'data' ? 'transparent' : 'transparent',
              color: activeTab === 'data' ? 'var(--primary)' : 'var(--muted-foreground)',
              border: 'none',
              borderBottom: activeTab === 'data' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Data
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === 'tags' ? 'transparent' : 'transparent',
              color: activeTab === 'tags' ? 'var(--primary)' : 'var(--muted-foreground)',
              border: 'none',
              borderBottom: activeTab === 'tags' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Tags
          </button>
        </div>

        <div className="settings-content" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'general' && (
            <>
              <div className="settings-section">
                <span className="settings-label">Theme</span>
                <div style={{ marginTop: '4px' }}>
                  <ThemeSelector />
                </div>
              </div>

              <div className="settings-section">
                <span className="settings-label">Default Settings</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Default Aspect Ratio</span>
                    <select
                      value={settings.defaultAspectRatio}
                      onChange={(e) => updateSettings({ defaultAspectRatio: e.target.value })}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--secondary)', color: 'var(--foreground)' }}
                    >
                      <option value="1:1">1:1 Square (1024×1024)</option>
                      <option value="16:9">16:9 Landscape (1344×768)</option>
                      <option value="9:16">9:16 Portrait (768×1344)</option>
                      <option value="4:3">4:3 Standard (1184×864)</option>
                      <option value="3:4">3:4 Portrait (864×1184)</option>
                      <option value="2:3">2:3 Portrait (832×1248)</option>
                      <option value="3:2">3:2 Landscape (1248×832)</option>
                      <option value="4:5">4:5 Portrait (896×1152)</option>
                      <option value="5:4">5:4 Landscape (1152×896)</option>
                      <option value="21:9">21:9 Ultrawide (1536×672)</option>
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Default Quality</span>
                    <select
                      value={settings.defaultQuality}
                      onChange={(e) => updateSettings({ defaultQuality: e.target.value })}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--secondary)', color: 'var(--foreground)' }}
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Default Image Size</span>
                    <select
                      value={settings.defaultImageSize || '1K'}
                      onChange={(e) => updateSettings({ defaultImageSize: e.target.value })}
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--secondary)', color: 'var(--foreground)' }}
                    >
                      <option value="1K">1K (Standard)</option>
                      <option value="2K">2K (Higher)</option>
                      <option value="4K">4K (Highest)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <button 
                  className="danger-btn"
                  onClick={handleDeleteAllConversations}
                >
                  Delete All Conversations
                </button>
              </div>
            </>
          )}

          {activeTab === 'data' && (
            <>
              <div className="settings-section">
                <span className="settings-label">Storage Management</span>
                <div style={{ 
                  padding: '16px', 
                  background: 'var(--secondary)', 
                  borderRadius: '8px', 
                  marginBottom: '16px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px' }}>IndexedDB Storage:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{storageStats.formatted}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px' }}>Images Stored:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{storageStats.imageCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px' }}>Storage Limit:</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{storageStats.limitFormatted}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>Storage Limit:</span>
                    <select
                      value={settings.maxStorageMB || 500}
                      onChange={(e) => updateSettings({ maxStorageMB: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                    >
                      <option value="100">100 MB</option>
                      <option value="250">250 MB</option>
                      <option value="500">500 MB</option>
                      <option value="1000">1 GB</option>
                      <option value="2000">2 GB</option>
                      <option value="5000">5 GB</option>
                      <option value="10000">10 GB</option>
                    </select>
                  </div>
                  <div style={{ 
                    height: '10px', 
                    background: 'var(--border)', 
                    borderRadius: '5px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min((storageStats.bytes / storageStats.limit) * 100, 100)}%`,
                      background: storageStats.bytes > storageStats.limit * 0.9 ? 'var(--destructive)' : 'var(--primary)',
                      borderRadius: '5px'
                    }} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
                    Download images to save them permanently. Images are stored in IndexedDB for unlimited storage.
                  </p>
                </div>
              </div>

              <div className="settings-section">
                <span className="settings-label">Export Data</span>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  Download your data in different formats
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className="download-btn"
                    onClick={() => handleExport('json')}
                    style={{ flex: 1 }}
                  >
                    JSON (Full Backup)
                  </button>
                  <button 
                    className="download-btn secondary"
                    onClick={() => handleExport('csv')}
                    style={{ flex: 1 }}
                  >
                    CSV (Spreadsheet)
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <span className="settings-label">Import Data</span>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  Restore from a JSON backup file
                </p>
                <button 
                  className="download-btn secondary"
                  onClick={handleImport}
                  style={{ width: '100%' }}
                >
                  Import JSON Backup
                </button>
              </div>

              <div className="settings-section">
                <span className="settings-label">Clear Data</span>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  Manage stored data and cached images
                </p>
                <button 
                  className="download-btn secondary"
                  onClick={handleClearOldImages}
                  style={{ width: '100%', marginBottom: '8px' }}
                >
                  Clear Images from Conversations
                </button>
                
                <button 
                  className="danger-btn"
                  onClick={handleClearFavorites}
                  style={{ width: '100%' }}
                >
                  Clear All Favorites
                </button>
              </div>
            </>
          )}

          {activeTab === 'tags' && (
            <>
              <div className="settings-section">
                <span className="settings-label">Manage Tags</span>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '12px' }}>
                  Create tags to organize your favorite images
                </p>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter tag name..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--secondary)',
                      color: 'var(--foreground)',
                      fontSize: '13px'
                    }}
                  />
                  <button
                    onClick={handleAddTag}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tags.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', textAlign: 'center', padding: '16px' }}>
                      No tags created yet
                    </p>
                  ) : (
                    tags.map(tag => (
                      <div
                        key={tag.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: 'var(--secondary)',
                          borderRadius: '6px',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <span style={{ fontSize: '13px' }}>{tag.name}</span>
                        <button
                          onClick={() => removeTag(tag.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--destructive)',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {showClearConfirm && (
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
            onClick={() => setShowClearConfirm(null)}
            onKeyDown={(e) => e.key === 'Escape' && setShowClearConfirm(null)}
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
              <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>
                {showClearConfirm === 'oldImages' && 'Clear Images from Conversations?'}
                {showClearConfirm === 'favorites' && 'Clear All Favorites?'}
                {showClearConfirm === 'imageCache' && 'Clear Image Cache?'}
                {showClearConfirm === 'deleteAllConversations' && 'Delete All Conversations?'}
              </h3>
              <p style={{ margin: '0 0 24px', color: 'var(--muted-foreground)', fontSize: '14px' }}>
                {showClearConfirm === 'oldImages' && 'This will remove all generated images from conversations but keep your prompts. Images in Favorites will not be affected.'}
                {showClearConfirm === 'favorites' && 'This will delete all your favorited images. This action cannot be undone.'}
                {showClearConfirm === 'imageCache' && 'This will permanently delete ALL downloaded images from storage. This action cannot be undone.'}
                {showClearConfirm === 'deleteAllConversations' && 'This will permanently delete all conversations and messages. This action cannot be undone.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setShowClearConfirm(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--secondary)',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClear}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--destructive)',
                    color: 'var(--destructive-foreground)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showClearConfirm === 'oldImages' && 'Clear'}
                  {showClearConfirm === 'favorites' && 'Clear All'}
                  {showClearConfirm === 'imageCache' && 'Delete All'}
                  {showClearConfirm === 'deleteAllConversations' && 'Delete All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
