import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { SocietyCard } from '../../components/societies/SocietyCard';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { microMarketService } from '../../services/microMarketService';
import { RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';
import './MicroMarketDetailsPage.css';

export function MicroMarketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [market, setMarket] = useState(null);
  const [stats, setStats] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = () => {
    const mm = microMarketService.getById(id);
    if (!mm) {
      toast.error('Micro Market not found');
      navigate('/micro-markets');
      return;
    }
    setMarket(mm);
    setStats(microMarketService.getStats(mm.id));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!market || !stats) return null;

  const handleDelete = () => {
    microMarketService.delete(market.id);
    toast.success('Micro Market deleted');
    navigate('/micro-markets');
  };

  return (
    <div className="market-details-layout">
      <PageHeader
        title={market.name}
        description={market.description || 'Strategic real estate investment zone'}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/societies/new')}
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
              <span>Add Society</span>
            </button>
            <button
              onClick={() => navigate(`/micro-markets/${market.id}/edit`)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)' }}
              title="Edit Market"
            >
              <RiEditLine />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-subtle)', color: 'var(--danger-text)' }}
              title="Delete Market"
            >
              <RiDeleteBinLine />
            </button>
          </div>
        }
      />

      <div className="market-stats-grid">
        <StatCard title="Total Societies" value={stats.totalSocieties} subtitle="In this micro market" />
        <StatCard title="Total Properties" value={stats.totalProperties} subtitle="Inventory units" />
        <StatCard title="Resale Units" value={stats.resaleCount} subtitle="Available for sale" />
        <StatCard title="Rental Units" value={stats.rentCount} subtitle="Available for lease" />
      </div>

      {/* Linked Societies */}
      <div>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Societies in {market.name} ({stats.societies.length})
        </h3>

        {stats.societies.length === 0 ? (
          <div style={{ background: 'var(--surface)', padding: 'var(--space-6)', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No societies linked to this micro market yet.</p>
          </div>
        ) : (
          <div className="market-cards-grid">
            {stats.societies.map(s => (
              <SocietyCard
                key={s.id}
                society={s}
                microMarketName={market.name}
                propertyCount={stats.properties.filter(p => p.societyId === s.id).length}
              />
            ))}
          </div>
        )}
      </div>

      {/* Linked Properties */}
      <div>
        <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          All Properties in {market.name} ({stats.properties.length})
        </h3>
        {stats.properties.length === 0 ? (
          <div style={{ background: 'var(--surface)', padding: 'var(--space-6)', textAlign: 'center', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>No properties in this micro-market yet.</p>
          </div>
        ) : (
          <div className="market-prop-grid">
            {stats.properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                microMarketName={market.name}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Micro Market"
        message="Are you sure you want to remove this micro-market? Linked societies and properties will remain."
        danger={true}
        confirmText="Delete Micro Market"
      />
    </div>
  );
}