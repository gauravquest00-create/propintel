import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiBuildingLine, 
  RiUserSearchLine, 
  RiCommunityLine, 
  RiMapPin2Line, 
  RiUser3Line,
  RiDatabase2Line,
  RiCloseLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, healthSummary }) {
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <RiDashboardLine /> },
    { to: '/properties', label: 'Properties', icon: <RiBuildingLine />, badge: healthSummary?.metrics?.totalProperties },
    { to: '/leads', label: 'Leads', icon: <RiUserSearchLine />, badge: healthSummary?.metrics?.totalLeads },
    { to: '/societies', label: 'Societies', icon: <RiCommunityLine />, badge: healthSummary?.metrics?.totalSocieties },
    { to: '/micro-markets', label: 'Micro Markets', icon: <RiMapPin2Line />, badge: healthSummary?.metrics?.totalMicroMarkets },
    { to: '/profile', label: 'Profile & Data', icon: <RiUser3Line /> }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo" title="PropIntel Workspace">
            <div className="brand-icon">
              <RiDatabase2Line />
            </div>
            <span className="brand-title-text">PropIntel</span>
          </div>

          <div className="sidebar-header-actions">
            {/* Desktop PC Toggle Button */}
            <button
              className="sidebar-toggle-btn"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle desktop sidebar collapse"
            >
              {isCollapsed ? <RiMenuUnfoldLine size={20} /> : <RiMenuFoldLine size={18} />}
            </button>

            {/* Mobile Close Drawer Button */}
            <button 
              className="mobile-close-btn" 
              onClick={onClose}
              title="Close navigation"
              aria-label="Close navigation menu"
            >
              <RiCloseLine size={22} />
            </button>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-title">Workspace Pillars</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>

        {user && (
          <div className="sidebar-footer">
            <NavLink 
              to="/profile" 
              className="user-snippet" 
              onClick={onClose}
              title={`${user.fullName} (${user.email})`}
            >
              <div className="user-avatar">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{user.fullName || 'User'}</div>
                <div className="user-role">{user.email}</div>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}