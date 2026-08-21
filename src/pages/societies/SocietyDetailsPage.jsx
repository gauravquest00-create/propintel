import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatCard } from '../../components/common/StatCard';
import { useToast } from '../../hooks/useToast';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { formatCurrency } from '../../utils/formatters';
import { RiEditLine, RiDeleteBinLine, RiMapPin2Line, RiBuildingLine, RiAddLine } from 'react-icons/ri';
import './SocietyDetailsPage.css';

export function SocietyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [society, setSociety] = useState(null);
  const [microMarket, setMicroMarket] = useState(null);
  const [stats, setStats] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = () => {
    const soc = societyService.getById(id);
    if (!soc) {
      toast.error('Society not found');
      navigate('/societies');
      return;
    }
    setSociety(soc);
    if (soc.microMarketId) setMicroMarket(microMarketService.getById(soc.microMarketId));
    setStats(societyService.getStats(soc.id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!society || !stats) return null;

  const handleDelete = () => {
    societyService.delete(society.id);
    toast.success('Society deleted');
    navigate('/societies');
  };

  return (
    <div className="society-details-layout">
      <PageHeader
        title={society.name}
        description={`${society.developer ? `${society.developer} • ` : ''}Sector ${society.sector}, ${society.city || 'Gurugram'}`}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/properties/new')}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiAddLine />
              <span>Add Property</span>
            </button>
            <button
              onClick={() => navigate(`/societies/${society.id}/edit`)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)' }}
              title="Edit Society"
            >
              <RiEditLine />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-subtle)', color: 'var(--danger-text)' }}
              title="Delete Society"
            >
              <RiDeleteBinLine />
            </button>
          </div>
        }
      />

      {/* Linked Micro Market Card */}
      {microMarket && (
        <Link to={`/micro-markets/${microMarket.id}`} className="society-market-link">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <RiMapPin2Line size={24} color="var(--accent)" />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Linked Micro Market</div>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)' }}>{microMarket.name}</div>
            </div>
          </div>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--accent)', fontWeight: 600 }}>View Micro Market &rarr;</span>
        </Link>
      )}

      {/* Stats row */}
      <div className="society-stats-grid">
        <StatCard title="Total Properties" value={stats.totalProperties} subtitle="Units in inventory" />
        <StatCard title="For Resale" value={stats.resaleCount} subtitle="Sale inventory" />
        <StatCard title="For Rent" value={stats.rentCount} subtitle="Rental inventory" />
        <StatCard title="Price Range" value={stats.minPrice > 0 ? `${formatCurrency(stats.minPrice)} - ${formatCurrency(stats.maxPrice)}` : '—'} subtitle="Live range" />
      </div>

      {/* Linked Properties */}
      <div>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Properties in {society.name} ({stats.properties.length})
        </h3>
        {stats.properties.length === 0 ? (
          <div style={{ background: 'var(--surface)', padding: 'var(--space-8)', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No properties linked to this society yet.</p>
            <button
              onClick={() => navigate('/properties/new')}
              style={{ marginTop: 'var(--space-3)', padding: '6px 14px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)', fontWeight: 600 }}
            >
              Add Property
            </button>
          </div>
        ) : (
          <div className="society-prop-grid">
            {stats.properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                societyName={society.name}
                microMarketName={microMarket ? microMarket.name : ''}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Society"
        message="Are you sure you want to delete this society? Linked properties will remain in inventory."
        danger={true}
        confirmText="Delete Society"
      />
    </div>
  );
}