import React from 'react';

export function StatusBadge({ status, type = 'property' }) {
  if (!status) return null;

  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'active':
      case 'fresh':
      case 'ready to move':
        return { bg: 'var(--success-subtle)', text: 'var(--success-text)', border: 'var(--success-border)' };
      case 'high priority':
      case 'under offer':
      case 'follow-up required':
      case 'aging':
        return { bg: 'var(--warning-subtle)', text: 'var(--warning-text)', border: 'var(--warning-border)' };
      case 'sold':
      case 'lost':
      case 'critical':
      case 'cold / stale':
        return { bg: 'var(--danger-subtle)', text: 'var(--danger-text)', border: 'var(--danger-border)' };
      case 'new':
      case 'new launch':
      case 'site visit scheduled':
        return { bg: 'var(--accent-subtle)', text: 'var(--accent-text)', border: 'var(--accent-border)' };
      default:
        return { bg: 'var(--surface-active)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    }
  };

  const s = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 8px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--font-xs)',
      fontWeight: 600,
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      lineHeight: 1.2
    }}>
      {status}
    </span>
  );
}
