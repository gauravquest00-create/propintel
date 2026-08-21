import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAlertLine, RiArrowRightLine, RiCheckboxCircleLine } from 'react-icons/ri';
import './AttentionEngineCard.css';

export function AttentionEngineCard({ healthData }) {
  const navigate = useNavigate();

  if (!healthData || !healthData.items || healthData.items.length === 0) {
    return (
      <div className="attention-section" style={{ borderColor: 'var(--success-border)', background: 'var(--success-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <RiCheckboxCircleLine size={24} color="var(--success-text)" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--success-text)', fontSize: 'var(--font-sm)' }}>
              System Health Optimal
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              All properties are verified, leads are up to date, and data relationships are intact.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="attention-section">
      <div className="attention-header">
        <div className="attention-title-area">
          <RiAlertLine size={20} color="var(--warning-text)" />
          <h2 className="attention-title">System Guidance & Attention Engine</h2>
          <span className="attention-badge">{healthData.totalIssues} Action Items</span>
        </div>
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
          Prioritized operational items requiring update or verification
        </span>
      </div>

      <div className="attention-grid">
        {healthData.items.map((item) => (
          <div
            key={item.id}
            className={`attention-card severity-${item.severity}`}
            onClick={() => item.link && navigate(item.link)}
          >
            <div>
              <div className="card-top">
                <span className="card-tag">{item.category}</span>
                <span className="card-count">{item.count}</span>
              </div>
              <div className="card-title" style={{ marginTop: '6px' }}>{item.title}</div>
              <div className="card-desc" style={{ marginTop: '4px' }}>{item.description}</div>
            </div>
            <div className="card-action">
              <span>Take Action</span>
              <RiArrowRightLine />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
