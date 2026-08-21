import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FreshnessBadge } from '../../components/common/FreshnessBadge';
import { ActivityTimeline } from '../../components/leads/ActivityTimeline';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { leadService } from '../../services/leadService';
import { propertyService } from '../../services/propertyService';
import { microMarketService } from '../../services/microMarketService';
import { formatCurrency, formatPhone, formatDate } from '../../utils/formatters';
import { getFreshnessWarning } from '../../utils/freshness';
import { RiEditLine, RiDeleteBinLine, RiPhoneLine, RiMailLine, RiAlertLine } from 'react-icons/ri';
import './LeadDetailsPage.css';

export function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lead, setLead] = useState(null);
  const [microMarket, setMicroMarket] = useState(null);
  const [matchedProperties, setMatchedProperties] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const loadData = () => {
    const l = leadService.getById(id);
    if (!l) {
      toast.error('Lead not found');
      navigate('/leads');
      return;
    }
    setLead(l);
    if (l.preferredMicroMarketId) {
      setMicroMarket(microMarketService.getById(l.preferredMicroMarketId));
    }

    const allProps = propertyService.getAll();
    const matched = allProps.filter(p => {
      if (l.preferredMicroMarketId && p.microMarketId === l.preferredMicroMarketId) return true;
      if (l.bhk && p.bhk === l.bhk) return true;
      if (l.maxBudget && p.price && Number(p.price) <= Number(l.maxBudget)) return true;
      return false;
    });
    setMatchedProperties(matched.slice(0, 4));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!lead) return null;

  const warning = getFreshnessWarning(lead, 'lead');

  const handleDelete = () => {
    leadService.delete(lead.id);
    toast.success('Lead removed');
    navigate('/leads');
  };

  const handleAddActivity = (act) => {
    leadService.addActivity(lead.id, act);
    toast.success('Activity logged');
    loadData();
  };

  return (
    <div className="lead-details-layout">
      <PageHeader
        title={lead.name}
        description={`Lead ID: ${lead.id} • Registered on ${formatDate(lead.createdAt)}`}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate(`/leads/${lead.id}/edit`)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiEditLine />
              <span>Edit Lead</span>
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger-border)', background: 'var(--danger-subtle)', color: 'var(--danger-text)', fontSize: 'var(--font-sm)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiDeleteBinLine />
              <span>Delete</span>
            </button>
          </div>
        }
      />

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
          gap: '8px'
        }}>
          <RiAlertLine size={18} />
          <span>{warning}</span>
        </div>
      )}

      {/* Hero Overview */}
      <div className="lead-hero-card">
        <div className="lead-hero-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusBadge status={lead.status} type="lead" />
              <FreshnessBadge dateString={lead.lastUpdated || lead.updatedAt} />
            </div>
            <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, marginTop: '8px' }}>
              {lead.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: '6px', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RiPhoneLine color="var(--accent)" />
                <strong>{formatPhone(lead.phone)}</strong>
              </span>
              {lead.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RiMailLine color="var(--accent)" />
                  <span>{lead.email}</span>
                </span>
              )}
            </div>
          </div>

          <div className="lead-budget-badge">
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Budget Capacity</div>
            <div className="lead-budget-val">
              {lead.maxBudget ? formatCurrency(lead.maxBudget, lead.requirementType) : 'Flexible Budget'}
            </div>
          </div>
        </div>

        <div className="lead-facts-grid">
          <div>
            <span className="fact-label">Requirement</span>
            <span className="fact-val">{lead.requirementType}</span>
          </div>
          <div>
            <span className="fact-label">Configuration</span>
            <span className="fact-val">{lead.bhk || 'Any Config'}</span>
          </div>
          <div>
            <span className="fact-label">Property Type</span>
            <span className="fact-val">{lead.propertyType || 'Apartment'}</span>
          </div>
          <div>
            <span className="fact-label">Target Zone</span>
            <span className="fact-val">{microMarket ? microMarket.name : (lead.preferredLocation || 'Any Location')}</span>
          </div>
        </div>
      </div>

      <div className="lead-details-grid">
        {/* Activity Timeline */}
        <ActivityTimeline
          activities={lead.activities || []}
          onAddActivity={handleAddActivity}
        />

        {/* Matched Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>
            Matched Inventory Suggestions ({matchedProperties.length})
          </h3>
          {matchedProperties.length === 0 ? (
            <div style={{ background: 'var(--surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
              No matching properties in current inventory.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {matchedProperties.map(p => (
                <div 
                  key={p.id}
                  className="matched-card-item"
                  onClick={() => navigate(`/properties/${p.id}`)}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{p.title}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>{p.bhk} • {p.sector ? `Sec ${p.sector}` : ''}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 'var(--font-sm)', whiteSpace: 'nowrap' }}>
                    {formatCurrency(p.price, p.transactionType)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lead Record"
        message="Are you sure you want to permanently delete this lead? All logged activities will be removed."
        danger={true}
        confirmText="Delete Lead"
      />
    </div>
  );
}