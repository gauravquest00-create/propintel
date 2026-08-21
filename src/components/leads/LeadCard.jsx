import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPhone, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { FreshnessBadge } from '../common/FreshnessBadge';
import { RiCalendarEventLine } from 'react-icons/ri';
import './LeadCard.css';

export function LeadCard({ lead, microMarketName, societyName }) {
  const navigate = useNavigate();

  const isOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();

  return (
    <div 
      className="lead-card"
      onClick={() => navigate(`/leads/${lead.id}`)}
    >
      <div>
        <div className="lead-header">
          <div>
            <h3 className="lead-name">{lead.name}</h3>
            <div className="lead-contact-line">
              {formatPhone(lead.phone)} {lead.email ? `• ${lead.email}` : ''}
            </div>
          </div>
          <StatusBadge status={lead.status} type="lead" />
        </div>

        <div className="lead-req-box" style={{ marginTop: '10px' }}>
          <div className="lead-req-title">
            {lead.requirementType} • {lead.bhk || 'Any Config'} {lead.propertyType || 'Property'}
          </div>
          <div className="lead-req-sub">
            Budget: {lead.maxBudget ? formatCurrency(lead.maxBudget, lead.requirementType) : 'Flexible'}
            {microMarketName ? ` • ${microMarketName}` : ''}
            {lead.preferredLocation ? ` (${lead.preferredLocation})` : ''}
          </div>
        </div>
      </div>

      <div className="lead-footer">
        <FreshnessBadge dateString={lead.lastUpdated || lead.updatedAt} />
        {lead.nextFollowUp ? (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: isOverdue ? 'var(--danger)' : 'var(--text-secondary)',
            fontWeight: isOverdue ? 700 : 500
          }}>
            <RiCalendarEventLine />
            <span>Follow-up: {formatDate(lead.nextFollowUp)}</span>
          </span>
        ) : (
          <span>No follow-up set</span>
        )}
      </div>
    </div>
  );
}
