import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { themes, currentTheme, changeTheme } = useTheme();

  return (
    <select
      value={currentTheme}
      onChange={(e) => changeTheme(e.target.value)}
      style={{
        width: '100%',
        padding: '8px',
        marginTop: '4px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: 'var(--secondary)',
        color: 'var(--foreground)',
        fontSize: '14px',
        cursor: 'pointer'
      }}
    >
      {themes.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.name}
        </option>
      ))}
    </select>
  );
}
