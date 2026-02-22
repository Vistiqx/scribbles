# Scribbles Overview

## Introduction

Scribbles is an AI-powered image generation application that allows users to create stunning images through a natural, chat-based interface. Built with modern web technologies, it provides a seamless experience for generating, editing, and managing AI-created images.

## Key Features

### 1. AI Image Generation
- Text-to-image generation using advanced AI models
- Support for multiple AI providers (Google, OpenAI)
- Configurable aspect ratios and image sizes
- Batch generation capabilities

### 2. Chat-Based Interface
- Natural conversational workflow
- Real-time image generation
- Conversation history management
- Message persistence
- Customizable chat titles with welcome message

### 3. Image Editing
- **Variations** - Generate alternative versions of an image
- **Inpainting** - Edit specific areas of an image
- **Outpainting** - Extend an image beyond its original boundaries

### 4. Image Conversion
- Convert between PNG, JPEG, and WebP formats
- Quality adjustment for lossy formats
- Batch conversion support

### 5. Gallery Management
- Automatic saving of all generated images
- Tag-based organization
- Favorites system
- Search and filter capabilities

### 6. Theming
- 12+ built-in themes
- Custom theme support
- Dark and light modes

## Architecture

### Frontend Stack
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **CSS Variables** - Theming system

### Data Storage
- **IndexedDB** - Image and conversation storage
- **LocalStorage** - Settings and preferences

### API Integration
- **OpenRouter** - Unified API for AI models

## Component Structure

```
src/
├── components/
│   ├── ChatArea.jsx          # Main chat interface
│   ├── ChatContext.jsx       # Chat state management
│   ├── ImageConverter.jsx    # Format conversion UI
│   ├── ImageEditor.jsx       # AI image editing
│   ├── GalleryModal.jsx      # Gallery browser
│   ├── FavoritesView.jsx     # Favorites list
│   ├── SettingsPanel.jsx    # App settings
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── ThemeSelector.jsx     # Theme picker
├── context/
│   ├── ChatContext.jsx      # Chat state (messages, images)
│   └── ThemeContext.jsx     # Theme state
├── constants/
│   └── appConstants.js      # Models, presets, defaults
├── utils/
│   ├── api.js               # OpenRouter API calls
│   ├── imageConverter.js    # Client-side conversion
│   ├── imageDb.js           # IndexedDB operations
│   └── storageManager.js    # Storage utilities
└── styles/
    └── index.css            # Global styles
```

## Supported AI Models

| Model ID | Provider | Capabilities |
|----------|----------|-------------|
| google/gemini-3-pro-preview | Google | Image generation |
| openai/gpt-5-image-mini | OpenAI | Image generation |
| google/gemini-2.5-flash-image | Google | Fast image generation |

## Settings

### Default Settings
- Aspect ratio: 1:1
- Image size: 1K
- Quality: Standard
- Batch count: 1
- Style preset: None

### Available Aspect Ratios
- 1:1 Square (1024×1024)
- 16:9 Landscape (1344×768)
- 9:16 Portrait (768×1344)
- 4:3 Standard (1184×864)
- 3:4 Portrait (864×1184)
- 2:3 Portrait (832×1248)
- 3:2 Landscape (1248×832)
- 4:5 Portrait (896×1152)
- 5:4 Landscape (1152×896)
- 21:9 Ultrawide (1536×672)

### Image Size Options
- 1K - Standard resolution
- 2K - Higher resolution
- 4K - Highest resolution

## Data Flow

1. **User Input** → Prompt entered in chat
2. **API Request** → OpenRouter API called with settings
3. **Response** → Base64 image returned
4. **Storage** → Image saved to IndexedDB
5. **Display** → Image rendered in chat/gallery

## Performance Considerations

- Images stored locally to reduce API calls
- IndexedDB for efficient large file storage
- Lazy loading for gallery images
- Optimized image compression

## Security

- API keys stored in environment variables
- No server-side data storage
- Local-only image processing
- Secure browser storage

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled

## Future Enhancements

- Additional AI models
- SVG support
- More export formats
- Collaborative features
- Mobile app

---

For more detailed information, see:
- [Getting Started](GETTING-STARTED.md)
- [Usage Guide](USAGE.md)
