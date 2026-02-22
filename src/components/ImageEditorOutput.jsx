import { downloadFile } from '../utils/imageUtils';

export default function ImageEditorOutput({ generatedImages, isGenerating, onDownload }) {
  const handleDownload = async (img, index) => {
    const prefix = `edited-${index + 1}`;
    const converted = await downloadFile(img.image, `${prefix}.png`, 'png', {
      prompt: img.prompt,
      conversationId: img.conversationId,
      messageId: img.messageId
    }, img.image);
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < generatedImages.length; i++) {
      await handleDownload(generatedImages[i], i);
    }
  };

  if (generatedImages.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Generated Images</h3>
        <button 
          onClick={handleDownloadAll}
          className="download-btn secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Download All
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        {generatedImages.map((img, i) => (
          <div key={img.image?.substring(0, 30) || i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img 
              src={img.image} 
              alt={img.prompt || 'Generated image'} 
              style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} 
            />
            <button
              onClick={() => handleDownload(img, i)}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                padding: '6px',
                borderRadius: '4px',
                border: 'none',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
