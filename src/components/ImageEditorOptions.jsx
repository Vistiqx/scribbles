const RESOLUTIONS = {
  '1:1': { width: 1024, height: 1024, label: '1:1 Square (1024x1024)' },
  '16:9': { width: 1344, height: 768, label: '16:9 Landscape (1344x768)' },
  '9:16': { width: 768, height: 1344, label: '9:16 Portrait (768x1344)' },
  '4:3': { width: 1024, height: 768, label: '4:3 Standard (1024x768)' },
  'HD': { width: 1920, height: 1080, label: 'HD (1920x1080)' },
  '4K': { width: 3840, height: 2160, label: '4K (3840x2160)' },
};

export default function ImageEditorOptions({ mode, resolution, setResolution, variationCount, setVariationCount }) {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
      {mode === 'variations' && (
        <div style={{ flex: 1, minWidth: '150px' }}>
          <span style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Resolution:</span>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
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
            {Object.entries(RESOLUTIONS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      )}
      {mode === 'variations' && (
        <div style={{ flex: 1, minWidth: '150px' }}>
          <span style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Count:</span>
          <select
            value={variationCount}
            onChange={(e) => setVariationCount(Number(e.target.value))}
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
            {[2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}
      {mode === 'transform' && (
        <div style={{ flex: 1, minWidth: '200px' }}>
          <span style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>Resolution:</span>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
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
            {Object.entries(RESOLUTIONS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
