import React from 'react';
import { getFreshnessStatus } from '../../utils/freshness';

export function FreshnessBadge({ dateString, showDays = true }) {
  const status = getFreshnessStatus(dateString);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 8px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--font-xs)',
      fontWeight: 600,
      background: status.bg,
      color: status.color,
      border: `1px solid ${status.color}`,
      lineHeight: 1.2
    }} title={status.days !== null ? `${status.days} days since last verification` : 'Verification date unknown'}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: status.color
      }} />
      <span>{status.label}</span>
      {showDays && status.days !== null && <span style={{ opacity: 0.8 }}>({status.days}d)</span>}
    </span>
  );
}
