import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { exportService } from '../../services/exportService';
import { storageService } from '../../services/storageService';
import { formatDate } from '../../utils/formatters';
import { 
  RiSunLine, 
  RiMoonLine, 
  RiRefreshLine, 
  RiLogoutBoxRLine,
  RiFileExcel2Line,
  RiFileCodeLine
} from 'react-icons/ri';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    try {
      updateProfile(profileForm);
      toast.success('Profile details updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResetData = () => {
    storageService.resetAll();
    toast.success('Workspace reset to initial blank state');
    window.location.reload();
  };

  return (
    <div className="profile-layout">
      <PageHeader
        title="Workspace Profile & Data Center"
        description="Manage user identity, theme preferences, backup exports, and storage integrity"
      />

      <div className="profile-grid">
        {/* Account Info */}
        <div className="profile-card">
          <div className="profile-user-header">
            <div className="profile-avatar-large">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="profile-user-meta">
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{user?.fullName || 'Workspace User'}</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>{user?.email}</p>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Member since {formatDate(user?.createdAt)}</span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <FormField label="Full Name">
              <input
                type="text"
                className="input-field"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              />
            </FormField>
            <FormField label="Phone Number">
              <input
                type="tel"
                className="input-field"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </FormField>
            <button
              type="submit"
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--font-xs)', alignSelf: 'flex-start' }}
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Workspace Theme & Security */}
        <div className="profile-card">
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Appearance & Security</h3>
          
          <div className="theme-toggle-row">
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Workspace Theme</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Currently set to {theme === 'dark' ? 'Dark' : 'Light'} Mode</div>
            </div>
            <button
              onClick={toggleTheme}
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface)', fontSize: 'var(--font-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {theme === 'light' ? <RiMoonLine /> : <RiSunLine />}
              <span>Switch to {theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Change Password</span>
            <input
              type="password"
              placeholder="Current Password"
              className="input-field"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="input-field"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="input-field"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
            />
            <button
              type="submit"
              style={{ padding: '8px 16px', border: '1px solid var(--border-color)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--font-xs)', alignSelf: 'flex-start' }}
            >
              Update Password
            </button>
          </form>

          <button
            onClick={logout}
            className="signout-btn"
          >
            <RiLogoutBoxRLine />
            <span>Sign Out of Workspace</span>
          </button>
        </div>

        {/* Data Export & Backup */}
        <div className="profile-card full-width">
          <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Data Export & Workspace Integrity</h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            Export all records as JSON backups or spreadsheet CSV files for offline analysis and reporting.
          </p>

          <div className="export-btn-grid">
            <button className="export-tile" onClick={() => exportService.exportJSON('all')}>
              <RiFileCodeLine size={20} color="var(--accent)" />
              <span>Full JSON Backup</span>
            </button>
            <button className="export-tile" onClick={() => exportService.exportCSV('properties')}>
              <RiFileExcel2Line size={20} color="var(--success)" />
              <span>Properties (CSV)</span>
            </button>
            <button className="export-tile" onClick={() => exportService.exportCSV('leads')}>
              <RiFileExcel2Line size={20} color="var(--info)" />
              <span>Leads (CSV)</span>
            </button>
            <button className="export-tile" onClick={() => exportService.exportCSV('societies')}>
              <RiFileExcel2Line size={20} color="var(--warning)" />
              <span>Societies (CSV)</span>
            </button>
          </div>

          <div className="reset-data-section">
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--danger)' }}>Reset Workspace Database</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>Erase all stored properties, leads, societies, and micro markets from LocalStorage.</div>
            </div>
            <button
              onClick={() => setResetConfirmOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 'var(--font-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <RiRefreshLine />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Factory Reset Workspace Data"
        message="This action will permanently delete all properties, leads, societies, and micro markets stored in LocalStorage. Are you sure you want to proceed?"
        danger={true}
        confirmText="Confirm Reset"
      />
    </div>
  );
}