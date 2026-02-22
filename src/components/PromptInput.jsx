import { useState, useRef, useEffect } from 'react';
import { useChat, PROMPT_TEMPLATES, STYLE_PRESETS } from '../context/ChatContext';

export default function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState([]);
  const { sendMessage, cancelGeneration, isGenerating, settings, updateSettings } = useChat();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [prompt]);

  const handleFilesAdded = (files) => {
    const newAttachments = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newAttachments.push(e.target.result);
        if (newAttachments.length === files.length) {
          setAttachments(prev => [...prev, ...newAttachments]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() && attachments.length === 0) return;
    
    await sendMessage(prompt, attachments, settings.batchCount);
    
    setPrompt('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {attachments.map((attachment, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img 
                src={attachment} 
                alt="" 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} 
              />
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--destructive)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="input-wrapper">
        <button
          type="button"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = (e) => {
              const files = Array.from(e.target.files);
              handleFilesAdded(files);
            };
            input.click();
          }}
          style={{
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Attach image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create..."
          className="prompt-input"
          rows={1}
        />
      </div>
      
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--border)', marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 150px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Number of Images</span>
            <select
              value={settings.batchCount}
              onChange={(e) => updateSettings({ batchCount: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                fontSize: '13px'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '1 1 150px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Style Preset</span>
            <select
              value={settings.stylePreset}
              onChange={(e) => updateSettings({ stylePreset: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                fontSize: '13px'
              }}
            >
              {STYLE_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '1 1 150px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Seed (optional)</span>
            <input
              type="text"
              value={settings.seed || ''}
              onChange={(e) => updateSettings({ seed: e.target.value })}
              placeholder="Enter seed"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--secondary)',
                color: 'var(--foreground)',
                fontSize: '13px'
              }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', marginTop: '12px' }}>
        {isGenerating ? (
          <button
            type="button"
            onClick={cancelGeneration}
            className="generate-btn cancel"
            style={{ width: '100%', padding: '14px 20px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="generate-btn"
            disabled={!prompt.trim() && attachments.length === 0}
            style={{ width: '100%', padding: '14px 20px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Generate
          </button>
        )}
      </div>
    </form>
  );
}
