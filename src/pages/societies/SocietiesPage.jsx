import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { SocietyCard } from '../../components/societies/SocietyCard';
import { SearchBar } from '../../components/common/SearchBar';
import { SelectField } from '../../components/common/SelectField';
import { EmptyState } from '../../components/common/EmptyState';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { propertyService } from '../../services/propertyService';
import { RiCommunityLine, RiAddLine } from 'react-icons/ri';

export function SocietiesPage() {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [microMarkets, setMicroMarkets] = useState([]);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');

  useEffect(() => {
    setSocieties(societyService.getAll());
    setMicroMarkets(microMarketService.getAll());
    setProperties(propertyService.getAll());
  }, []);

  const marketMap = microMarkets.reduce((acc, m) => { acc[m.id] = m.name; return acc; }, {});

  const filtered = societies.filter(s => {
    const matchSearch = !search.trim() || 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      (s.developer && s.developer.toLowerCase().includes(search.toLowerCase())) ||
      (s.sector && s.sector.includes(search));
    const matchMarket = !selectedMarket || s.microMarketId === selectedMarket;
    return matchSearch && matchMarket;
  });

  return (
    <div>
      <PageHeader
        title="Societies & Projects"
        description="Catalog of residential and commercial societies linked to micro-markets"
        actions={
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
        }
      />

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap'
      }}>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search by society name, developer, sector..."
        />

        <div style={{ minWidth: '220px' }}>
          <SelectField
            placeholder="All Micro Markets"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<RiCommunityLine />}
          title="No Societies Found"
          description={societies.length === 0 ? "You haven't added any societies or projects yet." : "No societies match your search criteria."}
          primaryAction={
            <button
              onClick={() => navigate('/societies/new')}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Add Society
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {filtered.map(s => {
            const count = properties.filter(p => p.societyId === s.id).length;
            return (
              <SocietyCard
                key={s.id}
                society={s}
                microMarketName={marketMap[s.microMarketId]}
                propertyCount={count}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
