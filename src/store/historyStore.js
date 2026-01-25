import { create } from 'zustand';

const MAX_HISTORY_SIZE = 50;

export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],

  // Push a new state to history
  pushState: (state) => {
    set((s) => ({
      past: [...s.past.slice(-MAX_HISTORY_SIZE + 1), state],
      future: [] // Clear future when new action is taken
    }));
  },

  // Undo - move current state to future, restore from past
  undo: (currentState, restoreCallback) => {
    const { past, future } = get();
    if (past.length === 0) return false;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      future: [currentState, ...future]
    });

    restoreCallback(previous);
    return true;
  },

  // Redo - move state from future to past, restore
  redo: (currentState, restoreCallback) => {
    const { past, future } = get();
    if (future.length === 0) return false;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, currentState],
      future: newFuture
    });

    restoreCallback(next);
    return true;
  },

  // Check if undo/redo is available
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  // Clear history
  clearHistory: () => set({ past: [], future: [] })
}));
