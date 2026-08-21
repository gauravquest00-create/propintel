import React from 'react';
import { useNavigate } from 'react-router-dom';

export function StatCard({ title, value, subtitle, icon, link, alert, change }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => link && navigate(link)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        cursor: link ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        boxShadow: 'var(--shadow-sm)'
      }}
      className="stat-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: alert ? 'var(--danger-subtle)' : 'var(--accent-subtle)',
            color: alert ? 'var(--danger-text)' : 'var(--accent-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--font-3xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </span>
        {change && (
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--success-text)' }}>
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
