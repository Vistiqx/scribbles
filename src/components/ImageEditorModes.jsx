export default function ImageEditorModes({ mode, setMode }) {
  const modes = [
    { id: 'variations', label: 'Variations', description: 'Generate multiple variations of an image' },
    { id: 'transform', label: 'Transform', description: 'Transform the image based on your prompt' },
    { id: 'remove-bg', label: 'Remove BG', description: 'Remove background from an image' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: mode === m.id ? 'var(--primary)' : 'var(--secondary)',
              color: mode === m.id ? 'var(--primary-foreground)' : 'var(--foreground)',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted-foreground)' }}>
        {modes.find(m => m.id === mode)?.description}
      </p>
    </div>
  );
}
