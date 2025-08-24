import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/modern/ToastSystem'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)

// Service Worker handling
if ('serviceWorker' in navigator) {
  if (import.meta?.env?.DEV) {
    // In development: actively unregister any existing service workers and clear caches to avoid stale UI
    const hadController = !!navigator.serviceWorker.controller
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => reg.unregister().catch(() => {}))
    })
    if (window.caches && caches.keys) {
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).catch(() => {})
    }
    // If there was an active controller, reload once after cleanup to ensure fresh assets
    if (hadController && !sessionStorage.getItem('sw-cleaned')) {
      sessionStorage.setItem('sw-cleaned', '1')
      // Give the browser a tick to complete unregister and cache deletions
      setTimeout(() => window.location.reload(), 150)
    }
  } else {
    // In production: register sw.js with update prompt, but only if sw.js is served with a JS MIME type (avoid HTML fallback errors)
    window.addEventListener('load', async () => {
      try {
        const resp = await fetch('/sw.js', { cache: 'no-store' })
        const ct = resp.headers.get('content-type') || ''
        if (!resp.ok || ct.includes('text/html')) {
          // Skip registration if server returns HTML or non-ok response
          console.warn('Skipping Service Worker registration: /sw.js not served as JavaScript (content-type=' + ct + ', status=' + resp.status + ')')
          return
        }
      } catch (_) {
        // Network errors: skip SW registration silently
        return
      }

      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (!newWorker) return
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                const shouldReload = confirm('새로운 버전이 있습니다. 새로고침하시겠습니까?')
                if (shouldReload) window.location.reload()
              }
            })
          })
        })
        .catch(() => {
          // Silently ignore registration errors in production
        })
    })
  }
}
