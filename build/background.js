// Background script for clipboard manager
// We can't directly access clipboard from background, so we'll focus on storage management

// Store clipboard items
let clipboardItems = [];
let isPopupOpen = false;
let lastClipboardItem = null;

// Function to load existing clipboard items from storage
const loadClipboardItems = async () => {
  try {
    const data = await chrome.storage.sync.get(['clipboardItems']);
    if (data.clipboardItems) {
      clipboardItems = data.clipboardItems;
      console.log('Loaded clipboard items:', clipboardItems.length);
    }
  } catch (error) {
    console.error('Error loading clipboard items:', error);
  }
};

// Function to save clipboard items to storage
const saveClipboardItems = async () => {
  try {
    if (clipboardItems.length > 50) {
      clipboardItems = clipboardItems.slice(0, 50);
    }

    await chrome.storage.sync.set({ clipboardItems });
    console.log('Saved clipboard items:', clipboardItems.length);
  } catch (error) {
    console.error('Error saving clipboard items:', error);

    // If storage limit is reached, try saving fewer items
    if (error.message && error.message.includes('QUOTA_BYTES')) {
      const reducedItems = clipboardItems.slice(0, 30);
      try {
        await chrome.storage.sync.set({ clipboardItems: reducedItems });
        clipboardItems = reducedItems;
        console.log('Saved reduced clipboard items:', reducedItems.length);
      } catch (innerError) {
        console.error('Still unable to save data', innerError);
      }
    }
  }
};

// Set up message listener for communication with popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getClipboardItems') {
    // Return the current clipboard items
    sendResponse({ clipboardItems });
  } else if (request.action === 'popupOpened') {
    isPopupOpen = true;
    sendResponse({ success: true });
  } else if (request.action === 'popupClosed') {
    isPopupOpen = false;
    sendResponse({ success: true });
  } else if (request.action === 'addClipboardItem') {
    // Add a new item from the popup
    const { item } = request;

    // Check if this item already exists (avoid duplicates)
    const exists = clipboardItems.some(
      (existingItem) =>
        existingItem.type === item.type && existingItem.content === item.content
    );

    if (!exists) {
      clipboardItems.unshift(item);
      saveClipboardItems();
    }

    sendResponse({ success: true });
  } else if (request.action === 'deleteClipboardItem') {
    // Delete an item
    const { timestamp, type, content } = request;

    const index = clipboardItems.findIndex(
      (item) =>
        item.timestamp === timestamp &&
        item.type === type &&
        item.content === content
    );

    if (index !== -1) {
      clipboardItems.splice(index, 1);
      saveClipboardItems();
    }

    sendResponse({ success: true });
  }

  // Return true to indicate we'll respond asynchronously
  return true;
});

// Set up the connection with the popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    console.log('Popup connected');
    isPopupOpen = true;

    port.onDisconnect.addListener(() => {
      console.log('Popup disconnected');
      isPopupOpen = false;
    });
  }
});

// Initialize when the extension is loaded
const init = async () => {
  await loadClipboardItems();
  console.log('Background service initialized');
};

// Start the background process
init();

// Listen for chrome startup to ensure background service works after browser restart
chrome.runtime.onStartup.addListener(() => {
  console.log('Chrome started, initializing clipboard manager');
  init();
});

// Listen for extension install or update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated, initializing clipboard manager');
  init();
});
