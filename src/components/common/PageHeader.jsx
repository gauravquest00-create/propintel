import React from 'react';
import './PageHeader.css';

export function PageHeader({ title, description, actions, children }) {
  return (
    <div className="page-header">
      <div className="page-header-info">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
        {children}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
