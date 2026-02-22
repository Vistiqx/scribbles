# Getting Started with Scribbles

Welcome to Scribbles! This guide will help you set up and start using the application.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **npm 9 or higher** (comes with Node.js)
- **OpenRouter API key** - [Get free key](https://openrouter.ai/)

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/scribbles.git
cd scribbles
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React 19
- Vite (build tool)
- JSZip (for batch operations)
- UUID (for unique IDs)

### Step 3: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and add your OpenRouter API key:
```
VITE_OPENROUTER_API_KEY=your_api_key_here
```

**Getting an API Key:**
1. Visit [openrouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new key
5. Copy it to your `.env` file

### Step 4: Start Development Server

```bash
npm run dev
```

You should see output similar to:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Step 5: Open the Application

Open your browser and navigate to: **http://localhost:5173**

## First-Time Setup

### 1. Select Your AI Model

On first launch, the default model (Gemini 3 Pro) is selected. You can change this in:
- **Settings** → Default Model dropdown

### 2. Configure Default Settings

Adjust your preferred defaults in Settings:
- **Aspect Ratio** - Choose your typical image shape
- **Image Size** - 1K, 2K, or 4K
- **Quality** - Standard or High

### 3. Choose a Theme

Browse themes in Settings and select one that suits your style. Try:
- Dark themes: Darkmatter, Graphite, Cyberpunk
- Light themes: Modern Minimal, Sage Garden
- Colorful: Violet Bloom, Amethyst Haze

## Quick Start: Generate Your First Image

1. Type a prompt in the chat input, for example:
   ```
   A cat sitting on a windowsill, sunset, photorealistic
   ```

2. Press **Enter** or click the generate button

3. Wait for the AI to generate your image

4. View, download, or edit your generated image

## Understanding the Interface

### Main Tabs

| Tab | Function |
|-----|----------|
| **Chat** | Generate images through conversation |
| **Convert** | Convert images between formats |
| **Gallery** | Browse all generated images |
| **Favorites** | Quick access to starred images |

### Chat Interface Elements

- **Prompt Input** - Type your image description here
- **Settings Button** - Adjust generation parameters
- **Attachment Button** - Upload reference images
- **Send Button** - Generate your image

### Chat Title

The chat header displays different content based on your current state:

| State | Title Displayed |
|-------|-----------------|
| Welcome Screen (no chat) | "Design at the Speed of Thought" |
| New Chat | "New Chat" |
| Existing Conversation | Conversation title |

**Customizing Chat Titles:**

1. Click the pencil icon next to any conversation title
2. Type your custom name
3. Press **Enter** to save, or **Escape** to cancel

Custom titles help you organize and quickly find specific conversations in your history.

### Image Card Actions

When you hover over a generated image, you'll see:
- **Download** - Save the image
- **Edit** - Open in editor
- **Favorite** - Add to favorites
- **Delete** - Remove from history

## Common Tasks

### Generating Multiple Images

Use the batch count setting to generate multiple variations at once:
- Settings → Batch Count (1-4)

### Editing an Image

1. Click on any generated image
2. Choose editing mode:
   - **Variations** - Create alternatives
   - **Inpainting** - Edit specific areas
   - **Outpainting** - Extend the image
3. Describe what you want to change
4. Regenerate

### Converting Image Formats

1. Go to **Convert** tab
2. Drag and drop your image(s)
3. Select output format (PNG, JPEG, WebP)
4. Adjust quality if needed
5. Click Convert

### Organizing Images

- Add **tags** to categorize images
- Mark **favorites** for quick access
- Use **search** to find specific images
- **Export** your gallery for backup

## Troubleshooting

### "API key not configured" Error

Make sure your `.env` file contains:
```
VITE_OPENROUTER_API_KEY=your_actual_key_here
```
Then restart the dev server.

### "Failed to generate image" Error

- Check your internet connection
- Verify your API key is valid
- Try a different model
- Check browser console for details

### Images Not Saving

- Ensure localStorage is enabled
- Check available browser storage
- Clear browser cache if full

### Slow Performance

- Use smaller batch counts
- Select smaller image sizes
- Close unused browser tabs

## Next Steps

Now that you're set up, explore:

- [Usage Guide](USAGE.md) - Detailed usage scenarios
- [Overview](OVERVIEW.md) - Technical details
- [Contributing](CONTRIBUTING.md) - Help improve Scribbles

## Getting Help

- **Issues** - Report bugs or request features
- **Documentation** - You're reading it!
- **Community** - Join other users

---

Happy image generating! 🎨
