# MigMind AI Assistant Chrome Extension

A Chrome extension that adds quick AI platform access to MigMind.com prompt pages.

## Features

- **One-Click AI Access**: Adds a button near like buttons on MigMind prompt pages
- **Multiple AI Platforms**: Supports ChatGPT, Claude, and Gemini
- **Automatic Clipboard Integration**: Automatically detects and uses your last copied text
- **Smart Content Injection**: Automatically pastes content into the selected AI platform

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension folder
4. The extension will appear in your Chrome toolbar

## Usage

1. Visit any MigMind prompt page (`migmind.com/prompts/[prompt-title]`)
2. Copy any text content you want to ask AI about
3. Click the "Ask AI" button that appears near other action buttons
4. Select your preferred AI platform (ChatGPT, Claude, or Gemini)
5. The platform will open in a new tab with your copied content ready to submit

## Supported AI Platforms

- **ChatGPT** (chat.openai.com)
- **Claude** (claude.ai)  
- **Gemini** (gemini.google.com)

## Permissions

- `clipboardRead`: To access your copied content
- `activeTab`: To inject the button on MigMind pages
- `tabs`: To open new tabs for AI platforms
- Host permissions for MigMind.com and AI platform domains

## Technical Details

- Built with Manifest V3
- Uses content scripts for page injection
- Background service worker for cross-tab communication
- Responsive design with modern CSS animations

## Privacy

This extension only accesses clipboard content when you explicitly click the AI button. No data is stored or transmitted except to the AI platforms you choose to use.