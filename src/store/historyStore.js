import { create } from 'zustand';

const MAX_HISTORY_SIZE = 50;
const DEBOUNCE_DELAY = 500; // Reduced from 1000ms for more responsive tracking

export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],
  lastPushTime: 0,
  pendingState: null,
  debounceTimer: null,

  // Push a new state to history with intelligent debouncing
  pushState: (state) => {
    const now = Date.now();
    const { lastPushTime, past, debounceTimer } = get();

    // Clear any pending debounce
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If very recent push (within debounce window), update pending state instead
    if (now - lastPushTime < DEBOUNCE_DELAY) {
      // Set up debounced push
      const timer = setTimeout(() => {
        const { pendingState } = get();
        if (pendingState) {
          set((s) => ({
            past: [...s.past.slice(-MAX_HISTORY_SIZE + 1), pendingState],
            future: [],
            pendingState: null,
            debounceTimer: null
          }));
        }
      }, DEBOUNCE_DELAY);

      set({
        pendingState: state,
        debounceTimer: timer,
        lastPushTime: now
      });
    } else {
      // Enough time has passed, push immediately
      set((s) => ({
        past: [...s.past.slice(-MAX_HISTORY_SIZE + 1), state],
        future: [],
        lastPushTime: now,
        pendingState: null,
        debounceTimer: null
      }));
    }
  },

  // Force push state immediately (for explicit save actions)
  forcePushState: (state) => {
    const { debounceTimer } = get();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    set((s) => ({
      past: [...s.past.slice(-MAX_HISTORY_SIZE + 1), state],
      future: [],
      lastPushTime: Date.now(),
      pendingState: null,
      debounceTimer: null
    }));
  },

  // Undo - move current state to future, restore from past
  undo: (currentState, restoreCallback) => {
    const { past, future, debounceTimer, pendingState } = get();

    // Clear any pending state
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If there's a pending state, push it first so we don't lose it
    let effectivePast = past;
    if (pendingState) {
      effectivePast = [...past, pendingState];
    }

    if (effectivePast.length === 0) return false;

    const previous = effectivePast[effectivePast.length - 1];
    const newPast = effectivePast.slice(0, -1);

    set({
      past: newPast,
      future: [currentState, ...future],
      pendingState: null,
      debounceTimer: null
    });

    restoreCallback(previous);
    return true;
  },

  // Redo - move state from future to past, restore
  redo: (currentState, restoreCallback) => {
    const { past, future, debounceTimer } = get();

    // Clear any pending operations
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (future.length === 0) return false;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, currentState],
      future: newFuture,
      pendingState: null,
      debounceTimer: null
    });

    restoreCallback(next);
    return true;
  },

  // Check if undo/redo is available
  canUndo: () => {
    const { past, pendingState } = get();
    return past.length > 0 || pendingState !== null;
  },
  canRedo: () => get().future.length > 0,

  // Get undo/redo counts
  getUndoCount: () => {
    const { past, pendingState } = get();
    return past.length + (pendingState ? 1 : 0);
  },
  getRedoCount: () => get().future.length,

  // Clear history
  clearHistory: () => {
    const { debounceTimer } = get();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    set({ past: [], future: [], pendingState: null, debounceTimer: null });
  }
}));
