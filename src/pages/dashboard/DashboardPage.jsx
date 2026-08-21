import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { AttentionEngineCard } from '../../components/dashboard/AttentionEngineCard';
import { DistributionChart } from '../../components/dashboard/DistributionChart';
import { EmptyState } from '../../components/common/EmptyState';
import { propertyService } from '../../services/propertyService';
import { leadService } from '../../services/leadService';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { healthEngineService } from '../../services/healthEngineService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  RiBuildingLine, 
  RiUserSearchLine, 
  RiCommunityLine, 
  RiMapPin2Line,
  RiAddLine,
  RiArrowRightLine,
  RiUpload2Line
} from 'react-icons/ri';
import './DashboardPage.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [microMarkets, setMicroMarkets] = useState([]);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const loadAll = () => {
      setProperties(propertyService.getAll());
      setLeads(leadService.getAll());
      setSocieties(societyService.getAll());
      setMicroMarkets(microMarketService.getAll());
      setHealthData(healthEngineService.getSystemHealth());
    };
    loadAll();
  }, []);

  const isEmptyWorkspace = properties.length === 0 && leads.length === 0 && societies.length === 0 && microMarkets.length === 0;

  // Compute distributions
  const bhkDist = properties.reduce((acc, p) => {
    acc[p.bhk || 'Other'] = (acc[p.bhk || 'Other'] || 0) + 1;
    return acc;
  }, {});

  const typeDist = properties.reduce((acc, p) => {
    acc[p.propertyType || 'Apartment'] = (acc[p.propertyType || 'Apartment'] || 0) + 1;
    return acc;
  }, {});

  const txDist = properties.reduce((acc, p) => {
    acc[p.transactionType || 'Resale'] = (acc[p.transactionType || 'Resale'] || 0) + 1;
    return acc;
  }, {});

  const leadStatusDist = leads.reduce((acc, l) => {
    acc[l.status || 'New'] = (acc[l.status || 'New'] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Intelligence Dashboard"
        description="Real-time property inventory, lead status, and system guidance metrics"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
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
              onClick={() => navigate('/leads/new')}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
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

      {isEmptyWorkspace ? (
        <EmptyState
          icon={<RiBuildingLine />}
          title="Your Workspace is Ready"
          description="Start building your intelligence repository by creating micro-markets, societies, properties, and leads, or import your existing spreadsheets."
          primaryAction={
            <button
              onClick={() => navigate('/properties/new')}
              style={{ padding: '9px 18px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Add First Property
            </button>
          }
          secondaryAction={
            <button
              onClick={() => navigate('/micro-markets/new')}
              style={{ padding: '9px 18px', border: '1px solid var(--border-color)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              Create Micro Market
            </button>
          }
        />
      ) : (
        <>
          {/* Overview Metrics Cards */}
          <div className="dashboard-grid-metrics">
            <StatCard
              title="Total Properties"
              value={properties.length}
              subtitle="Active inventory units"
              icon={<RiBuildingLine />}
              link="/properties"
            />
            <StatCard
              title="Total Leads"
              value={leads.length}
              subtitle="Active prospects & requirements"
              icon={<RiUserSearchLine />}
              link="/leads"
            />
            <StatCard
              title="Societies"
              value={societies.length}
              subtitle="Residential & commercial projects"
              icon={<RiCommunityLine />}
              link="/societies"
            />
            <StatCard
              title="Micro Markets"
              value={microMarkets.length}
              subtitle="Strategic investment corridors"
              icon={<RiMapPin2Line />}
              link="/micro-markets"
            />
          </div>

          {/* Attention Engine */}
          <AttentionEngineCard healthData={healthData} />

          {/* Distributions */}
          <div className="dashboard-insights-grid">
            <DistributionChart
              title="Properties by BHK Config"
              data={bhkDist}
              total={properties.length}
              color="var(--accent)"
            />
            <DistributionChart
              title="Properties by Type"
              data={typeDist}
              total={properties.length}
              color="var(--info)"
            />
            <DistributionChart
              title="Transaction Breakdown"
              data={txDist}
              total={properties.length}
              color="var(--success)"
            />
            <DistributionChart
              title="Lead Pipeline Status"
              data={leadStatusDist}
              total={leads.length}
              color="var(--warning)"
            />
          </div>

          {/* Recent Records */}
          <div className="dashboard-recent-grid">
            <div className="recent-box">
              <div className="recent-box-header">
                <h3 className="recent-box-title">Recently Added Properties</h3>
                <button
                  onClick={() => navigate('/properties')}
                  style={{ fontSize: 'var(--font-xs)', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>View All</span>
                  <RiArrowRightLine />
                </button>
              </div>
              <div className="recent-list">
                {properties.slice(0, 5).map(p => (
                  <div key={p.id} className="recent-item" onClick={() => navigate(`/properties/${p.id}`)}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {p.bhk} • {p.propertyType} • {p.sector ? `Sec ${p.sector}` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--accent)' }}>
                        {formatCurrency(p.price, p.transactionType)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {formatDate(p.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-4)' }}>
                    No properties added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="recent-box">
              <div className="recent-box-header">
                <h3 className="recent-box-title">Recently Updated Leads</h3>
                <button
                  onClick={() => navigate('/leads')}
                  style={{ fontSize: 'var(--font-xs)', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <span>View All</span>
                  <RiArrowRightLine />
                </button>
              </div>
              <div className="recent-list">
                {leads.slice(0, 5).map(l => (
                  <div key={l.id} className="recent-item" onClick={() => navigate(`/leads/${l.id}`)}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {l.requirementType} • {l.bhk || 'Any BHK'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: 'var(--surface-active)', fontWeight: 600 }}>
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-4)' }}>
                    No leads added yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
