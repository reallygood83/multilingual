import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Performance-optimized Vite configuration
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Target modern browsers for better performance
    target: 'es2020',
    
    // Enable minification
    minify: 'esbuild',
    
    // Source maps for production debugging
    sourcemap: false,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // React and related libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Styling libraries
          'ui-vendor': ['styled-components', 'react-quill'],
          
          // Utility libraries
          'utils-vendor': ['axios'],
          
          // PDF generation libraries
          'pdf-vendor': ['jspdf', 'html2canvas']
        },
        
        // Chunk file names for better caching
        chunkFileNames: () => {
          return `assets/js/[name]-[hash].js`;
        },
        
        // Asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Optimize deps
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'styled-components',
        'react-quill',
        'axios',
        'jspdf',
        'html2canvas'
      ]
    }
  },
  
  // Development server options
  server: {
    host: true,
    port: 3000,
    open: true,
    
    // HMR options
    hmr: {
      overlay: true
    }
  },
  
  // Preview server options
  preview: {
    host: true,
    port: 4173,
    open: true
  },
  
  // Resolve options
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  // CSS options (simplified for Vercel compatibility)
  css: {
    // CSS modules
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  
  // Experimental features
  experimental: {
    // Enable SWC for faster builds (if available)
    renderBuiltUrl(filename) {
      return `/${filename}`;
    }
  }
});