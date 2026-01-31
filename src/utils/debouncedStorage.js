// Debounced localStorage storage for Zustand persist middleware

// Storage error state management
let storageErrorCallbacks = [];
let lastStorageError = null;

// Multi-tab synchronization
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
let storageChangeCallbacks = [];
let isMultiTabWarningShown = false;

/**
 * Register a callback to be notified when storage changes from another tab
 * @param {function} callback - Called with { key, newValue, oldValue, tabId } when storage changes
 * @returns {function} Unsubscribe function
 */
export function onStorageChange(callback) {
  storageChangeCallbacks.push(callback);
  return () => {
    storageChangeCallbacks = storageChangeCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Check if the app is open in multiple tabs
 * @returns {boolean}
 */
export function checkMultipleTabs() {
  const tabKey = 'resume-builder-active-tabs';
  try {
    const tabs = JSON.parse(localStorage.getItem(tabKey) || '{}');
    const now = Date.now();
    // Clean up stale tabs (older than 30 seconds)
    const activeTabs = Object.entries(tabs).filter(([, timestamp]) => now - timestamp < 30000);
    return activeTabs.length > 1;
  } catch {
    return false;
  }
}

/**
 * Register this tab as active (call periodically)
 */
function registerActiveTab() {
  const tabKey = 'resume-builder-active-tabs';
  try {
    const tabs = JSON.parse(localStorage.getItem(tabKey) || '{}');
    const now = Date.now();
    // Clean up stale tabs and add current tab
    const activeTabs = Object.entries(tabs)
      .filter(([, timestamp]) => now - timestamp < 30000)
      .reduce((acc, [id, ts]) => ({ ...acc, [id]: ts }), {});
    activeTabs[TAB_ID] = now;
    localStorage.setItem(tabKey, JSON.stringify(activeTabs));
  } catch {
    // Ignore errors
  }
}

/**
 * Unregister this tab when closing
 */
function unregisterTab() {
  const tabKey = 'resume-builder-active-tabs';
  try {
    const tabs = JSON.parse(localStorage.getItem(tabKey) || '{}');
    delete tabs[TAB_ID];
    localStorage.setItem(tabKey, JSON.stringify(tabs));
  } catch {
    // Ignore errors
  }
}

// Set up storage event listener for cross-tab communication
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // Ignore our tab tracking key
    if (event.key === 'resume-builder-active-tabs') return;

    // Notify callbacks about storage change from another tab
    if (event.key && storageChangeCallbacks.length > 0) {
      const changeEvent = {
        key: event.key,
        newValue: event.newValue,
        oldValue: event.oldValue,
        fromOtherTab: true
      };
      storageChangeCallbacks.forEach(cb => {
        try {
          cb(changeEvent);
        } catch (e) {
          console.error('Storage change callback failed:', e);
        }
      });
    }
  });

  // Register tab on load and periodically
  registerActiveTab();
  setInterval(registerActiveTab, 10000); // Update every 10 seconds

  // Unregister on page unload
  window.addEventListener('beforeunload', unregisterTab);
}

/**
 * Register a callback to be notified of storage errors
 * @param {function} callback - Called with error object when storage fails
 * @returns {function} Unsubscribe function
 */
export function onStorageError(callback) {
  storageErrorCallbacks.push(callback);
  return () => {
    storageErrorCallbacks = storageErrorCallbacks.filter(cb => cb !== callback);
  };
}

/**
 * Get the last storage error (if any)
 * @returns {object|null} Last error or null
 */
export function getLastStorageError() {
  return lastStorageError;
}

/**
 * Clear the last storage error
 */
export function clearStorageError() {
  lastStorageError = null;
}

/**
 * Get approximate localStorage usage
 * @returns {{ used: number, total: number, percentage: number }}
 */
export function getStorageUsage() {
  let used = 0;
  try {
    for (let key in localStorage) {
      if (Object.hasOwn(localStorage, key)) {
        used += localStorage.getItem(key).length * 2; // UTF-16 = 2 bytes per char
      }
    }
  } catch {
    // Ignore errors during size calculation
  }
  // Most browsers have 5-10MB limit, assume 5MB for safety
  const total = 5 * 1024 * 1024;
  return {
    used,
    total,
    percentage: Math.round((used / total) * 100)
  };
}

/**
 * Attempt to free up localStorage space by removing old/large items
 * @param {string[]} protectedKeys - Keys that should not be removed
 * @returns {boolean} True if space was freed
 */
export function cleanupStorage(protectedKeys = ['resume-storage', 'template-storage']) {
  try {
    const keysToRemove = [];
    for (let key in localStorage) {
      if (Object.hasOwn(localStorage, key) && !protectedKeys.includes(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return keysToRemove.length > 0;
  } catch {
    return false;
  }
}

function notifyStorageError(error, key) {
  lastStorageError = {
    error,
    key,
    timestamp: Date.now(),
    isQuotaError: error.name === 'QuotaExceededError' ||
                  error.code === 22 || // Legacy Safari
                  error.code === 1014 || // Firefox
                  error.message?.includes('quota')
  };
  storageErrorCallbacks.forEach(cb => {
    try {
      cb(lastStorageError);
    } catch (e) {
      console.error('Storage error callback failed:', e);
    }
  });
}

export function createDebouncedStorage(delay = 500) {
  let timeoutId = null;
  let pendingValue = null;
  let pendingKey = null;

  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
      // Clear any previous error on successful save
      if (lastStorageError?.key === key) {
        lastStorageError = null;
      }
      return true;
    } catch (error) {
      notifyStorageError(error, key);

      // Attempt cleanup and retry once for quota errors
      if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
        console.warn('localStorage quota exceeded, attempting cleanup...');
        if (cleanupStorage([key])) {
          try {
            localStorage.setItem(key, value);
            lastStorageError = null;
            return true;
          } catch (retryError) {
            notifyStorageError(retryError, key);
          }
        }
      }
      return false;
    }
  };

  return {
    getItem: (name) => {
      try {
        const str = localStorage.getItem(name);
        if (!str) return null;
        return JSON.parse(str);
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return null;
      }
    },

    setItem: (name, value) => {
      pendingKey = name;
      pendingValue = value;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const serialized = JSON.stringify(pendingValue);
        safeSetItem(pendingKey, serialized);
        timeoutId = null;
        pendingKey = null;
        pendingValue = null;
      }, delay);
    },

    removeItem: (name) => {
      // Cancel any pending writes for this key
      if (pendingKey === name) {
        clearTimeout(timeoutId);
        timeoutId = null;
        pendingKey = null;
        pendingValue = null;
      }
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    },

    // Force immediate save (useful for explicit save actions)
    flush: () => {
      if (timeoutId && pendingKey && pendingValue !== null) {
        clearTimeout(timeoutId);
        const serialized = JSON.stringify(pendingValue);
        const success = safeSetItem(pendingKey, serialized);
        timeoutId = null;
        pendingKey = null;
        pendingValue = null;
        return success;
      }
      return true;
    },

    // Check if there's a pending write
    hasPendingWrite: () => {
      return timeoutId !== null;
    }
  };
}

// Singleton instance with 500ms debounce
export const debouncedStorage = createDebouncedStorage(500);
