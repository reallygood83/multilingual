import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations (simplified to avoid chunk init order issues)
  build: {
    // Target modern browsers
    target: 'es2020',
    
    // Temporarily disable minification for debugging
    minify: false
  },
  
  // Development server options
  server: {
    host: true,
    // Do not pin the port; let Vite choose an available one so HMR uses the correct port
    hmr: {
      overlay: true
    }
  }
})
