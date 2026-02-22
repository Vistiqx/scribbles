import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  createConversation, 
  createMessage, 
  deleteConversation,
  generateTitle
} from '../utils/conversationManager';
import { generateImage, cancelRequest } from '../utils/api';
import * as imageUtils from '../utils/imageUtils';
import { 
  AVAILABLE_MODELS, 
  PROMPT_TEMPLATES, 
  STYLE_PRESETS, 
  DEFAULT_SETTINGS 
} from '../constants/appConstants';

export { AVAILABLE_MODELS, PROMPT_TEMPLATES, STYLE_PRESETS };

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useLocalStorage('scribbles_conversations', []);
  const [activeConversationId, setActiveConversationId] = useLocalStorage('scribbles_active_conversation', null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useLocalStorage('scribbles_settings', DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useLocalStorage('scribbles_favorites', []);
  const [tags, setTags] = useLocalStorage('scribbles_tags', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [storageStats, setStorageStats] = useState({ bytes: 0, imageCount: 0, formatted: '0 Bytes', limit: 500 * 1024 * 1024, limitFormatted: '500 MB' });
  const abortControllerRef = useRef(null);
  const pendingMessagesRef = useRef(null);

  useEffect(() => {
    const loadStorageStats = async () => {
      try {
        const stats = await imageUtils.getStorageStats();
        setStorageStats(stats);
      } catch (e) {
        console.error('Failed to load storage stats:', e);
      }
    };
    loadStorageStats();
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  const startNewChat = useCallback(() => {
    const newConv = createConversation('New Chat');
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setError(null);
  }, [setConversations]);

  const selectConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
    setError(null);
  }, []);

  const updateConversationTitle = useCallback((conversationId, newTitle) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, title: newTitle } : c
    ));
  }, [setConversations]);

  const deleteChat = useCallback(async (conversationId) => {
    const convToDelete = conversations.find(c => c.id === conversationId);
    
    if (convToDelete) {
      const allDownloadedIds = JSON.parse(localStorage.getItem('scribbles_downloaded_images') || '[]');
      const downloadedSet = new Set(allDownloadedIds);
      
      const imageIdsToDelete = [];
      (convToDelete.messages || []).forEach(msg => {
        if (msg.role === 'assistant' && msg.image) {
          const images = Array.isArray(msg.image) ? msg.image : [msg.image];
          images.forEach(img => {
            if (img && img.imageId && !downloadedSet.has(img.imageId)) {
              imageIdsToDelete.push(img.imageId);
            }
          });
        }
      });
      
      for (const imageId of imageIdsToDelete) {
        try {
          await imageUtils.deleteImageFromStorage(imageId);
        } catch (e) {
          console.error('Failed to delete image:', imageId, e);
        }
      }
    }
    
    setConversations(prev => {
      const updated = deleteConversation(prev, conversationId);
      if (conversationId === activeConversationId && updated.length > 0) {
        setActiveConversationId(updated[0].id);
      } else if (updated.length === 0) {
        setActiveConversationId(null);
      }
      return updated;
    });
    
    const stats = await imageUtils.getStorageStats();
    setStorageStats(stats);
  }, [activeConversationId, conversations, setConversations]);

  const getStorageUsed = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('scribbles_')) {
        total += localStorage[key].length * 2;
      }
    }
    return total;
  };

  const sendMessage = useCallback(async (prompt, attachments = [], batchCount = 1) => {
    if (!prompt.trim() && attachments.length === 0) return;
    if (!activeConversationId) return;

    const storageUsed = getStorageUsed();
    const maxStorage = (settings.maxStorageMB || 500) * 1024 * 1024;
    if (storageUsed > maxStorage) {
      setError(`Storage limit reached (${settings.maxStorageMB || 500}MB)! Please go to Settings > Data to clear some images or increase the storage limit.`);
      return;
    }

    const content = prompt.trim() || 'Describe this image';
    const userMessage = createMessage('user', content, null, attachments);
    
    // Get current conversation to check if it's the first message
    const currentConv = conversations.find(c => c.id === activeConversationId);
    const isFirstMessage = !currentConv || currentConv.messages.length === 0;
    const newTitle = isFirstMessage ? generateTitle(prompt || 'Image') : (currentConv?.title || 'New Chat');

    // Store messages in ref so we can use them after API call
    pendingMessagesRef.current = {
      userMessage,
      aiMessages: [],
      title: newTitle
    };

    // Add user message first - for immediate UI feedback
    try {
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            title: newTitle,
            messages: [...(c.messages || []), userMessage]
          };
        }
        return c;
      }));
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        setError('Storage full! Cannot add message. Go to Settings > Data to clear some images.');
        setIsGenerating(false);
        return;
      }
      throw err;
    }

    setIsGenerating(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      console.log('Sending prompt to API:', prompt, 'with attachments:', attachments.length, 'batch:', batchCount);
      
      const images = [];
      
      for (let i = 0; i < batchCount; i++) {
        try {
          const response = await generateImage(content, {
            aspectRatio: settings.defaultAspectRatio,
            quality: settings.defaultQuality,
            imageSize: settings.defaultImageSize || '1K',
            model: settings.selectedModel,
            attachments: attachments,
            signal: abortControllerRef.current.signal
          });

          if (response.image) {
            images.push(response.image);
          }
        } catch (imgErr) {
          console.error(`Failed to generate image ${i + 1}:`, imgErr);
        }
      }
      
      console.log('Generated images:', images.length);

      if (images.length === 0) {
        throw new Error('Failed to generate any images');
      }

      const aiMessage = createMessage('assistant', `Generated ${images.length} image${images.length > 1 ? 's' : ''}`, images.length > 1 ? images : images[0]);
      pendingMessagesRef.current.aiMessages = [aiMessage];

      console.log('Adding AI message:', aiMessage);

      // Now add AI message - get the LATEST state to ensure we have both messages
      try {
        setConversations(prev => {
          // Find the conversation
          const convIndex = prev.findIndex(c => c.id === activeConversationId);
          if (convIndex === -1) return prev;
          
          const conv = prev[convIndex];
          const existingMessages = conv.messages || [];
          
          // Check if user message is already there
          const hasUserMessage = existingMessages.some(m => m.id === userMessage.id);
          
          // Build the messages array
          let allMessages = [...existingMessages];
          if (!hasUserMessage) {
            allMessages = [...allMessages, userMessage];
          }
          allMessages = [...allMessages, aiMessage];
          
          console.log('Final messages count:', allMessages.length, 'roles:', allMessages.map(m => m.role));
          
          const updated = [...prev];
          updated[convIndex] = {
            ...conv,
            title: newTitle,
            messages: allMessages
          };
          return updated;
        });
      } catch (saveErr) {
        if (saveErr.name === 'QuotaExceededError') {
          setError('Storage full! Could not save images. Go to Settings > Data to clear some images.');
          setIsGenerating(false);
          return;
        }
        throw saveErr;
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        let errorMsg = err.message;
        if (err.name === 'QuotaExceededError' || errorMsg.includes('quota') || errorMsg.includes('storage')) {
          errorMsg = 'Storage quota exceeded! Go to Settings > Data to clear some images.';
        }
        setError(errorMsg);
        console.error('Generation error:', err);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      pendingMessagesRef.current = null;
    }
  }, [activeConversationId, conversations, settings, setConversations]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      cancelRequest(abortControllerRef.current);
      setIsGenerating(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  const clearAllConversations = useCallback(() => {
    const newConv = createConversation('New Chat');
    setConversations([newConv]);
    setActiveConversationId(newConv.id);
  }, [setConversations]);

  const addToFavorites = useCallback((imageData, prompt) => {
    const favorite = {
      id: Date.now().toString(),
      image: imageData,
      prompt: prompt,
      createdAt: new Date().toISOString()
    };
    setFavorites(prev => [favorite, ...prev]);
    return favorite;
  }, [setFavorites]);

  const removeFromFavorites = useCallback((favoriteId) => {
    setFavorites(prev => prev.filter(f => f.id !== favoriteId));
  }, [setFavorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  const isFavorite = useCallback((imageData) => {
    return favorites.some(f => f.image === imageData);
  }, [favorites]);

  const filteredConversations = searchQuery.trim()
    ? conversations.filter(c => 
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages?.some(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : conversations;

  const allGeneratedImages = conversations.flatMap(c => 
    (c.messages || [])
      .filter(m => m.role === 'assistant' && m.image)
      .map(m => ({ ...m, conversationId: c.id, conversationTitle: c.title }))
  );

  const addTag = useCallback((name) => {
    const newTag = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    };
    setTags(prev => {
      if (prev.some(t => t.name.toLowerCase() === newTag.name.toLowerCase())) {
        return prev;
      }
      return [...prev, newTag];
    });
    return newTag;
  }, [setTags]);

  const removeTag = useCallback((tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
  }, [setTags]);

  const addTagToImage = useCallback((imageData, tagId) => {
    setFavorites(prev => prev.map(f => {
      if (f.image === imageData) {
        return {
          ...f,
          tags: [...(f.tags || []), tagId]
        };
      }
      return f;
    }));
  }, [setFavorites]);

  const removeTagFromImage = useCallback((imageData, tagId) => {
    setFavorites(prev => prev.map(f => {
      if (f.image === imageData) {
        return {
          ...f,
          tags: (f.tags || []).filter(t => t !== tagId)
        };
      }
      return f;
    }));
  }, [setFavorites]);

  const getImagesByTag = useCallback((tagId) => {
    return favorites.filter(f => f.tags?.includes(tagId));
  }, [favorites]);

  const loadImageFromStorage = useCallback(async (imageId) => {
    try {
      return await imageUtils.getImageFromStorage(imageId);
    } catch (error) {
      console.error('Failed to load image from storage:', error);
      return null;
    }
  }, []);

  const deleteImageFromStorage = useCallback(async (imageId) => {
    try {
      await imageUtils.deleteImageFromStorage(imageId);
      const stats = await imageUtils.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to delete image from storage:', error);
    }
  }, []);

  const refreshStorageStats = useCallback(async () => {
    try {
      const stats = await imageUtils.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to refresh storage stats:', error);
    }
  }, []);

  const clearAllImageStorage = useCallback(async () => {
    try {
      await imageUtils.clearAllImageStorage();
      const stats = await imageUtils.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }, []);

  const exportData = useCallback((format) => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      conversations,
      favorites,
      tags,
      settings
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    if (format === 'csv') {
      const rows = ['conversation,title,prompt,createdAt'];
      conversations.forEach(c => {
        c.messages?.forEach(m => {
          if (m.role === 'user') {
            rows.push(`"${c.id}","${c.title}","${(m.content || '').replace(/"/g, '""')}","${m.createdAt}"`);
          }
        });
      });
      return rows.join('\n');
    }

    return JSON.stringify(data, null, 2);
  }, [conversations, favorites, tags, settings]);

  const importData = useCallback((jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.conversations) {
        setConversations(data.conversations);
      }
      if (data.favorites) {
        setFavorites(data.favorites);
      }
      if (data.tags) {
        setTags(data.tags);
      }
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, [setConversations, setFavorites, setTags, setSettings]);

  const value = {
    conversations: filteredConversations,
    allConversations: conversations,
    activeConversation,
    activeConversationId,
    isGenerating,
    error,
    settings,
    favorites,
    tags,
    searchQuery,
    allGeneratedImages,
    startNewChat,
    selectConversation,
    updateConversationTitle,
    deleteChat,
    sendMessage,
    cancelGeneration,
    updateSettings,
    clearAllConversations,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    setSearchQuery,
    addTag,
    removeTag,
    addTagToImage,
    removeTagFromImage,
    getImagesByTag,
    exportData,
    importData,
    loadImageFromStorage,
    deleteImageFromStorage,
    refreshStorageStats,
    clearAllImageStorage,
    storageStats
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
