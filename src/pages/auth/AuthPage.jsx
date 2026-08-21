import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { FormField } from '../../components/common/FormField';
import { RiDatabase2Line } from 'react-icons/ri';
import './AuthPage.css';

export function AuthPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      login(formData.email, formData.password);
      toast.success('Welcome back to your workspace');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left-brand">
        <div className="brand-header">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            <RiDatabase2Line />
          </div>
          <span>PropIntel</span>
        </div>

        <div className="brand-hero">
          <h1 className="brand-hero-title">
            Your Dedicated Property & Micro-Market Intelligence Workspace
          </h1>
          <p className="brand-hero-desc">
            Organize inventory, map societies to micro-markets, track lead requirements, and eliminate stale information with continuous data freshness tracking.
          </p>
        </div>

        <div className="brand-footer">
          PropIntel Intelligence System • Single-Operator Local Workspace
        </div>
      </div>

      <div className="auth-right-form">
        <div className="auth-form-card animate-fade-in">
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', fontSize: 'var(--font-xs)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Single-Operator Workspace
          </div>

          <h2 className="auth-title">Sign In to Workspace</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your private property and lead database.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <FormField label="Email Address" error={errors.email} required>
              <input
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoFocus
              />
            </FormField>

            <FormField label="Password" error={errors.password} required>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormField>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: 'var(--font-xs)', color: 'var(--text-tertiary)' }}>
            🔒 Private Workspace • New user registration is restricted
          </div>
        </div>
      </div>
    </div>
  );
}