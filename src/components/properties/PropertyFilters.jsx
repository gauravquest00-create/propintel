import React from 'react';
import { BHK_OPTIONS, PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUSES } from '../../utils/constants';
import { SelectField } from '../common/SelectField';
import { SearchBar } from '../common/SearchBar';
import { RiFilter3Line, RiRefreshLine } from 'react-icons/ri';
import './PropertyFilters.css';

export function PropertyFilters({
  search,
  setSearch,
  filters,
  setFilters,
  sort,
  setSort,
  microMarkets = [],
  societies = [],
  onReset
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-row-main">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search by title, ID, society, owner phone..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: showAdvanced ? 'var(--accent-subtle)' : 'var(--surface)',
              color: showAdvanced ? 'var(--accent-text)' : 'var(--text-secondary)',
              fontSize: 'var(--font-sm)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiFilter3Line />
            <span>Filters</span>
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-sm)',
              outline: 'none'
            }}
          >
            <option value="recentlyAdded">Recently Added</option>
            <option value="recentlyUpdated">Recently Updated</option>
            <option value="oldest">Oldest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="sizeLowHigh">Size: Low to High</option>
            <option value="titleAZ">Title: A to Z</option>
          </select>

          <button
            onClick={onReset}
            title="Reset Filters"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--surface)',
              color: 'var(--text-tertiary)'
            }}
          >
            <RiRefreshLine size={16} />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="filter-grid animate-fade-in">
          <SelectField
            placeholder="All Micro Markets"
            value={filters.microMarketId || ''}
            onChange={(e) => handleFilterChange('microMarketId', e.target.value)}
            options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
          />

          <SelectField
            placeholder="All Societies"
            value={filters.societyId || ''}
            onChange={(e) => handleFilterChange('societyId', e.target.value)}
            options={societies.map(s => ({ value: s.id, label: s.name }))}
          />

          <SelectField
            placeholder="Property Type"
            value={filters.propertyType || ''}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            options={PROPERTY_TYPES}
          />

          <SelectField
            placeholder="Transaction Type"
            value={filters.transactionType || ''}
            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
            options={TRANSACTION_TYPES}
          />

          <SelectField
            placeholder="Status"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={PROPERTY_STATUSES}
          />
        </div>
      )}
    </div>
  );
}
