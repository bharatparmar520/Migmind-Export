// Content script for migmind.com
class MigMindAIButton {
  constructor() {
    this.clipboardContent = '';
    this.init();
  }

  async init() {
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createButton());
    } else {
      this.createButton();
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getClipboard') {
        sendResponse({ clipboard: this.clipboardContent });
      }
    });
  }

  async getClipboardContent() {
    try {
      const text = await navigator.clipboard.readText();
      this.clipboardContent = text;
      return text;
    } catch (err) {
      console.log('Failed to read clipboard:', err);
      return '';
    }
  }

  createButton() {
    // Check if we're on a prompt page
    if (!window.location.href.includes('/prompts/')) {
      return;
    }

    // Look for like button or similar elements to position near
    const possibleSelectors = [
      '[data-testid="like-button"]',
      '.like-button',
      '.action-button',
      '.post-actions',
      '.engagement-buttons',
      '.social-buttons'
    ];

    let targetElement = null;
    for (const selector of possibleSelectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) break;
    }

    // Fallback: look for any button container or create at top of content
    if (!targetElement) {
      targetElement = document.querySelector('.post-content, .prompt-content, article, main');
    }

    if (targetElement) {
      const aiButton = this.createAIButton();
      
      // Insert after the target element or at the beginning
      if (targetElement.parentNode) {
        targetElement.parentNode.insertBefore(aiButton, targetElement.nextSibling);
      }
    }
  }

  createAIButton() {
    const button = document.createElement('button');
    button.id = 'migmind-ai-button';
    button.className = 'migmind-ai-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.09 8.26L16 8.5L13.09 8.74L12 15L10.91 8.74L8 8.5L10.91 8.26L12 2Z"/>
        <path d="M17 10L17.74 13.27L21 14L17.74 14.73L17 18L16.26 14.73L13 14L16.26 13.27L17 10Z"/>
        <path d="M7 14L7.74 17.27L11 18L7.74 18.73L7 22L6.26 18.73L3 18L6.26 17.27L7 14Z"/>
      </svg>
      Ask AI
    `;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showAIDialog();
    });

    return button;
  }

  async showAIDialog() {
    // Get latest clipboard content
    await this.getClipboardContent();

    // Remove existing dialog if present
    const existingDialog = document.getElementById('migmind-ai-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = this.createDialog();
    document.body.appendChild(dialog);

    // Add event listeners
    this.attachDialogListeners(dialog);
  }

  createDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'migmind-ai-dialog';
    dialog.className = 'migmind-ai-dialog';
    
    dialog.innerHTML = `
      <div class="migmind-ai-dialog-overlay">
        <div class="migmind-ai-dialog-content">
          <div class="migmind-ai-dialog-header">
            <h3>Choose AI Platform</h3>
            <button class="migmind-ai-close-btn">&times;</button>
          </div>
          
          <div class="migmind-ai-clipboard-preview">
            <label>Clipboard Content:</label>
            <div class="clipboard-content">${this.clipboardContent ? this.clipboardContent.substring(0, 100) + (this.clipboardContent.length > 100 ? '...' : '') : 'No content copied'}</div>
          </div>

          <div class="migmind-ai-options">
            <button class="migmind-ai-option" data-platform="chatgpt">
              <div class="ai-icon chatgpt-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.282 9.821c-.31-.417-.72-.72-1.193-.876-.473-.154-.99-.154-1.463 0-.288.095-.55.245-.765.44-.214.194-.381.431-.487.694-.106.263-.149.546-.125.828.024.282.12.554.28.794.16.24.373.443.62.592.248.15.531.243.827.271.296.028.595-.01.876-.111.281-.101.537-.259.75-.462.213-.203.377-.449.48-.719.103-.27.142-.561.113-.85-.029-.29-.127-.571-.295-.815zm-4.845-1.404c-.11-.276-.285-.522-.512-.72-.226-.198-.5-.34-.8-.416-.3-.075-.616-.084-.92-.025-.306.059-.596.186-.848.372-.252.186-.461.426-.614.704-.153.278-.246.59-.272.912-.026.322.016.646.123.95.107.304.28.581.507.812.227.231.505.408.813.518.308.11.64.151.97.12.33-.031.65-.132.936-.296.286-.164.532-.385.721-.647.189-.262.317-.568.375-.895.058-.327.045-.665-.059-.985zm-9.066-5.142c-.31-.417-.72-.72-1.193-.876-.473-.154-.99-.154-1.463 0-.288.095-.55.245-.765.44-.214.194-.381.431-.487.694-.106.263-.149.546-.125.828.024.282.12.554.28.794.16.24.373.443.62.592.248.15.531.243.827.271.296.028.595-.01.876-.111.281-.101.537-.259.75-.462.213-.203.377-.449.48-.719.103-.27.142-.561.113-.85-.029-.29-.127-.571-.295-.815z"/>
                </svg>
              </div>
              <span>ChatGPT</span>
            </button>

            <button class="migmind-ai-option" data-platform="claude">
              <div class="ai-icon claude-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 12h18l-9-9-9 9zm0 0h18l-9 9-9-9z"/>
                </svg>
              </div>
              <span>Claude</span>
            </button>

            <button class="migmind-ai-option" data-platform="gemini">
              <div class="ai-icon gemini-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span>Gemini</span>
            </button>
          </div>
        </div>
      </div>
    `;

    return dialog;
  }

  attachDialogListeners(dialog) {
    // Close button
    dialog.querySelector('.migmind-ai-close-btn').addEventListener('click', () => {
      dialog.remove();
    });

    // Overlay click to close
    dialog.querySelector('.migmind-ai-dialog-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('migmind-ai-dialog-overlay')) {
        dialog.remove();
      }
    });

    // AI platform selection
    dialog.querySelectorAll('.migmind-ai-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const platform = e.currentTarget.dataset.platform;
        this.openAIPlatform(platform);
        dialog.remove();
      });
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('migmind-ai-dialog')) {
        dialog.remove();
      }
    });
  }

  openAIPlatform(platform) {
    const platformUrls = {
      chatgpt: 'https://chat.openai.com/',
      claude: 'https://claude.ai/',
      gemini: 'https://gemini.google.com/'
    };

    const url = platformUrls[platform];
    if (url && this.clipboardContent) {
      // Send message to background script to handle the opening and pasting
      chrome.runtime.sendMessage({
        action: 'openAIPlatform',
        platform: platform,
        url: url,
        content: this.clipboardContent
      });
    } else {
      // Just open the platform if no clipboard content
      window.open(url, '_blank');
    }
  }
}

// Initialize the extension
new MigMindAIButton();