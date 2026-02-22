# Contributing to Scribbles

Thank you for your interest in contributing to Scribbles! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/scribbles.git`
3. Create a branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## How Can I Contribute?

### Reporting Bugs

Before reporting a bug:

1. Check the [existing issues](https://github.com/yourusername/scribbles/issues) to see if the bug has already been reported
2. If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/yourusername/scribbles/issues/new)

When filing a bug report, include:

- A quick summary and background
- Steps to reproduce
- What you expected vs what happened
- Notes (possibly including why you think this might be happening)

### Suggesting Features

Open a [feature request](https://github.com/yourusername/scribbles/issues/new) and include:

- A clear, descriptive title
- Detailed description of the proposed feature
- Why this would be beneficial
- Any implementation ideas (optional)

### Pull Requests

1. Update documentation for any changed functionality
2. Ensure all tests pass (if applicable)
3. Follow the coding standards
4. Commit your changes with clear messages
5. Push to your fork and submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/scribbles.git
cd scribbles

# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Add your OpenRouter API key
# Edit .env with your API key

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Pull Request Guidelines

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Ensure code follows our style guidelines
- [ ] Verify all tests pass
- [ ] Clean up any console.log or debug code

### Submitting

1. Fill out the [PR template](PULL_REQUEST_TEMPLATE.md) completely
2. Link any related issues
3. Request review from maintainers

### After Review

- Address any requested changes
- Wait for approval before merging

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow existing code style
- Use meaningful variable and function names
- Comment complex logic
- Keep components focused and modular

### CSS

- Use CSS variables for theming
- Follow existing naming conventions
- Keep styles scoped to components

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Limit first line to 72 characters
- Reference issues when applicable

Example:
```
Add image size selection to settings

- Added dropdown for 1K, 2K, 4K image sizes
- Updated API call to include image_config parameter
- Fixed aspect ratio validation

Closes #123
```

## Questions?

Feel free to open an issue for questions about contributing. We're happy to help!

---

Thank you for contributing to Scribbles!
