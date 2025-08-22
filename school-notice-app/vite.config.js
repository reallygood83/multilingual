import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Target modern browsers
    target: 'es2020',
    
    // Enable minification
    minify: 'esbuild',
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['styled-components', 'react-quill'],
          'utils-vendor': ['axios'],
          'pdf-vendor': ['jspdf', 'html2canvas']
        }
      }
    }
  },
  
  // Development server options
  server: {
    host: true,
    port: 3000,
    hmr: {
      overlay: true
    }
  }
})
