import React, { useState, useEffect } from 'react';
import { RiSmartphoneLine, RiCloseLine, RiDownloadLine } from 'react-icons/ri';

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('propintel_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('propintel_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
      color: '#ffffff',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 'var(--font-xs)',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RiSmartphoneLine size={20} />
        <span><strong>Install PropIntel App:</strong> Install on your device for fast offline access and app-like experience.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: '#ffffff',
            color: 'var(--accent)',
            fontWeight: 700,
            fontSize: 'var(--font-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RiDownloadLine />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          style={{ color: '#ffffff', opacity: 0.8, fontSize: '18px', padding: '2px' }}
          aria-label="Dismiss banner"
        >
          <RiCloseLine />
        </button>
      </div>
    </div>
  );
}