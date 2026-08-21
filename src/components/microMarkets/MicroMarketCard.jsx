import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCommunityLine, RiBuildingLine } from 'react-icons/ri';

export function MicroMarketCard({ market, societyCount = 0, propertyCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/micro-markets/${market.id}`)}
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
        <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {market.name}
        </h3>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.4 }}>
          {market.description ? (market.description.length > 85 ? market.description.slice(0, 85) + '...' : market.description) : 'Strategic micro-market zone in Gurugram.'}
        </p>

        {market.keySectors && market.keySectors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {market.keySectors.slice(0, 3).map((sec, i) => (
              <span key={i} style={{ fontSize: '11px', background: 'var(--surface-hover)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                Sec {sec}
              </span>
            ))}
          </div>
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
          <RiCommunityLine color="var(--accent)" />
          <strong>{societyCount}</strong> Societies
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <RiBuildingLine color="var(--accent)" />
          <strong>{propertyCount}</strong> Properties
        </span>
      </div>
    </div>
  );
}
