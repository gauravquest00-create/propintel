import React from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

export function SearchBar({ value, onChange, placeholder = 'Search...', onClear, style }) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '360px',
      ...style
    }}>
      <RiSearchLine style={{
        position: 'absolute',
        left: '12px',
        color: 'var(--text-tertiary)',
        fontSize: '18px',
        pointerEvents: 'none'
      }} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '9px 36px 9px 36px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: 'var(--font-sm)',
          outline: 'none',
          transition: 'border-color var(--transition-fast)'
        }}
      />
      {value && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '10px',
            color: 'var(--text-muted)',
            padding: '2px'
          }}
          aria-label="Clear search"
        >
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  );
}
