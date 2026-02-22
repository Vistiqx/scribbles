import { useState, useRef, useReducer } from 'react';
import { generateImage } from '../utils/api';
import { convertBase64ToFormat, downloadAllFormats } from '../utils/imageUtils';
import ImageEditorModes from './ImageEditorModes';
import ImageEditorUpload from './ImageEditorUpload';
import ImageEditorOptions from './ImageEditorOptions';
import ImageEditorOutput from './ImageEditorOutput';

const initialState = {
  mode: 'variations',
  prompt: '',
  resolution: '1:1',
  variationCount: 3,
  isGenerating: false,
  generatedImages: [],
  attachedImages: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_RESOLUTION':
      return { ...state, resolution: action.payload };
    case 'SET_VARIATION_COUNT':
      return { ...state, variationCount: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATED_IMAGES':
      return { ...state, generatedImages: action.payload };
    case 'ADD_ATTACHMENTS':
      return { ...state, attachedImages: [...state.attachedImages, ...action.payload] };
    case 'REMOVE_ATTACHMENT':
      return { ...state, attachedImages: state.attachedImages.filter((_, i) => i !== action.payload) };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export default function ImageEditor({ selectedImage, onClose }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    attachedImages: selectedImage ? [selectedImage] : []
  });
  
  const fileInputRef = useRef(null);

  const handleFilesAdded = (files) => {
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          dispatch({ type: 'ADD_ATTACHMENTS', payload: newImages });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (state.attachedImages.length === 0) {
      alert('Please attach an image first');
      return;
    }

    if (state.mode === 'remove-bg') {
      alert('Background removal requires API access. Please configure your API key.');
      return;
    }

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_GENERATED_IMAGES', payload: [] });

    try {
      const images = [];
      for (let i = 0; i < state.variationCount; i++) {
        try {
          const response = await generateImage(state.prompt || 'Generate variations of this image', {
            model: 'google/gemini-2.0-flash-exp',
            attachments: state.attachedImages,
            aspectRatio: state.resolution
          });
          if (response.image) {
            images.push({ image: response.image, prompt: state.prompt });
          }
        } catch (err) {
          console.error(`Failed to generate image ${i + 1}:`, err);
        }
      }

      if (images.length > 0) {
        dispatch({ type: 'SET_GENERATED_IMAGES', payload: images });
      } else {
        alert('Failed to generate images. Please check your API key.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  return (
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Image Tools</h2>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--foreground)',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <ImageEditorModes mode={state.mode} setMode={(mode) => dispatch({ type: 'SET_MODE', payload: mode })} />
        
        <div style={{ marginTop: '20px' }}>
          <ImageEditorUpload
            attachedImages={state.attachedImages}
            onFilesAdded={handleFilesAdded}
            onRemoveImage={(i) => dispatch({ type: 'REMOVE_ATTACHMENT', payload: i })}
            fileInputRef={fileInputRef}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <textarea
            value={state.prompt}
            onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
            placeholder={state.mode === 'variations' 
              ? 'Optional: Describe what you want to change in the variations...' 
              : state.mode === 'transform'
                ? 'Describe how you want to transform the image...'
                : 'Enter prompt for image...'
            }
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <ImageEditorOptions 
          mode={state.mode}
          resolution={state.resolution}
          setResolution={(r) => dispatch({ type: 'SET_RESOLUTION', payload: r })}
          variationCount={state.variationCount}
          setVariationCount={(c) => dispatch({ type: 'SET_VARIATION_COUNT', payload: c })}
        />

        <button
          onClick={handleGenerate}
          disabled={state.isGenerating || state.attachedImages.length === 0}
          className="generate-btn"
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '15px',
            fontSize: '14px',
            fontWeight: '600',
            opacity: state.isGenerating || state.attachedImages.length === 0 ? 0.6 : 1,
            cursor: state.isGenerating || state.attachedImages.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {state.isGenerating ? 'Generating...' : `Generate ${state.variationCount}`}
        </button>

        <ImageEditorOutput 
          generatedImages={state.generatedImages}
          isGenerating={state.isGenerating}
        />
      </div>
    </div>
  );
}
