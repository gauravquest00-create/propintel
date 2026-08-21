import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Auto-register service worker for PWA capability & auto-updates
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version of PropIntel available. Refresh to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('PropIntel workspace is ready to work offline.')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)