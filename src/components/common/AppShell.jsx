import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { MobileBottomNav } from '../layout/MobileBottomNav';
import { PWAInstallBanner } from './PWAInstallBanner';
import { healthEngineService } from '../../services/healthEngineService';
import './AppShell.css';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('propintel_sidebar_collapsed') === 'true';
  });
  const [healthSummary, setHealthSummary] = useState(null);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('propintel_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const updateHealth = () => {
      setHealthSummary(healthEngineService.getSystemHealth());
    };
    updateHealth();

    window.addEventListener('storage', updateHealth);
    return () => window.removeEventListener('storage', updateHealth);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        healthSummary={healthSummary} 
      />
      <div className={`app-main ${isCollapsed ? 'collapsed' : ''}`}>
        <PWAInstallBanner />
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        <main className="app-content">
          <Outlet context={{ refreshHealth: () => setHealthSummary(healthEngineService.getSystemHealth()) }} />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}