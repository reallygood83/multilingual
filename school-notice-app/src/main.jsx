import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
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
    // In production: register sw.js with update prompt
    window.addEventListener('load', () => {
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
