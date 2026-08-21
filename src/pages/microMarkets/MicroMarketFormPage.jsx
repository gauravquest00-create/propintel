import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { SelectField } from '../../components/common/SelectField';
import { useToast } from '../../hooks/useToast';
import { microMarketService } from '../../services/microMarketService';
import './MicroMarketFormPage.css';

const MARKET_STATUSES = [
  'Established Luxury Hub',
  'High-Growth Corridor',
  'Emerging Developing Zone',
  'Commercial / IT Corridor',
  'Matured Residential Sector',
  'Investment Hotspot'
];

export function MicroMarketFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    status: 'Established Luxury Hub',
    city: 'Gurugram',
    description: '',
    keySectors: '54, 55, 56, 57',
    majorRoads: '16-lane Golf Course Road, Rapid Metro Line, NH-48',
    metroConnectivity: 'Gurugram Rapid Metro Line (Sector 55-56 to Sikanderpur)',
    airportConnectivity: '20-25 mins via NH-48 / Cyber City',
    nearbyLandmarks: 'One Horizon Center, DLF Mega Mall, Horizon Plaza',
    majorDevelopers: 'DLF, Emaar, M3M, Ireo',
    majorSocieties: 'DLF The Camellias, DLF The Crest, Central Park 1',
    avgPriceRange: '₹25,000 - ₹50,000+ / sq.ft.',
    rentalYield: '3.5% - 4.5%',
    usp: 'Premier corporate hub, signal-free corridor, top-tier luxury rental yield',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const existing = microMarketService.getById(id);
      if (existing) {
        setFormData({
          ...existing,
          keySectors: Array.isArray(existing.keySectors) ? existing.keySectors.join(', ') : (existing.keySectors || ''),
          majorRoads: Array.isArray(existing.majorRoads) ? existing.majorRoads.join(', ') : (existing.majorRoads || ''),
          nearbyLandmarks: Array.isArray(existing.nearbyLandmarks) ? existing.nearbyLandmarks.join(', ') : (existing.nearbyLandmarks || ''),
          majorDevelopers: Array.isArray(existing.majorDevelopers) ? existing.majorDevelopers.join(', ') : (existing.majorDevelopers || ''),
          majorSocieties: Array.isArray(existing.majorSocieties) ? existing.majorSocieties.join(', ') : (existing.majorSocieties || ''),
          usp: Array.isArray(existing.usp) ? existing.usp.join(', ') : (existing.usp || '')
        });
      } else {
        toast.error('Micro Market not found');
        navigate('/micro-markets');
      }
    }
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Micro market name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        keySectors: formData.keySectors ? formData.keySectors.split(',').map(s => s.trim()).filter(Boolean) : [],
        majorRoads: formData.majorRoads ? formData.majorRoads.split(',').map(s => s.trim()).filter(Boolean) : [],
        nearbyLandmarks: formData.nearbyLandmarks ? formData.nearbyLandmarks.split(',').map(s => s.trim()).filter(Boolean) : [],
        majorDevelopers: formData.majorDevelopers ? formData.majorDevelopers.split(',').map(s => s.trim()).filter(Boolean) : [],
        majorSocieties: formData.majorSocieties ? formData.majorSocieties.split(',').map(s => s.trim()).filter(Boolean) : [],
        usp: formData.usp ? formData.usp.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        microMarketService.update(id, payload);
        toast.success('Micro Market updated successfully');
        navigate(`/micro-markets/${id}`);
      } else {
        const created = microMarketService.create(payload);
        toast.success('Micro Market created successfully');
        navigate(`/micro-markets/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Error saving micro market');
    }
  };

  return (
    <form className="market-form-layout" onSubmit={handleSubmit}>
      <PageHeader
        title={isEdit ? 'Edit Micro Market' : 'Add New Micro Market'}
        description="Define geographical boundaries, infrastructure connectivity, sector clusters, and investment dynamics"
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
              {isEdit ? 'Save Changes' : 'Create Market'}
            </button>
          </div>
        }
      />

      {/* 1. Identity & Overview */}
      <div className="market-form-card">
        <div className="market-form-header">
          <h3 className="market-form-title">1. Micro Market Identity & Overview</h3>
          <p className="market-form-desc">Corridor naming, territory, and market positioning</p>
        </div>

        <div className="market-form-grid-2">
          <FormField label="Micro Market / Corridor Name" error={errors.name} required>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Golf Course Road or Dwarka Expressway"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="Corridor Classification / Status">
            <SelectField
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={MARKET_STATUSES}
            />
          </FormField>

          <FormField label="City / Metropolitan Region">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Gurugram / Delhi NCR"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </FormField>

          <FormField label="Key Sectors in Corridor (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 54, 55, 56, 57"
              value={formData.keySectors}
              onChange={(e) => setFormData({ ...formData, keySectors: e.target.value })}
            />
          </FormField>

          <FormField label="Market Overview & Infrastructure Description" style={{ gridColumn: 'span 2' }}>
            <textarea
              rows={3}
              className="input-field"
              placeholder="Detailed description of the corridor, infrastructure highlights, and positioning..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 2. Infrastructure & Connectivity */}
      <div className="market-form-card">
        <div className="market-form-header">
          <h3 className="market-form-title">2. Infrastructure & Transit Connectivity</h3>
          <p className="market-form-desc">Highway links, rapid transit networks, and accessibility nodes</p>
        </div>

        <div className="market-form-grid-2">
          <FormField label="Major Expressways & Arterial Roads">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 16-lane Signal Free Expressway, NH-48"
              value={formData.majorRoads}
              onChange={(e) => setFormData({ ...formData, majorRoads: e.target.value })}
            />
          </FormField>

          <FormField label="Metro & Mass Transit Connectivity">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Gurugram Rapid Metro Line, Sikanderpur Interchange"
              value={formData.metroConnectivity}
              onChange={(e) => setFormData({ ...formData, metroConnectivity: e.target.value })}
            />
          </FormField>

          <FormField label="Airport Connectivity / Travel Time">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 20-25 mins to IGI Airport Terminal 3"
              value={formData.airportConnectivity}
              onChange={(e) => setFormData({ ...formData, airportConnectivity: e.target.value })}
            />
          </FormField>

          <FormField label="Key Landmarks & Business Hubs (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. One Horizon Center, Horizon Plaza, Cyber City"
              value={formData.nearbyLandmarks}
              onChange={(e) => setFormData({ ...formData, nearbyLandmarks: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 3. Market Pricing & Developer Presence */}
      <div className="market-form-card">
        <div className="market-form-header">
          <h3 className="market-form-title">3. Pricing Trends, Developers & Benchmark Projects</h3>
          <p className="market-form-desc">Commercial benchmarks and prominent builders in the zone</p>
        </div>

        <div className="market-form-grid-2">
          <FormField label="Prominent Developers (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. DLF, Emaar, M3M, Ireo, Godrej"
              value={formData.majorDevelopers}
              onChange={(e) => setFormData({ ...formData, majorDevelopers: e.target.value })}
            />
          </FormField>

          <FormField label="Benchmark / Key Societies (comma-separated)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. DLF The Camellias, DLF The Crest, Central Park 1"
              value={formData.majorSocieties}
              onChange={(e) => setFormData({ ...formData, majorSocieties: e.target.value })}
            />
          </FormField>

          <FormField label="Average Capital Values (₹ / sq.ft.)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. ₹25,000 - ₹50,000+ / sq.ft."
              value={formData.avgPriceRange}
              onChange={(e) => setFormData({ ...formData, avgPriceRange: e.target.value })}
            />
          </FormField>

          <FormField label="Average Rental Yield (%)">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 3.5% - 4.5%"
              value={formData.rentalYield}
              onChange={(e) => setFormData({ ...formData, rentalYield: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 4. USPs & Strategic Notes */}
      <div className="market-form-card">
        <div className="market-form-header">
          <h3 className="market-form-title">4. Investment USPs & Strategic Research Notes</h3>
          <p className="market-form-desc">Key growth catalysts, client talking points, and market commentary</p>
        </div>

        <div className="market-form-grid-2">
          <FormField label="Investment USPs / Catalysts (comma-separated)" style={{ gridColumn: 'span 2' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ultra-luxury benchmark, High expat demand, Signal-free transit"
              value={formData.usp}
              onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
            />
          </FormField>

          <FormField label="Internal Research Notes & Market Commentary" style={{ gridColumn: 'span 2' }}>
            <textarea
              rows={3}
              className="input-field"
              placeholder="Market trends, upcoming infrastructure projects, commercial office absorption..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
}