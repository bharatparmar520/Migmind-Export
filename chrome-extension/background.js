// Background script for handling clipboard and AI platform integration

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openAIPlatform') {
    handleAIPlatformOpen(request.platform, request.url, request.content);
  }
});

async function handleAIPlatformOpen(platform, url, content) {
  try {
    // Create new tab with the AI platform
    const tab = await chrome.tabs.create({ url: url });
    
    // Wait for the tab to load, then inject the content
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Inject script to paste content based on platform
        injectContentScript(tabId, platform, content);
      }
    });
  } catch (error) {
    console.error('Error opening AI platform:', error);
  }
}

function injectContentScript(tabId, platform, content) {
  const scripts = {
    chatgpt: `
      // Wait for ChatGPT to load
      function waitForChatGPT() {
        const textareas = document.querySelectorAll('textarea[placeholder*="Message"], #prompt-textarea, textarea[data-id="root"]');
        if (textareas.length > 0) {
          const textarea = textareas[textareas.length - 1];
          textarea.value = "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.focus();
          return true;
        }
        return false;
      }
      
      if (!waitForChatGPT()) {
        const observer = new MutationObserver(() => {
          if (waitForChatGPT()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    `,
    
    claude: `
      // Wait for Claude to load
      function waitForClaude() {
        const textareas = document.querySelectorAll('div[contenteditable="true"], textarea');
        if (textareas.length > 0) {
          const textarea = textareas[textareas.length - 1];
          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            textarea.textContent = "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
          textarea.focus();
          return true;
        }
        return false;
      }
      
      if (!waitForClaude()) {
        const observer = new MutationObserver(() => {
          if (waitForClaude()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    `,
    
    gemini: `
      // Wait for Gemini to load
      function waitForGemini() {
        const textareas = document.querySelectorAll('textarea, div[contenteditable="true"]');
        if (textareas.length > 0) {
          const textarea = textareas[textareas.length - 1];
          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            textarea.textContent = "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
          textarea.focus();
          return true;
        }
        return false;
      }
      
      if (!waitForGemini()) {
        const observer = new MutationObserver(() => {
          if (waitForGemini()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    `
  };

  if (scripts[platform]) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: new Function(scripts[platform])
    }).catch(error => {
      console.error('Error injecting script:', error);
    });
  }
}