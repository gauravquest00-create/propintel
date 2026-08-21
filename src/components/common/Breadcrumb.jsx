import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import './Breadcrumb.css';

const ROUTE_MAP = {
  dashboard: 'Dashboard',
  properties: 'Properties',
  leads: 'Leads',
  societies: 'Societies',
  'micro-markets': 'Micro Markets',
  profile: 'Profile & Settings',
  new: 'Create New',
  edit: 'Edit'
};

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      <Link to="/dashboard" className="breadcrumb-link">Workspace</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = ROUTE_MAP[value] || (value.startsWith('prop_') || value.startsWith('lead_') || value.startsWith('soc_') || value.startsWith('mm_') ? 'Details' : value);

        return (
          <React.Fragment key={to}>
            <RiArrowRightSLine className="breadcrumb-separator" size={16} />
            {isLast ? (
              <span className="breadcrumb-current">{displayName}</span>
            ) : (
              <Link to={to} className="breadcrumb-link">{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
