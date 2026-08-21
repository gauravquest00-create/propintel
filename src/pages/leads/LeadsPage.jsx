import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { LeadCard } from '../../components/leads/LeadCard';
import { SearchBar } from '../../components/common/SearchBar';
import { SelectField } from '../../components/common/SelectField';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { ImportWizard } from '../../components/import/ImportWizard';
import { leadService } from '../../services/leadService';
import { microMarketService } from '../../services/microMarketService';
import { societyService } from '../../services/societyService';
import { LEAD_STATUSES, LEAD_REQUIREMENT_TYPES, BHK_OPTIONS } from '../../utils/constants';
import { RiUserSearchLine, RiAddLine, RiUpload2Line, RiFilter3Line } from 'react-icons/ri';

export function LeadsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [leads, setLeads] = useState([]);
  const [microMarkets, setMicroMarkets] = useState([]);
  const [societies, setSocieties] = useState([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recentlyAdded');
  const [filters, setFilters] = useState({
    status: '',
    requirementType: '',
    microMarketId: '',
    bhk: '',
    overdueOnly: searchParams.get('overdue') === 'true',
    staleOnly: searchParams.get('stale') === 'true'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const loadData = () => {
    setLeads(leadService.getAll());
    setMicroMarkets(microMarketService.getAll());
    setSocieties(societyService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLeads = leadService.filterAndSort(leads, { search, filters, sort });
  const marketMap = microMarkets.reduce((acc, m) => { acc[m.id] = m.name; return acc; }, {});

  return (
    <div>
      <PageHeader
        title="Lead Intelligence & Tracking"
        description="Structured tracking of buyer/tenant requirements, preferences, and follow-ups"
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
              onClick={() => navigate('/leads/new')}
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
              <span>Add Lead</span>
            </button>
          </div>
        }
      />

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search leads by name, phone, email, locality..."
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: showFilters ? 'var(--accent-subtle)' : 'var(--surface)',
                color: showFilters ? 'var(--accent-text)' : 'var(--text-secondary)',
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
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-sm)' }}
            >
              <option value="recentlyAdded">Recently Added</option>
              <option value="recentlyUpdated">Recently Updated</option>
              <option value="followUpAsc">Follow-Up Date (Earliest)</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color)' }}>
            <SelectField
              placeholder="All Statuses"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={LEAD_STATUSES}
            />
            <SelectField
              placeholder="Requirement Type"
              value={filters.requirementType}
              onChange={(e) => setFilters({ ...filters, requirementType: e.target.value })}
              options={LEAD_REQUIREMENT_TYPES}
            />
            <SelectField
              placeholder="Micro Market"
              value={filters.microMarketId}
              onChange={(e) => setFilters({ ...filters, microMarketId: e.target.value })}
              options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
            />
            <SelectField
              placeholder="BHK Preference"
              value={filters.bhk}
              onChange={(e) => setFilters({ ...filters, bhk: e.target.value })}
              options={BHK_OPTIONS}
            />
          </div>
        )}
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={<RiUserSearchLine />}
          title="No Leads Found"
          description={leads.length === 0 ? "You haven't recorded any leads yet." : "No leads match your active filters."}
          primaryAction={
            <button
              onClick={() => navigate('/leads/new')}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Add Lead
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {filteredLeads.map(l => (
            <LeadCard
              key={l.id}
              lead={l}
              microMarketName={marketMap[l.preferredMicroMarketId]}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Leads"
        maxWidth="800px"
      >
        <ImportWizard
          targetType="leads"
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
