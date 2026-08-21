import React from 'react';
import { RiMenu2Line, RiSunLine, RiMoonLine } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { Breadcrumb } from '../common/Breadcrumb';
import './Header.css';

export function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger Menu button - ONLY visible on Mobile & Tablet (<=1024px) */}
        <button
          className="hamburger-btn"
          onClick={onMenuClick}
          title="Open Navigation Menu"
          aria-label="Open mobile menu"
        >
          <RiMenu2Line size={20} />
        </button>

        <Breadcrumb />
      </div>

      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <RiMoonLine /> : <RiSunLine />}
        </button>
      </div>
    </header>
  );
}