// Popup script for the extension
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a migmind.com page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (currentTab.url.includes('migmind.com/prompts/')) {
      statusIndicator.style.background = '#4ade80'; // Green
      statusIndicator.title = 'Extension active on this page';
    } else {
      statusIndicator.style.background = '#fbbf24'; // Yellow
      statusIndicator.title = 'Visit migmind.com/prompts/* to use this extension';
    }
  });
});