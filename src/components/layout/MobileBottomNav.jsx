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
  RiCloseLine,
  RiUpload2Line
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
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiDashboardLine className="bottom-nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/properties" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiBuildingLine className="bottom-nav-icon" />
          <span>Properties</span>
        </NavLink>

        <NavLink to="/leads" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiUserSearchLine className="bottom-nav-icon" />
          <span>Leads</span>
        </NavLink>

        <button 
          className="bottom-nav-add-btn" 
          onClick={() => setSheetOpen(true)}
          aria-label="Quick Add"
        >
          <RiAddLine />
        </button>

        <NavLink to="/societies" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiCommunityLine className="bottom-nav-icon" />
          <span>Societies</span>
        </NavLink>

        <NavLink to="/micro-markets" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiMapPin2Line className="bottom-nav-icon" />
          <span>Markets</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <RiUser3Line className="bottom-nav-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {sheetOpen && (
        <div className="action-sheet-backdrop" onClick={() => setSheetOpen(false)}>
          <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="action-sheet-header">
              <span className="action-sheet-title">Create or Import</span>
              <button onClick={() => setSheetOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <RiCloseLine size={22} />
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
