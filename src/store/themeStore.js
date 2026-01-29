import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme can be 'light', 'dark', or 'system'
      theme: 'system',

      // Get the actual theme to apply (resolves 'system' to actual theme)
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },

      // Set theme
      setTheme: (theme) => {
        set({ theme });
        get().applyTheme();
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const { theme, getEffectiveTheme } = get();
        let newTheme;

        if (theme === 'system') {
          // If on system, toggle to opposite of current effective theme
          newTheme = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
        } else {
          // Toggle between light and dark
          newTheme = theme === 'dark' ? 'light' : 'dark';
        }

        set({ theme: newTheme });
        get().applyTheme();
      },

      // Cycle through: light -> dark -> system
      cycleTheme: () => {
        const { theme } = get();
        const order = ['light', 'dark', 'system'];
        const currentIndex = order.indexOf(theme);
        const nextIndex = (currentIndex + 1) % order.length;
        const newTheme = order[nextIndex];

        set({ theme: newTheme });
        get().applyTheme();
      },

      // Apply theme to document
      applyTheme: () => {
        const effectiveTheme = get().getEffectiveTheme();
        const root = document.documentElement;

        if (effectiveTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },

      // Initialize theme on app load
      initTheme: () => {
        get().applyTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
          if (get().theme === 'system') {
            get().applyTheme();
          }
        });
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);
