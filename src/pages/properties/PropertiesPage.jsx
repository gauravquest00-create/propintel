import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { PropertyFilters } from '../../components/properties/PropertyFilters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ImportWizard } from '../../components/import/ImportWizard';
import { propertyService } from '../../services/propertyService';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { RiBuildingLine, RiAddLine, RiUpload2Line } from 'react-icons/ri';
import './PropertiesPage.css';

export function PropertiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [microMarkets, setMicroMarkets] = useState([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recentlyAdded');
  const [filters, setFilters] = useState({
    bhk: [],
    microMarketId: '',
    societyId: '',
    propertyType: '',
    transactionType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    staleOnly: searchParams.get('stale') === 'true',
    incompleteOnly: searchParams.get('incomplete') === 'true',
    missingSociety: searchParams.get('missingSociety') === 'true'
  });

  const [importOpen, setImportOpen] = useState(false);

  const loadData = () => {
    setProperties(propertyService.getAll());
    setSocieties(societyService.getAll());
    setMicroMarkets(microMarketService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProperties = propertyService.filterAndSort(properties, { search, filters, sort });

  const societyMap = societies.reduce((acc, s) => { acc[s.id] = s.name; return acc; }, {});
  const marketMap = microMarkets.reduce((acc, m) => { acc[m.id] = m.name; return acc; }, {});

  return (
    <div>
      <PageHeader
        title="Property Inventory"
        description="Structured catalog of managed residential, commercial, and land properties"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setImportOpen(true)}
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
              <RiUpload2Line />
              <span>Import</span>
            </button>
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
          </div>
        }
      />

      <PropertyFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        microMarkets={microMarkets}
        societies={societies}
        onReset={() => {
          setSearch('');
          setFilters({ bhk: [], microMarketId: '', societyId: '', propertyType: '', transactionType: '', status: '', minPrice: '', maxPrice: '' });
          setSort('recentlyAdded');
        }}
      />

      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={<RiBuildingLine />}
          title="No Properties Found"
          description={properties.length === 0 ? "You haven't added any properties to your inventory yet." : "No properties match your current search and filter criteria."}
          primaryAction={
            <button
              onClick={() => navigate('/properties/new')}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Add Property
            </button>
          }
          secondaryAction={
            properties.length === 0 ? (
              <button
                onClick={() => setImportOpen(true)}
                style={{ padding: '8px 16px', border: '1px solid var(--border-color)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
              >
                Import Inventory
              </button>
            ) : null
          }
        />
      ) : (
        <div className="property-grid">
          {filteredProperties.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              societyName={societyMap[p.societyId]}
              microMarketName={marketMap[p.microMarketId]}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Properties"
        maxWidth="800px"
      >
        <ImportWizard
          targetType="properties"
          onComplete={() => {
            loadData();
            setImportOpen(false);
          }}
          onCancel={() => setImportOpen(false)}
        />
      </Modal>
    </div>
  );
}
