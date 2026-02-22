import { useState, useRef, useReducer } from 'react';
import {
  convertImageLocally,
  convertImagesBatch,
  downloadConvertedImage,
  downloadBatchAsZip,
  formatFileSize
} from '../utils/imageConverter';
import { generateImage } from '../utils/api';

const initialState = {
  files: [],
  convertedFiles: [],
  format: 'png',
  quality: 90,
  isConverting: false,
  progress: 0,
  isDragging: false,
  useAI: false,
  showAIWarning: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.payload], convertedFiles: [] };
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter((_, i) => i !== action.payload) };
    case 'SET_CONVERTED_FILES':
      return { ...state, convertedFiles: action.payload };
    case 'SET_FORMAT':
      return { ...state, format: action.payload };
    case 'SET_QUALITY':
      return { ...state, quality: action.payload };
    case 'SET_CONVERTING':
      return { ...state, isConverting: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_DRAGGING':
      return { ...state, isDragging: action.payload };
    case 'TOGGLE_AI':
      return { ...state, useAI: !state.useAI, showAIWarning: !state.useAI ? action.payload : false };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export default function ImageConverter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_DRAGGING', payload: false });
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (droppedFiles.length > 0) {
      dispatch({ type: 'ADD_FILES', payload: droppedFiles });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      dispatch({ type: 'ADD_FILES', payload: selectedFiles });
    }
    e.target.value = '';
  };

  const handleConvert = async () => {
    if (state.files.length === 0) return;

    dispatch({ type: 'SET_CONVERTING', payload: true });
    dispatch({ type: 'SET_PROGRESS', payload: 0 });

    try {
      if (state.useAI) {
        const results = [];
        for (let i = 0; i < state.files.length; i++) {
          try {
            const result = await generateImage('Convert this image to ' + state.format, {
              attachments: [state.files[i]],
              model: 'google/gemini-2.0-flash-exp'
            });
            if (result.image) {
              results.push({ filename: state.files[i].name, image: result.image });
            }
          } catch (err) {
            console.error('AI conversion failed:', err);
          }
          dispatch({ type: 'SET_PROGRESS', payload: ((i + 1) / state.files.length) * 100 });
        }
        dispatch({ type: 'SET_CONVERTED_FILES', payload: results });
      } else {
        if (state.files.length === 1) {
          const result = await convertImageLocally(state.files[0], { format: state.format, quality: state.quality });
          dispatch({ type: 'SET_CONVERTED_FILES', payload: [{ filename: state.files[0].name, ...result }] });
        } else {
          const results = await convertImagesBatch(state.files, { format: state.format, quality: state.quality, onProgress: (current, total) => {
            dispatch({ type: 'SET_PROGRESS', payload: (current / total) * 100 });
          }});
          dispatch({ type: 'SET_CONVERTED_FILES', payload: results });
        }
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert images. Please try again.');
    } finally {
      dispatch({ type: 'SET_CONVERTING', payload: false });
    }
  };

  const handleDownload = (result) => {
    downloadConvertedImage(result);
  };

  const handleDownloadAll = () => {
    downloadBatchAsZip(state.convertedFiles);
  };

  return (
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '20px' }}>Convert Images</h2>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); dispatch({ type: 'SET_DRAGGING', payload: true }); }}
          onDragLeave={(e) => { e.preventDefault(); dispatch({ type: 'SET_DRAGGING', payload: false }); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${state.isDragging ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: state.isDragging ? 'rgba(59, 130, 246, 0.1)' : 'var(--secondary)',
            transition: 'border-color 0.2s, background 0.2s',
            flexShrink: 0
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>Drop images here or click to browse</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />

        {state.files.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>Selected Files ({state.files.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.files.map((file, index) => (
                <div key={file.name + file.size} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'var(--secondary)', borderRadius: '8px' }}>
                  <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{formatFileSize(file.size)}</span>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_FILE', payload: index })}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'var(--destructive)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <span style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Output Format</span>
            <select
              value={state.format}
              onChange={(e) => dispatch({ type: 'SET_FORMAT', payload: e.target.value })}
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
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          
          {state.format !== 'png' && (
            <div style={{ flex: 1, minWidth: '120px' }}>
              <span style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Quality: {state.quality}%</span>
              <input
                type="range"
                min="10"
                max="100"
                value={state.quality}
                onChange={(e) => dispatch({ type: 'SET_QUALITY', payload: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleConvert}
          disabled={state.isConverting || state.files.length === 0}
          className="generate-btn"
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '600',
            opacity: state.isConverting || state.files.length === 0 ? 0.6 : 1,
            cursor: state.isConverting || state.files.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {state.isConverting ? `Converting... ${Math.round(state.progress)}%` : `Convert ${state.files.length} Image${state.files.length !== 1 ? 's' : ''}`}
        </button>

        {state.convertedFiles.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Converted ({state.convertedFiles.length})</h3>
              <button 
                onClick={handleDownloadAll}
                className="download-btn secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Download All (ZIP)
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.convertedFiles.map((result, index) => (
                <div key={result.filename} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--secondary)', borderRadius: '8px' }}>
                  <span style={{ flex: 1, fontSize: '13px' }}>{result.filename}</span>
                  {result.width && <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{result.width}×{result.height}</span>}
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{result.convertedSize ? formatFileSize(result.convertedSize) : ''}</span>
                  <button
                    onClick={() => handleDownload(result)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
