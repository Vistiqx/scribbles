import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import logo from '../assets/Scribbles-Logo.webp';

export default function Sidebar({ onSettingsClick, isOpen, onClose, onShowGallery, onShowFavorites }) {
  const { conversations, activeConversationId, startNewChat, selectConversation, deleteChat, searchQuery, setSearchQuery, favorites } = useChat();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleConversationClick = (id) => {
    selectConversation(id);
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteChat(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img 
          src={logo} 
          alt="Scribbles" 
          style={{ width: '100%', maxWidth: '180px', objectFit: 'contain' }} 
        />
      </div>

      <button className="new-chat-btn" onClick={startNewChat}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Chat
      </button>

      <div style={{ padding: '8px 12px' }}>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '0 12px', marginBottom: '8px' }}>
        <button
          onClick={onShowGallery}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Gallery
        </button>
        <button
          onClick={onShowFavorites}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--secondary)',
            color: 'var(--foreground)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Favorites ({favorites.length})
        </button>
      </div>

      <div className="conversation-list">
        {!activeConversationId ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--sidebar-foreground)', fontSize: '16px', fontWeight: '500' }}>
            Start a new chat to begin
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '13px' }}>
            No conversations found
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
              onClick={() => handleConversationClick(conv.id)}
            >
              <span className="conversation-title">{conv.title}</span>
              <span 
                className="delete-btn"
                onClick={(e) => handleDelete(e, conv.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleDelete(e, conv.id)}
                role="button"
                tabIndex={0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="settings-btn" onClick={onSettingsClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </button>
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
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>Delete Conversation?</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--muted-foreground)', fontSize: '14px' }}>
              This will permanently delete this conversation and all its messages. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteConfirm(null)}
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
                onClick={confirmDelete}
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
