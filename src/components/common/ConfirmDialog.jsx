import React from 'react';
import { Modal } from './Modal';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontSize: 'var(--font-sm)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: danger ? 'var(--danger)' : 'var(--accent)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 'var(--font-sm)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
