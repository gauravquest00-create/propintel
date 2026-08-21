import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiBuildingLine, RiHomeLine } from 'react-icons/ri';

export function SocietyCard({ society, microMarketName, propertyCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/societies/${society.id}`)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-4)'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {society.id}
            </span>
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {society.name}
            </h3>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {society.developer ? `${society.developer} • ` : ''} Sector {society.sector || '—'}, {society.city || 'Gurugram'}
            </div>
          </div>
        </div>

        {microMarketName && (
          <span style={{
            display: 'inline-block',
            fontSize: 'var(--font-xs)',
            background: 'var(--accent-subtle)',
            color: 'var(--accent-text)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 500,
            marginTop: '10px'
          }}>
            {microMarketName}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: 'var(--space-3)',
        fontSize: 'var(--font-xs)',
        color: 'var(--text-secondary)'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <RiHomeLine color="var(--accent)" />
          <strong>{propertyCount}</strong> Properties
        </span>
        <span>{society.possession || 'Ready to Move'}</span>
      </div>
    </div>
  );
}
