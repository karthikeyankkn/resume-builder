import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'pdf-renderer': ['@react-pdf/renderer'],
          'icons': ['lucide-react'],
          'state': ['zustand']
        }
      }
    },
    // Increase chunk size warning limit since PDF renderer is large
    chunkSizeWarningLimit: 800
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'lucide-react', '@react-pdf/renderer']
  }
})
