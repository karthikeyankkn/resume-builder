// Debounced localStorage storage for Zustand persist middleware

export function createDebouncedStorage(delay = 500) {
  let timeoutId = null;
  let pendingValue = null;
  let pendingKey = null;

  return {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      return JSON.parse(str);
    },

    setItem: (name, value) => {
      pendingKey = name;
      pendingValue = value;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        localStorage.setItem(pendingKey, JSON.stringify(pendingValue));
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
      localStorage.removeItem(name);
    },

    // Force immediate save (useful for explicit save actions)
    flush: () => {
      if (timeoutId && pendingKey && pendingValue !== null) {
        clearTimeout(timeoutId);
        localStorage.setItem(pendingKey, JSON.stringify(pendingValue));
        timeoutId = null;
        pendingKey = null;
        pendingValue = null;
      }
    }
  };
}

// Singleton instance with 500ms debounce
export const debouncedStorage = createDebouncedStorage(500);
