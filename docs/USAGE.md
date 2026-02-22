# Usage Guide

This guide covers advanced usage scenarios and features of Scribbles.

## Table of Contents

- [Image Generation](#image-generation)
- [Chat Management](#chat-management)
- [Image Editing](#image-editing)
- [Image Conversion](#image-conversion)
- [Gallery Management](#gallery-management)
- [Settings & Configuration](#settings--configuration)
- [Data Management](#data-management)

---

## Image Generation

### Basic Generation

The simplest way to generate an image:

1. Type your prompt in the chat input
2. Press Enter or click Generate
3. View the result

**Example prompts:**
```
A serene mountain landscape at dawn
A cyberpunk city with neon lights
A cute kitten playing with yarn
```

### Using Prompt Templates

For common image types, use built-in templates:

1. Click the Templates button (lightbulb icon)
2. Select a template (Portrait, Landscape, Anime, etc.)
3. Modify the prompt as needed
4. Generate

### Using Style Presets

Add style presets to enhance your prompts:

1. Open Settings
2. Choose a Style Preset (Photorealistic, Anime, Digital Art, etc.)
3. Generate as normal

You can combine multiple presets for unique effects.

### Adjusting Parameters

#### Aspect Ratio

Choose the shape of your output:

| Ratio | Best For |
|-------|----------|
| 1:1 | Social media, avatars |
| 16:9 | Landscapes, banners |
| 9:16 | Stories, portraits |
| 4:3 | Classic photography |
| 21:9 | Cinematic widescreen |

#### Image Size

| Size | Resolution | Use Case |
|------|------------|----------|
| 1K | Standard | Web, social media |
| 2K | High | Print, large displays |
| 4K | Ultra | Professional use |

#### Quality

- **Standard** - Faster, smaller files
- **High** - More detail, larger files

### Batch Generation

Generate multiple images at once:

1. Go to Settings
2. Set Batch Count (1-4)
3. Generate your image
4. All variations appear in the chat

### Using Reference Images

Upload images as references:

1. Click the attachment button
2. Select image(s) from your device
3. Describe what you want in the prompt
4. Generate

---

## Chat Management

### Chat Title Display

The chat header shows different content based on your current state:

| State | Title |
|-------|-------|
| Welcome screen (no active chat) | "Design at the Speed of Thought" |
| New chat (just created) | "New Chat" |
| Existing conversation | Your custom title |

### Customizing Chat Titles

Give your conversations custom names for easy organization:

1. Click the **pencil icon** next to the chat title
2. Type your custom name
3. Press **Enter** to save
4. Press **Escape** to cancel

Custom titles help you:
- Quickly find specific conversations in your history
- Organize projects or themes
- Distinguish between different image generation sessions

### Creating a New Chat

Click **New Chat** in the sidebar to start a fresh conversation. Each new chat begins with the default title "New Chat" which you can customize.

---

## Image Editing

### Accessing the Editor

Click on any generated image to open the editor.

### Editing Modes

#### 1. Variations

Creates alternative versions of your image:
- Same subject, different composition
- Different lighting or mood
- Style variations

**Best for:** Finding the perfect version

#### 2. Inpainting

Edit specific areas of your image:
- Select or describe the area to change
- Describe the replacement content
- Regenerate

**Best for:** Fixing flaws, changing objects

#### 3. Outpainting

Extends your image beyond its borders:
- Describe what should appear in the extension
- Maintains original style

**Best for:** Expanding scenes, creating larger compositions

### Editor Controls

| Control | Function |
|---------|----------|
| Resolution | Change aspect ratio |
| Variations | Number of alternatives |
| Download | Save to device |
| Delete | Remove from history |

---

## Image Conversion

### Converting a Single Image

1. Navigate to **Convert** tab
2. Drag & drop or click to select
3. Choose output format:
   - **PNG** - Lossless, transparency
   - **JPEG** - Smaller files, no transparency
   - **WebP** - Modern format, good compression
4. Adjust quality (for JPEG/WebP)
5. Click **Convert**
6. Download result

### Batch Conversion

1. Select multiple images
2. Choose output format
3. Adjust quality settings
4. Click **Convert All**
5. Download as ZIP

### Quality Settings

- **90-100%** - High quality, larger files
- **70-89%** - Balanced
- **Below 70%** - Smaller files, visible artifacts

---

## Gallery Management

### Browsing Images

The Gallery shows all your generated images:
- Grid view with thumbnails
- Click to view full size
- Sort by date

### Searching

Use the search bar to find images:
- Search by prompt text
- Filter by date range

### Tagging Images

Add tags to organize:

1. Open an image in the gallery
2. Click the tag icon
3. Add or remove tags
4. Images can have multiple tags

### Filtering by Tags

1. In Gallery, click the filter icon
2. Select one or more tags
3. View filtered results

### Favorites

Quick access to best images:

1. Hover over any image
2. Click the heart icon
3. View favorites in the Favorites tab

### Deleting Images

1. Hover over an image
2. Click the trash icon
3. Confirm deletion

---

## Settings & Configuration

### Accessing Settings

Click the settings icon in the sidebar or chat header.

### General Settings

| Setting | Description |
|---------|-------------|
| Default Model | AI model for generation |
| Default Aspect Ratio | Initial image shape |
| Default Image Size | Initial resolution |
| Default Quality | Initial quality level |
| Batch Count | Number of images to generate |

### Storage Settings

| Setting | Description |
|---------|-------------|
| Max Storage | Limit local storage usage |
| Clear All | Delete all stored data |

### Theme Settings

Browse and select from 12+ themes:
- Dark: Darkmatter, Graphite, Cyberpunk, Northern Lights
- Light: Modern Minimal, Sage Garden, Vintage Paper
- Colorful: Violet Bloom, Amethyst Haze, Ocean Breeze, Catppuccin

---

## Data Management

### Exporting Data

Backup your gallery and settings:

1. Open Settings → Data tab
2. Click **Export Data**
3. Choose what to include:
   - All images
   - Conversations
   - Favorites
   - Tags
   - Settings
4. Download JSON file

### Importing Data

Restore from a backup:

1. Open Settings → Data tab
2. Click **Import Data**
3. Select your backup file
4. Choose what to import

### Clearing Data

To delete all stored data:

1. Open Settings → Data tab
2. Click **Clear All Data**
3. Confirm the action

⚠️ This action cannot be undone!

### Storage Management

Monitor your storage usage:
- View current usage in Settings
- Clear old conversations to save space
- Delete unwanted images

---

## Tips & Tricks

### Better Prompts

- Be specific about details
- Include lighting conditions
- Mention art styles
- Describe colors and mood

### Efficient Workflows

1. **Quick variations** - Generate multiple, pick best
2. **Reference images** - Upload for style transfer
3. **Template + Style** - Combine for consistent results
4. **Batch generation** - Create multiple at once

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Generate image |
| Escape | Close modals |
| Ctrl+S | Download current image |

---

## Troubleshooting

### Common Issues

**Images not loading:**
- Check internet connection
- Refresh the page

**Generation fails:**
- Verify API key in Settings
- Try a different model
- Check API usage limits

**Storage full:**
- Delete old conversations
- Clear favorites
- Export and delete gallery

---

For additional help, see:
- [Getting Started](GETTING-STARTED.md)
- [Overview](OVERVIEW.md)
- [Contributing](CONTRIBUTING.md)
