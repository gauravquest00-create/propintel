import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { SelectField } from '../../components/common/SelectField';
import { useToast } from '../../hooks/useToast';
import { leadService } from '../../services/leadService';
import { microMarketService } from '../../services/microMarketService';
import { societyService } from '../../services/societyService';
import { 
  LEAD_STATUSES, 
  LEAD_REQUIREMENT_TYPES, 
  BHK_OPTIONS, 
  PROPERTY_TYPES, 
  LEAD_SOURCES,
  FURNISHING_OPTIONS,
  POSSESSION_STATUSES
} from '../../utils/constants';
import './LeadFormPage.css';

export function LeadFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [microMarkets, setMicroMarkets] = useState([]);
  const [societies, setSocieties] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    whatsapp: '',
    email: '',
    source: 'Direct Call',
    status: 'New',

    requirementType: 'Buying',
    preferredMicroMarketId: '',
    preferredLocation: '',
    preferredSocietyId: '',
    propertyType: 'Apartment',
    bhk: '3 BHK',
    minBudget: '',
    maxBudget: '',
    preferredSize: '1500 - 2000 Sq.Ft.',
    furnishing: 'Semi-Furnished',
    preferredFloor: 'Mid Floor (5-12)',
    possessionRequirement: 'Ready to Move',

    requirementDescription: '',
    notes: '',
    mustHave: '',
    dealBreakers: '',

    nextFollowUp: '',
    followUpNote: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMicroMarkets(microMarketService.getAll());
    setSocieties(societyService.getAll());

    if (isEdit) {
      const existing = leadService.getById(id);
      if (existing) {
        setFormData({
          ...existing,
          mustHave: Array.isArray(existing.mustHave) ? existing.mustHave.join(', ') : (existing.mustHave || ''),
          dealBreakers: Array.isArray(existing.dealBreakers) ? existing.dealBreakers.join(', ') : (existing.dealBreakers || '')
        });
      } else {
        toast.error('Lead not found');
        navigate('/leads');
      }
    }
  }, [id, isEdit]);

  const filteredSocieties = formData.preferredMicroMarketId
    ? societies.filter(s => s.microMarketId === formData.preferredMicroMarketId)
    : societies;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Lead name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        mustHave: formData.mustHave ? formData.mustHave.split(',').map(s => s.trim()).filter(Boolean) : [],
        dealBreakers: formData.dealBreakers ? formData.dealBreakers.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        leadService.update(id, payload);
        toast.success('Lead updated successfully');
        navigate(`/leads/${id}`);
      } else {
        const created = leadService.create(payload);
        toast.success('Lead recorded successfully');
        navigate(`/leads/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Error saving lead');
    }
  };

  return (
    <form className="lead-form-layout" onSubmit={handleSubmit}>
      <PageHeader
        title={isEdit ? 'Edit Lead Record' : 'Record New Prospect / Lead'}
        description="Structured buyer and tenant preferences for inventory matching and scheduled follow-ups"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ padding: '8px 16px', border: '1px solid var(--border-color)', background: 'var(--surface)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
            >
              {isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        }
      />

      {/* 1. Contact & Channel */}
      <div className="lead-form-card">
        <div className="lead-form-header">
          <h3 className="lead-form-title">1. Lead Identity & Contact Channel</h3>
          <p className="lead-form-desc">Primary client details and communication channels</p>
        </div>
        
        <div className="lead-form-grid-2">
          <FormField label="Full Name" error={errors.name} required>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Vikram Malhotra"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Phone Number" error={errors.phone} required>
            <input
              type="tel"
              className="input-field"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </FormField>

          <FormField label="WhatsApp / Alternate Phone">
            <input
              type="tel"
              className="input-field"
              placeholder="e.g. 9876543211"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              className="input-field"
              placeholder="vikram@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormField>

          <FormField label="Lead Acquisition Source">
            <SelectField
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              options={LEAD_SOURCES}
            />
          </FormField>

          <FormField label="Lead Pipeline Status">
            <SelectField
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={LEAD_STATUSES}
            />
          </FormField>
        </div>
      </div>

      {/* 2. Requirements & Location Mapping */}
      <div className="lead-form-card">
        <div className="lead-form-header">
          <h3 className="lead-form-title">2. Property Requirement & Location Matching</h3>
          <p className="lead-form-desc">Identify target asset classes, preferred micro-market zones, and societies</p>
        </div>

        <div className="lead-form-grid-3">
          <FormField label="Requirement Purpose" required>
            <SelectField
              value={formData.requirementType}
              onChange={(e) => setFormData({ ...formData, requirementType: e.target.value })}
              options={LEAD_REQUIREMENT_TYPES}
            />
          </FormField>

          <FormField label="Property Type">
            <SelectField
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              options={PROPERTY_TYPES}
            />
          </FormField>

          <FormField label="BHK Configuration">
            <SelectField
              value={formData.bhk}
              onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
              options={BHK_OPTIONS}
            />
          </FormField>

          <FormField label="Target Micro Market">
            <SelectField
              placeholder="All Micro Markets"
              value={formData.preferredMicroMarketId}
              onChange={(e) => setFormData({ ...formData, preferredMicroMarketId: e.target.value, preferredSocietyId: '' })}
              options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
            />
          </FormField>

          <FormField label="Target Society / Project">
            <SelectField
              placeholder="Select Preferred Society"
              value={formData.preferredSocietyId}
              onChange={(e) => setFormData({ ...formData, preferredSocietyId: e.target.value })}
              options={filteredSocieties.map(s => ({ value: s.id, label: s.name }))}
            />
          </FormField>

          <FormField label="Preferred Locality / Sector">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Sector 54, Sector 57"
              value={formData.preferredLocation}
              onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 3. Budget & Specifications */}
      <div className="lead-form-card">
        <div className="lead-form-header">
          <h3 className="lead-form-title">3. Budget, Size & Preferences</h3>
          <p className="lead-form-desc">Financial constraints, space requirements, and deal criteria</p>
        </div>

        <div className="lead-form-grid-3">
          <FormField label="Minimum Budget (₹)">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 20000000"
              value={formData.minBudget}
              onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
            />
          </FormField>

          <FormField label="Maximum Budget (₹)">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 27500000"
              value={formData.maxBudget}
              onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
            />
          </FormField>

          <FormField label="Preferred Area / Size">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 1700 - 2200 Sq.Ft."
              value={formData.preferredSize}
              onChange={(e) => setFormData({ ...formData, preferredSize: e.target.value })}
            />
          </FormField>

          <FormField label="Furnishing Preference">
            <SelectField
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              options={FURNISHING_OPTIONS}
            />
          </FormField>

          <FormField label="Preferred Floor Range">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Mid Floor (4-12) / Top Floor"
              value={formData.preferredFloor}
              onChange={(e) => setFormData({ ...formData, preferredFloor: e.target.value })}
            />
          </FormField>

          <FormField label="Possession Requirement">
            <SelectField
              value={formData.possessionRequirement}
              onChange={(e) => setFormData({ ...formData, possessionRequirement: e.target.value })}
              options={POSSESSION_STATUSES}
            />
          </FormField>
        </div>

        <div className="lead-form-grid-2" style={{ marginTop: 'var(--space-2)' }}>
          <FormField label="Must-Have Features (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Park facing, 2 car parking, high ceiling, modular kitchen"
              value={formData.mustHave}
              onChange={(e) => setFormData({ ...formData, mustHave: e.target.value })}
            />
          </FormField>

          <FormField label="Deal Breakers / Avoid (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ground floor, low ceiling, road noise, south facing"
              value={formData.dealBreakers}
              onChange={(e) => setFormData({ ...formData, dealBreakers: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 4. Follow-Up Schedule & Notes */}
      <div className="lead-form-card">
        <div className="lead-form-header">
          <h3 className="lead-form-title">4. Follow-Up Schedule & Operational Notes</h3>
          <p className="lead-form-desc">Schedule next interaction to prevent lead staleness</p>
        </div>
        
        <div className="lead-form-grid-2">
          <FormField label="Next Scheduled Follow-Up Date">
            <input
              type="date"
              className="input-field"
              value={formData.nextFollowUp ? formData.nextFollowUp.slice(0, 10) : ''}
              onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
            />
          </FormField>

          <FormField label="Follow-Up Objective / Action Item">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Share shortlisted options in Golf Course Ext"
              value={formData.followUpNote}
              onChange={(e) => setFormData({ ...formData, followUpNote: e.target.value })}
            />
          </FormField>

          <FormField label="Client Requirement Notes & Remarks" style={{ gridColumn: 'span 2' }}>
            <textarea
              rows={3}
              className="input-field"
              placeholder="Specific notes from client discussion, family preferences, finance/loan status..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
}