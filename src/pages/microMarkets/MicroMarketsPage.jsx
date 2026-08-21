import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { MicroMarketCard } from '../../components/microMarkets/MicroMarketCard';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { microMarketService } from '../../services/microMarketService';
import { societyService } from '../../services/societyService';
import { propertyService } from '../../services/propertyService';
import { RiMapPin2Line, RiAddLine } from 'react-icons/ri';

export function MicroMarketsPage() {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMarkets(microMarketService.getAll());
    setSocieties(societyService.getAll());
    setProperties(propertyService.getAll());
  }, []);

  const filtered = markets.filter(m => {
    return !search.trim() || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div>
      <PageHeader
        title="Micro Markets & Corridors"
        description="Strategic real estate market zones and infrastructure corridors"
        actions={
          <button
            onClick={() => navigate('/micro-markets/new')}
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
            <span>Add Micro Market</span>
          </button>
        }
      />

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)'
      }}>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search micro markets..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<RiMapPin2Line />}
          title="No Micro Markets Recorded"
          description={markets.length === 0 ? "You haven't defined any micro markets yet." : "No micro markets match your search."}
          primaryAction={
            <button
              onClick={() => navigate('/micro-markets/new')}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Add Micro Market
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {filtered.map(m => {
            const socCount = societies.filter(s => s.microMarketId === m.id).length;
            const propCount = properties.filter(p => p.microMarketId === m.id).length;
            return (
              <MicroMarketCard
                key={m.id}
                market={m}
                societyCount={socCount}
                propertyCount={propCount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
