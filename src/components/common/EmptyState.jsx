import React from 'react';
import './EmptyState.css';

export function EmptyState({ icon, title, description, primaryAction, secondaryAction }) {
  return (
    <div className="empty-state-container">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      <div className="empty-state-actions">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}
