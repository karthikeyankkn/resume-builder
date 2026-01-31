import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme can be 'light', 'dark', 'system', or 'high-contrast'
      theme: 'system',

      // High contrast mode (independent of theme)
      highContrast: false,

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

      // Toggle high contrast mode
      toggleHighContrast: () => {
        set((state) => ({ highContrast: !state.highContrast }));
        get().applyTheme();
      },

      // Set high contrast mode
      setHighContrast: (enabled) => {
        set({ highContrast: enabled });
        get().applyTheme();
      },

      // Apply theme to document
      applyTheme: () => {
        const { highContrast } = get();
        const effectiveTheme = get().getEffectiveTheme();
        const root = document.documentElement;

        // Add transition class for smooth theme changes
        root.classList.add('theme-transition');

        if (effectiveTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }

        // Handle high contrast mode
        if (highContrast) {
          root.classList.add('high-contrast');
        } else {
          root.classList.remove('high-contrast');
        }

        // Remove transition class after animation completes
        setTimeout(() => {
          root.classList.remove('theme-transition');
        }, 300);
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
      partialize: (state) => ({ theme: state.theme, highContrast: state.highContrast })
    }
  )
);
