import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Layout />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
