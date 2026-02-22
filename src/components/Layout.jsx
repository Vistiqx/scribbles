import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import SettingsPanel from './SettingsPanel';
import ImageGallery from './ImageGallery';
import FavoritesView from './FavoritesView';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleShowGallery = () => {
    setShowGallery(true);
    setShowFavorites(false);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setShowGallery(false);
  };

  const handleBackToChat = () => {
    setShowGallery(false);
    setShowFavorites(false);
  };

  return (
    <div className="app-container">
      <Sidebar 
        onSettingsClick={() => setSettingsOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onShowGallery={handleShowGallery}
        onShowFavorites={handleShowFavorites}
      />

      {showGallery ? (
        <ImageGallery onBack={handleBackToChat} />
      ) : showFavorites ? (
        <FavoritesView onBack={handleBackToChat} />
      ) : (
        <ChatArea />
      )}

      <SettingsPanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}
