import { useEffect, useRef, useState } from 'react';
import { useChat, AVAILABLE_MODELS } from '../context/ChatContext';
import Message from './Message';
import PromptInput from './PromptInput';
import ImageConverter from './ImageConverter';
import ImageEditor from './ImageEditor';
import logo from '../assets/Scribbles-AI-Generator.webp';

export default function ChatArea() {
  const { activeConversation, isGenerating, settings, updateSettings, updateConversationTitle } = useChat();
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const titleInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isGenerating]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const getTitle = () => {
    if (!activeConversation) {
      return 'Design at the Speed of Thought';
    }
    return activeConversation.title || 'New Chat';
  };

  const handleTitleClick = () => {
    if (activeConversation) {
      setEditedTitle(activeConversation.title || 'New Chat');
      setIsEditingTitle(true);
    }
  };

  const handleTitleSubmit = () => {
    if (activeConversation && editedTitle.trim()) {
      updateConversationTitle(activeConversation.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  return (
    <main className="chat-area">
      <header className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              style={{
                fontSize: '18px',
                fontWeight: '400',
                color: 'var(--scribbles-primary)',
                fontFamily: "'Chewy', cursive",
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--scribbles-primary)',
                outline: 'none',
                padding: '0',
                width: '300px'
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 
                className="chat-title" 
                onClick={handleTitleClick}
                style={{ cursor: activeConversation ? 'pointer' : 'default' }}
                title={activeConversation ? 'Click to edit title' : ''}
              >
                {getTitle()}
              </h1>
              {activeConversation && (
                <svg 
                  onClick={handleTitleClick}
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--scribbles-primary)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer', opacity: 0.6 }}
                  title="Click to edit title"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 24px', background: 'var(--sidebar)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => setActiveTab('generate')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(245, 91, 84, 0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'generate' ? '2px solid var(--primary)' : '2px solid transparent',
              color: 'var(--sidebar-foreground)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s'
            }}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(245, 91, 84, 0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'tools' ? '2px solid var(--primary)' : '2px solid transparent',
              color: 'var(--sidebar-foreground)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s'
            }}
          >
            Image Tools
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            onMouseEnter={(e) => e.target.style.background = 'rgba(245, 91, 84, 0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'convert' ? '2px solid var(--primary)' : '2px solid transparent',
              color: 'var(--sidebar-foreground)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s'
            }}
          >
            Convert
          </button>
        </div>
        
        <select
          value={settings.selectedModel}
          onChange={(e) => updateSettings({ selectedModel: e.target.value })}
          style={{ 
            background: 'var(--secondary)', 
            color: 'var(--secondary-foreground)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'generate' ? (
            <>
              <div className="messages-container">
                {!activeConversation ? (
                  <div className="welcome-message">
                    <img 
                      src={logo} 
                      alt="Scribbles" 
                      style={{ width: '100%', maxWidth: '625px', objectFit: 'contain', marginBottom: '16px' }} 
                    />
                    <p className="welcome-subtitle" style={{ fontFamily: "'Chewy', cursive", color: 'var(--scribbles-primary)', fontSize: '42px', textAlign: 'center', lineHeight: '1.3' }}>
                      Create and Edit Stunning Images With AI
                    </p>
                  </div>
                ) : (
                  activeConversation.messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                  ))
                )}
                {isGenerating && (
                  <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : activeTab === 'tools' ? (
            <ImageEditor />
          ) : (
            <ImageConverter />
          )}
        </div>
        {activeConversation && <PromptInput />}
      </div>
    </main>
  );
}
