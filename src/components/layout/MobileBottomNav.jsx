import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiBuildingLine, 
  RiUserSearchLine, 
  RiAddLine, 
  RiCommunityLine, 
  RiMapPin2Line, 
  RiUser3Line,
  RiCloseLine
} from 'react-icons/ri';
import './MobileBottomNav.css';

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (path) => {
    setSheetOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="mobile-bottom-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Dashboard"
          aria-label="Dashboard"
        >
          <RiDashboardLine className="bottom-nav-icon" />
        </NavLink>

        <NavLink 
          to="/properties" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Properties"
          aria-label="Properties"
        >
          <RiBuildingLine className="bottom-nav-icon" />
        </NavLink>

        <NavLink 
          to="/leads" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Leads"
          aria-label="Leads"
        >
          <RiUserSearchLine className="bottom-nav-icon" />
        </NavLink>

        {/* Center Action Button */}
        <button 
          className="bottom-nav-add-btn" 
          onClick={() => setSheetOpen(true)}
          title="Quick Create"
          aria-label="Quick Add"
        >
          <RiAddLine />
        </button>

        <NavLink 
          to="/societies" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Societies"
          aria-label="Societies"
        >
          <RiCommunityLine className="bottom-nav-icon" />
        </NavLink>

        <NavLink 
          to="/micro-markets" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Micro Markets"
          aria-label="Micro Markets"
        >
          <RiMapPin2Line className="bottom-nav-icon" />
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          title="Profile & Data"
          aria-label="Profile"
        >
          <RiUser3Line className="bottom-nav-icon" />
        </NavLink>
      </nav>

      {sheetOpen && (
        <div className="action-sheet-backdrop" onClick={() => setSheetOpen(false)}>
          <div className="action-sheet animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-header">
              <span className="action-sheet-title">Create or Add New</span>
              <button 
                onClick={() => setSheetOpen(false)} 
                style={{ 
                  color: 'var(--text-tertiary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--surface-subtle)'
                }}
                aria-label="Close action sheet"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            <div className="action-sheet-grid">
              <button className="action-sheet-card" onClick={() => handleAction('/properties/new')}>
                <RiBuildingLine className="action-sheet-icon" />
                <span>Add Property</span>
              </button>
              <button className="action-sheet-card" onClick={() => handleAction('/leads/new')}>
                <RiUserSearchLine className="action-sheet-icon" />
                <span>Add Lead</span>
              </button>
              <button className="action-sheet-card" onClick={() => handleAction('/societies/new')}>
                <RiCommunityLine className="action-sheet-icon" />
                <span>Add Society</span>
              </button>
              <button className="action-sheet-card" onClick={() => handleAction('/micro-markets/new')}>
                <RiMapPin2Line className="action-sheet-icon" />
                <span>Add Micro Market</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
