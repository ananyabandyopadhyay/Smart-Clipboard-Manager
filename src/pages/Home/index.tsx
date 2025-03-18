import { useEffect, useState, useRef } from 'react';
import { Search, Trash2, Copy, Clipboard, RotateCcw } from 'lucide-react';
import {
  HomeContainer,
  ClipboardContainer,
  ClipboardDataSpan,
  HeaderSection,
  SearchContainer,
  SearchInput,
  Title,
  EmptyState,
  IconButton,
  ClipboardItemHeader,
  LoadingIndicator,
  RefreshButton,
  UpdateMessage,
} from './styles';

declare const chrome: any;

// Define type for clipboard items
interface ClipboardItem {
  type: 'text' | 'image';
  content: string;
  timestamp: number;
}

const Home = () => {
  const clipboard = navigator.clipboard;
  const portRef = useRef<any>(null);

  // Combined state for all clipboard items
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<number>(Date.now());
  const [showUpdateMessage, setShowUpdateMessage] = useState<boolean>(true);

  const isChromeEnv = typeof chrome !== 'undefined' && chrome.runtime;

  // Function to resize and compress images
  const resizeImage = async (blob: Blob, maxWidth = 60, maxHeight = 60) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio to maintain proportions
        const aspectRatio = width / height;

        // Resize based on the maximum dimensions
        if (width > height) {
          // Landscape image
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        } else {
          // Portrait or square image
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          // Use low quality for smaller file size
          ctx.imageSmoothingQuality = 'low';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Use lower quality JPEG format instead of PNG for smaller size
        resolve(canvas.toDataURL('image/jpeg', 0.5)); // 50% quality
      };
    });
  };

  // Fetch stored items from background service
  const fetchStoredItems = async () => {
    if (!isLoading) setIsRefreshing(true);

    try {
      if (isChromeEnv) {
        // Request items from background script
        chrome.runtime.sendMessage(
          { action: 'getClipboardItems' },
          (response: any) => {
            if (response && response.clipboardItems) {
              console.log(
                'Retrieved clipboard items:',
                response.clipboardItems.length
              );
              // Sort items by timestamp (newest first) to ensure correct order
              const sortedItems = [...response.clipboardItems].sort(
                (a: ClipboardItem, b: ClipboardItem) =>
                  b.timestamp - a.timestamp
              );
              setClipboardItems(sortedItems);
            }
            setIsLoading(false);
            setIsRefreshing(false);
            setLastCheck(Date.now());
          }
        );
      } else {
        console.log('Chrome extension environment not detected.');
        setIsLoading(false);
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Error retrieving clipboard items:', error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Check clipboard for new content (only when popup is open)
  const checkClipboard = async () => {
    if (Date.now() - lastCheck < 1000) {
      // Don't check more than once per second to avoid duplicates
      return;
    }

    setLastCheck(Date.now());

    try {
      // Check for text content - use try/catch because this might fail if the document is not focused
      try {
        const textContent = await clipboard.readText();
        if (textContent && textContent.trim() !== '') {
          // Check if this text already exists in our items
          const textExists = clipboardItems.some(
            (item) => item.type === 'text' && item.content === textContent
          );

          if (!textExists) {
            const newItem = {
              type: 'text' as 'text',
              content: textContent,
              timestamp: Date.now(),
            };

            // Send to background script
            chrome.runtime.sendMessage(
              {
                action: 'addClipboardItem',
                item: newItem,
              },
              () => {
                // After sending to background, refresh the items
                fetchStoredItems();
              }
            );
          }
        }
      } catch (error) {
        // Silent failure for clipboard access - this is expected when document is not focused
      }

      // Check for image content - also might fail for same reason
      try {
        const items = await clipboard.read();
        for (const item of items) {
          if (item.types.includes('image/png')) {
            const blob = await item.getType('image/png');
            const compressedImage = await resizeImage(blob);

            // Check if this image already exists in our items
            const imageExists = clipboardItems.some(
              (item) =>
                item.type === 'image' && item.content === compressedImage
            );

            if (!imageExists) {
              const newItem = {
                type: 'image' as 'image',
                content: compressedImage,
                timestamp: Date.now(),
              };

              // Send to background script
              chrome.runtime.sendMessage(
                {
                  action: 'addClipboardItem',
                  item: newItem,
                },
                () => {
                  // After sending to background, refresh the items
                  fetchStoredItems();
                }
              );
            }
          }
        }
      } catch (error) {
        // Silent failure for clipboard access
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  };

  // Initial load and setup
  useEffect(() => {
    // Get items immediately
    fetchStoredItems();

    // Notify background script that popup is open
    if (isChromeEnv) {
      // Establish a connection to detect popup open/close
      portRef.current = chrome.runtime.connect({ name: 'popup' });

      // Also send a message for backward compatibility
      chrome.runtime.sendMessage({ action: 'popupOpened' });

      // Set up listener for storage changes
      chrome.storage.onChanged.addListener((changes: any) => {
        if (changes.clipboardItems) {
          console.log('Storage change detected, refreshing items');
          fetchStoredItems();
        }
      });

      // Poll the clipboard for changes only when popup is open
      const clipboardCheckInterval = setInterval(() => {
        checkClipboard();
      }, 1000); // Check every second

      // Cleanup when component unmounts
      return () => {
        clearInterval(clipboardCheckInterval);
        chrome.runtime.sendMessage({ action: 'popupClosed' });
        if (portRef.current) {
          portRef.current.disconnect();
        }
      };
    }
  }, []);

  // Handle deleting items
  const handleDelete = async (index: number) => {
    const itemToDelete = clipboardItems[index];

    // Remove from local state immediately for UI responsiveness
    const newItems = [...clipboardItems];
    newItems.splice(index, 1);
    setClipboardItems(newItems);

    // Send delete request to background script
    chrome.runtime.sendMessage({
      action: 'deleteClipboardItem',
      timestamp: itemToDelete.timestamp,
      type: itemToDelete.type,
      content: itemToDelete.content,
    });
  };

  // Copy items back to clipboard
  const handleCopy = async (item: ClipboardItem) => {
    try {
      if (item.type === 'text') {
        await navigator.clipboard.writeText(item.content);
      } else {
        // Create a fetch request to get the image from the data URI
        const response = await fetch(item.content);
        const blob = await response.blob();

        // Create a ClipboardItem object (from the Clipboard API, not our interface)
        const clipboardItem = new window.ClipboardItem({
          [blob.type]: blob,
        });

        // Write the ClipboardItem to the clipboard
        await navigator.clipboard.write([clipboardItem]);
      }
      // Show a temporary success indicator
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchStoredItems();
    checkClipboard();
  };

  // Filter clipboard items based on search term
  const filteredItems = clipboardItems.filter(
    (item) =>
      item.type === 'text'
        ? item.content.toLowerCase().includes(searchTerm.toLowerCase())
        : searchTerm === '' // Only show images when not searching
  );

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <HomeContainer>
      {showUpdateMessage && (
        <UpdateMessage>
          <div>
            <strong>Note:</strong> Due to Chrome security restrictions,
            clipboard monitoring only works when the extension popup is open.
          </div>
          <IconButton onClick={() => setShowUpdateMessage(false)}>
            &times;
          </IconButton>
        </UpdateMessage>
      )}

      <HeaderSection>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title>
            <Clipboard size={20} />
            Clipboard Manager{' '}
            <small
              style={{
                fontSize: '0.7rem',
                fontWeight: 'normal',
                marginLeft: '5px',
              }}
            >
              ({clipboardItems.length}/50 items)
            </small>
          </Title>
          <RefreshButton
            onClick={handleRefresh}
            title="Refresh clipboard items"
            isRefreshing={isRefreshing}
          >
            <RotateCcw size={16} />
          </RefreshButton>
        </div>
        <SearchContainer>
          <Search size={16} />
          <SearchInput
            type="text"
            placeholder="Search clipboard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </HeaderSection>

      <ClipboardContainer>
        {isLoading ? (
          <LoadingIndicator>
            <div className="spinner"></div>
          </LoadingIndicator>
        ) : filteredItems.length === 0 ? (
          <EmptyState>
            {searchTerm
              ? 'No matching clipboard items found.'
              : 'Your clipboard history will appear here. Copy something while this popup is open to see it here.'}
          </EmptyState>
        ) : (
          filteredItems.map((item, index) => (
            <ClipboardDataSpan key={`${item.timestamp}-${index}`}>
              <ClipboardItemHeader>
                <span>
                  {item.type === 'image' ? 'Image' : 'Text'} •{' '}
                  {formatRelativeTime(item.timestamp)}
                </span>
                <div>
                  <IconButton
                    onClick={() => handleCopy(item)}
                    aria-label="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    aria-label="Delete from history"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </ClipboardItemHeader>

              {item.type === 'image' ? (
                <img src={item.content} alt="clipboard image" />
              ) : (
                <div className="content">
                  {item.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              )}
            </ClipboardDataSpan>
          ))
        )}
      </ClipboardContainer>
    </HomeContainer>
  );
};

export default Home;
