# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support for multiple AI image generation models:
  - Google Gemini 3 Pro
  - OpenAI GPT-5 Image Mini
  - Google Gemini 2.5 Flash Image
- Image configuration options:
  - Aspect ratio selection (1:1, 16:9, 9:16, 4:3, 3:4, 2:3, 3:2, 4:5, 5:4, 21:9)
  - Image size options (1K, 2K, 4K)
  - Quality settings (standard, high)
- Multiple theme support with 12+ themes
- Image conversion (PNG, JPEG, WebP)
- Image editing with variations, inpainting, and outpainting modes
- Gallery management with tags
- Favorites system
- Batch image generation
- Local browser storage for images
- Export/import data functionality

### Changed

- Migrated to React 19
- Updated API integration to use OpenRouter's image_config parameter
- Improved chat-based image generation workflow
- Enhanced local storage management with IndexedDB

### Fixed

- Various UI/UX improvements
- Storage management optimization

## [0.0.1] - 2025-02-20

### Added

- Initial release
- Basic AI image generation
- Simple chat interface
- Theme switching
