import React from 'react';

export function SelectField({ value, onChange, options = [], placeholder = 'Select an option', disabled = false, style }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--surface)',
        color: 'var(--text-primary)',
        fontSize: 'var(--font-sm)',
        outline: 'none',
        ...style
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
