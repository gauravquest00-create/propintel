import React, { useState } from 'react';
import { formatDateTime } from '../../utils/formatters';
import { RiAddLine } from 'react-icons/ri';
import './ActivityTimeline.css';

export function ActivityTimeline({ activities = [], onAddActivity }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('Call');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddActivity({ type, title, note });
    setTitle('');
    setNote('');
    setShowAdd(false);
  };

  return (
    <div className="timeline-box">
      <div className="timeline-header">
        <h4 className="timeline-title">Activity & Interactions</h4>
        <button className="timeline-add-btn" onClick={() => setShowAdd(!showAdd)}>
          <RiAddLine />
          <span>Log Activity</span>
        </button>
      </div>

      {showAdd && (
        <form className="timeline-form animate-fade-in" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-xs)' }}
            >
              <option value="Call">Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Meeting">Meeting</option>
              <option value="Note">Note</option>
            </select>
            <input
              type="text"
              placeholder="Activity Title (e.g. Discussed 3BHK options)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ flex: 1, padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-xs)' }}
            />
          </div>
          <textarea
            placeholder="Detailed notes or outcome..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-xs)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <button type="button" onClick={() => setShowAdd(false)} style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Cancel</button>
            <button type="submit" style={{ padding: '4px 12px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-xs)', fontWeight: 600 }}>Save</button>
          </div>
        </form>
      )}

      <div className="timeline-list">
        {activities.map((act) => (
          <div key={act.id} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="timeline-act-title">{act.title}</span>
                <span className="timeline-date">{formatDateTime(act.timestamp)}</span>
              </div>
              {act.note && <p className="timeline-note">{act.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
