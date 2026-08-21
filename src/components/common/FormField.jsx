import React from 'react';

export function FormField({ label, error, required, children, helperText, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label style={{
          fontSize: 'var(--font-xs)',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>{label}</span>
          {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
          {helperText}
        </span>
      )}
      {error && (
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
