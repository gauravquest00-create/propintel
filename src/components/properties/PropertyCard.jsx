import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatArea } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { FreshnessBadge } from '../common/FreshnessBadge';
import './PropertyCard.css';

export function PropertyCard({ property, societyName, microMarketName }) {
  const navigate = useNavigate();

  return (
    <div 
      className="property-card"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div>
        <div className="prop-card-header">
          <div>
            <span className="prop-card-id">{property.id}</span>
            <h3 className="prop-card-title">{property.title}</h3>
          </div>
          <StatusBadge status={property.status} />
        </div>

        <div className="prop-card-badges" style={{ marginTop: '8px' }}>
          {societyName && (
            <span style={{ fontSize: 'var(--font-xs)', background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {societyName}
            </span>
          )}
          {microMarketName && (
            <span style={{ fontSize: 'var(--font-xs)', background: 'var(--accent-subtle)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-text)', fontWeight: 500 }}>
              {microMarketName}
            </span>
          )}
          {property.sector && (
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
              Sec {property.sector}
            </span>
          )}
        </div>
      </div>

      <div className="prop-card-facts">
        <div className="fact-item">
          <span className="fact-label">Config</span>
          <span className="fact-val">{property.bhk || '—'}</span>
        </div>
        <div className="fact-item">
          <span className="fact-label">Area</span>
          <span className="fact-val">{formatArea(property.superBuiltUpArea || property.carpetArea, property.unit)}</span>
        </div>
        <div className="fact-item">
          <span className="fact-label">Price</span>
          <span className="fact-val" style={{ color: 'var(--accent)' }}>
            {formatCurrency(property.price, property.transactionType)}
          </span>
        </div>
      </div>

      <div className="prop-card-footer">
        <FreshnessBadge dateString={property.lastVerifiedAt || property.updatedAt || property.createdAt} />
        <span>{property.transactionType || 'Resale'}</span>
      </div>
    </div>
  );
}
