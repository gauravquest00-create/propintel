import React from 'react';
import './DistributionChart.css';

export function DistributionChart({ title, data = {}, total = 0, color = 'var(--accent)' }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (!entries.length || total === 0) {
    return (
      <div className="dist-card">
        <h4 className="dist-title">{title}</h4>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-4) 0' }}>
          No data recorded yet
        </div>
      </div>
    );
  }

  return (
    <div className="dist-card">
      <h4 className="dist-title">{title}</h4>
      <div className="dist-list">
        {entries.slice(0, 6).map(([label, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={label} className="dist-row">
              <div className="dist-row-top">
                <span className="dist-label">{label}</span>
                <span className="dist-count">{count} ({percentage}%)</span>
              </div>
              <div className="dist-bar-track">
                <div 
                  className="dist-bar-fill" 
                  style={{ width: `${percentage}%`, background: color }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
