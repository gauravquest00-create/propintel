import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { SelectField } from '../../components/common/SelectField';
import { useToast } from '../../hooks/useToast';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { POSSESSION_STATUSES, DEFAULT_AMENITIES } from '../../utils/constants';
import './SocietyFormPage.css';

export function SocietyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [microMarkets, setMicroMarkets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    microMarketId: '',
    sector: '',
    city: 'Gurugram',
    address: '',
    propertyTypes: 'Apartment, Penthouse',
    totalTowers: '',
    totalUnits: '',
    rera: '',
    possession: 'Ready to Move',
    maintenancePerSqFt: '4.5',
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', '24x7 Security', 'Power Backup'],
    nearbyLandmarks: 'Metro Station, Shopping Mall, Reputed Schools',
    description: '',
    usp: 'Gated community, premium construction, prime connectivity',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMicroMarkets(microMarketService.getAll());
    if (isEdit) {
      const existing = societyService.getById(id);
      if (existing) {
        setFormData({
          ...existing,
          propertyTypes: Array.isArray(existing.propertyTypes) ? existing.propertyTypes.join(', ') : (existing.propertyTypes || ''),
          amenities: Array.isArray(existing.amenities) ? existing.amenities : (existing.amenities ? existing.amenities.split(',').map(s => s.trim()) : []),
          nearbyLandmarks: Array.isArray(existing.nearbyLandmarks) ? existing.nearbyLandmarks.join(', ') : (existing.nearbyLandmarks || ''),
          usp: Array.isArray(existing.usp) ? existing.usp.join(', ') : (existing.usp || '')
        });
      } else {
        toast.error('Society not found');
        navigate('/societies');
      }
    }
  }, [id, isEdit]);

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Society name is required';
    if (!formData.sector.trim()) errs.sector = 'Sector is required';
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
        propertyTypes: formData.propertyTypes ? formData.propertyTypes.split(',').map(s => s.trim()).filter(Boolean) : [],
        amenities: formData.amenities,
        nearbyLandmarks: formData.nearbyLandmarks ? formData.nearbyLandmarks.split(',').map(s => s.trim()).filter(Boolean) : [],
        usp: formData.usp ? formData.usp.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        societyService.update(id, payload);
        toast.success('Society updated successfully');
        navigate(`/societies/${id}`);
      } else {
        const created = societyService.create(payload);
        toast.success('Society created successfully');
        navigate(`/societies/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Error saving society');
    }
  };

  return (
    <form className="society-form-layout" onSubmit={handleSubmit}>
      <PageHeader
        title={isEdit ? 'Edit Society' : 'Add New Society / Project'}
        description="Establish structural society metadata, scale specifications, and micro-market relationships"
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
              {isEdit ? 'Save Changes' : 'Create Society'}
            </button>
          </div>
        }
      />

      {/* 1. Identity & Developer */}
      <div className="society-form-card">
        <div className="society-form-header">
          <h3 className="society-form-title">1. Society Identity & Developer</h3>
          <p className="society-form-desc">Project branding, builder, and regulatory identifiers</p>
        </div>

        <div className="society-form-grid-2">
          <FormField label="Society / Project Name" error={errors.name} required>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. DLF The Crest or Emaar Palm Heights"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Developer / Builder Brand">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. DLF, Emaar, Godrej, M3M"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            />
          </FormField>

          <FormField label="RERA Registration Number">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. RC/REP/HARERA/GGM/2017/04"
              value={formData.rera}
              onChange={(e) => setFormData({ ...formData, rera: e.target.value })}
            />
          </FormField>

          <FormField label="Project Possession Status">
            <SelectField
              value={formData.possession}
              onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
              options={POSSESSION_STATUSES}
            />
          </FormField>

          <FormField label="Project Architectural Description" style={{ gridColumn: 'span 2' }}>
            <textarea
              rows={3}
              className="input-field"
              placeholder="Overview of architecture, landscape design, construction technology..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 2. Location & Micro Market Relationship */}
      <div className="society-form-card">
        <div className="society-form-header">
          <h3 className="society-form-title">2. Location & Micro Market Relationship</h3>
          <p className="society-form-desc">Connect this project to its parent micro-market zone</p>
        </div>

        <div className="society-form-grid-2">
          <FormField label="Linked Micro Market">
            <SelectField
              placeholder="Select Micro Market Zone"
              value={formData.microMarketId}
              onChange={(e) => setFormData({ ...formData, microMarketId: e.target.value })}
              options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
            />
          </FormField>

          <FormField label="Sector" error={errors.sector} required>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 54 or 83"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </FormField>

          <FormField label="City / Region">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Gurugram"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </FormField>

          <FormField label="Address / Road Landmark">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Sector 54, Golf Course Road"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 3. Project Scale & Unit Dimensions */}
      <div className="society-form-card">
        <div className="society-form-header">
          <h3 className="society-form-title">3. Scale, Configuration & Commercials</h3>
          <p className="society-form-desc">Project capacity, towers, units, and maintenance benchmarks</p>
        </div>

        <div className="society-form-grid-3">
          <FormField label="Total Towers">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 6"
              value={formData.totalTowers}
              onChange={(e) => setFormData({ ...formData, totalTowers: e.target.value })}
            />
          </FormField>

          <FormField label="Total Residential Units">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 504"
              value={formData.totalUnits}
              onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
            />
          </FormField>

          <FormField label="Maintenance (₹ / sq.ft.)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 4.5"
              value={formData.maintenancePerSqFt}
              onChange={(e) => setFormData({ ...formData, maintenancePerSqFt: e.target.value })}
            />
          </FormField>

          <FormField label="Supported Property Types" style={{ gridColumn: 'span 3' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 3 BHK, 4 BHK Luxury Apartments, Penthouses"
              value={formData.propertyTypes}
              onChange={(e) => setFormData({ ...formData, propertyTypes: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 4. Amenities & Connectivity */}
      <div className="society-form-card">
        <div className="society-form-header">
          <h3 className="society-form-title">4. Society Amenities & Connectivity</h3>
          <p className="society-form-desc">Select available clubhouse and security amenities</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-3)' }}>
          {DEFAULT_AMENITIES.map(amenity => {
            const isSelected = formData.amenities.includes(amenity);
            return (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-xs)',
                  fontWeight: 600,
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                  background: isSelected ? 'var(--accent-subtle)' : 'var(--surface)',
                  color: isSelected ? 'var(--accent-text)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {isSelected ? '✓ ' : '+ '}{amenity}
              </button>
            );
          })}
        </div>

        <div className="society-form-grid-2">
          <FormField label="Nearby Landmarks (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Rapid Metro, One Horizon Center, The Shri Ram School"
              value={formData.nearbyLandmarks}
              onChange={(e) => setFormData({ ...formData, nearbyLandmarks: e.target.value })}
            />
          </FormField>

          <FormField label="Key Project USPs (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ultra luxury clubhouse, Low density, DLF legacy"
              value={formData.usp}
              onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
            />
          </FormField>

          <FormField label="Internal Brokerage & Verification Notes" style={{ gridColumn: 'span 2' }}>
            <textarea
              rows={2}
              className="input-field"
              placeholder="Transfer charges, registry status, association guidelines..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
}