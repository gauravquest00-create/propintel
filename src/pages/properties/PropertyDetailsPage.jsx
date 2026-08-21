import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FreshnessBadge } from '../../components/common/FreshnessBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { propertyService } from '../../services/propertyService';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { formatCurrency, formatArea, formatDate, formatPhone } from '../../utils/formatters';
import { getFreshnessWarning } from '../../utils/freshness';
import { 
  RiEditLine, 
  RiDeleteBinLine, 
  RiCheckboxCircleLine, 
  RiCommunityLine, 
  RiMapPin2Line,
  RiPhoneLine,
  RiAlertLine
} from 'react-icons/ri';
import './PropertyDetailsPage.css';

export function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [property, setProperty] = useState(null);
  const [society, setSociety] = useState(null);
  const [microMarket, setMicroMarket] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadDetails = () => {
    const prop = propertyService.getById(id);
    if (!prop) {
      toast.error('Property not found');
      navigate('/properties');
      return;
    }
    setProperty(prop);
    if (prop.societyId) setSociety(societyService.getById(prop.societyId));
    if (prop.microMarketId) setMicroMarket(microMarketService.getById(prop.microMarketId));
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (!property) return null;

  const warning = getFreshnessWarning(property, 'property');

  const handleVerify = () => {
    propertyService.markVerified(property.id);
    toast.success('Property verified! Freshness timestamp updated.');
    loadDetails();
  };

  const handleDelete = () => {
    propertyService.delete(property.id);
    toast.success('Property removed from inventory');
    navigate('/properties');
  };

  return (
    <div className="details-layout">
      <PageHeader
        title={property.title}
        description={`ID: ${property.id} • Created on ${formatDate(property.createdAt)}`}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={handleVerify}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-subtle)',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiCheckboxCircleLine />
              <span>Mark Verified</span>
            </button>
            <button
              onClick={() => navigate(`/properties/${property.id}/edit`)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiEditLine />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-subtle)',
                color: 'var(--danger-text)',
                border: '1px solid var(--danger-border)',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiDeleteBinLine />
              <span>Delete</span>
            </button>
          </div>
        }
      />

      {/* Freshness Warning Banner */}
      {warning && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--warning-subtle)',
          border: '1px solid var(--warning-border)',
          color: 'var(--warning-text)',
          fontSize: 'var(--font-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiAlertLine size={18} />
            <span>{warning}</span>
          </div>
          <button
            onClick={handleVerify}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--warning-border)',
              color: 'var(--warning-text)',
              fontSize: 'var(--font-xs)',
              fontWeight: 600
            }}
          >
            Verify Now
          </button>
        </div>
      )}

      {/* Hero card */}
      <div className="details-hero">
        <div className="details-hero-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusBadge status={property.status} />
              <FreshnessBadge dateString={property.lastVerifiedAt || property.updatedAt || property.createdAt} />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
                {property.transactionType}
              </span>
            </div>
            <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, marginTop: '8px' }}>
              {property.title}
            </h2>
          </div>
          <div className="details-price-badge">
            {formatCurrency(property.price || property.rent, property.transactionType)}
          </div>
        </div>

        <div className="details-facts-grid">
          <div className="details-fact-cell">
            <span className="fact-label">Configuration</span>
            <span className="fact-val">{property.bhk || '—'}</span>
          </div>
          <div className="details-fact-cell">
            <span className="fact-label">Tower & Unit</span>
            <span className="fact-val">
              {property.towerBlock ? `${property.towerBlock}` : ''}
              {property.unitNumber ? ` - #${property.unitNumber}` : (!property.towerBlock ? '—' : '')}
            </span>
          </div>
          <div className="details-fact-cell">
            <span className="fact-label">Floor</span>
            <span className="fact-val">
              {property.floor ? `${property.floor}${property.totalFloors ? ` of ${property.totalFloors}` : ' Floor'}` : '—'}
            </span>
          </div>
          <div className="details-fact-cell">
            <span className="fact-label">Super Built-Up Area</span>
            <span className="fact-val">{formatArea(property.superBuiltUpArea, property.unit)}</span>
          </div>
          <div className="details-fact-cell">
            <span className="fact-label">Facing & Orientation</span>
            <span className="fact-val">{property.facing || '—'}</span>
          </div>
          <div className="details-fact-cell">
            <span className="fact-label">Furnishing</span>
            <span className="fact-val">{property.furnishing || '—'}</span>
          </div>
        </div>
      </div>

      <div className="details-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Unit & Property Specifications */}
          <div className="details-card">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Unit & Property Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', fontSize: 'var(--font-sm)' }}>
              <div><strong>Tower / Block:</strong> {property.towerBlock || '—'}</div>
              <div><strong>Unit Number:</strong> {property.unitNumber || '—'}</div>
              <div><strong>Unit Floor:</strong> {property.floor || '—'}</div>
              <div><strong>Total Floors:</strong> {property.totalFloors || '—'}</div>
              <div><strong>Facing:</strong> {property.facing || '—'}</div>
              <div><strong>Furnishing:</strong> {property.furnishing || '—'}</div>
              <div><strong>Bathrooms:</strong> {property.bathrooms || '—'}</div>
              <div><strong>Balconies:</strong> {property.balcony || '—'}</div>
              <div><strong>Carpet Area:</strong> {formatArea(property.carpetArea, property.unit)}</div>
              <div><strong>Age of Property:</strong> {property.ageOfProperty || '—'}</div>
              <div><strong>Overlooking / View:</strong> {property.overlooking || '—'}</div>
              <div><strong>Parking:</strong> {property.parking || '—'}</div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <h4 style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  Amenities
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {property.amenities.map(a => (
                    <span key={a} style={{ fontSize: 'var(--font-xs)', background: 'var(--surface-hover)', padding: '3px 8px', borderRadius: '4px' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Relationships Card */}
          <div className="details-card">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Location & Hierarchy</h3>
            
            {society ? (
              <Link to={`/societies/${society.id}`} style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <RiCommunityLine size={24} color="var(--accent)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{society.name}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Linked Society (Click for details)</div>
                </div>
              </Link>
            ) : (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>No linked society</div>
            )}

            {microMarket ? (
              <Link to={`/micro-markets/${microMarket.id}`} style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <RiMapPin2Line size={24} color="var(--accent)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--accent-text)' }}>{microMarket.name}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Linked Micro-Market Zone</div>
                </div>
              </Link>
            ) : (
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>No linked micro-market</div>
            )}
          </div>

          {/* Owner details */}
          <div className="details-card">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Owner / Seller Info</h3>
            <div style={{ fontSize: 'var(--font-sm)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Name:</strong> {property.ownerName || '—'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RiPhoneLine color="var(--accent)" />
                <strong>Phone:</strong> {formatPhone(property.ownerPhone)}
              </div>
              {property.whatsapp && <div><strong>WhatsApp:</strong> {formatPhone(property.whatsapp)}</div>}
              {property.notes && (
                <div style={{ background: 'var(--surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginTop: '4px', fontSize: 'var(--font-xs)' }}>
                  <strong>Notes:</strong> {property.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Property Record"
        message="Are you sure you want to permanently remove this property from your inventory? This cannot be undone."
        danger={true}
        confirmText="Delete Property"
      />
    </div>
  );
}