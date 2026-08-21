import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { FormField } from '../../components/common/FormField';
import { SelectField } from '../../components/common/SelectField';
import { useToast } from '../../hooks/useToast';
import { propertyService } from '../../services/propertyService';
import { societyService } from '../../services/societyService';
import { microMarketService } from '../../services/microMarketService';
import { 
  BHK_OPTIONS, 
  PROPERTY_TYPES, 
  TRANSACTION_TYPES, 
  PROPERTY_STATUSES,
  FURNISHING_OPTIONS,
  FACING_OPTIONS,
  POSSESSION_STATUSES,
  AREA_UNITS,
  DEFAULT_AMENITIES
} from '../../utils/constants';
import './PropertyFormPage.css';

export function PropertyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [societies, setSocieties] = useState([]);
  const [microMarkets, setMicroMarkets] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Apartment',
    transactionType: 'Resale',
    status: 'Available',
    bhk: '3 BHK',

    // Unit Details
    towerBlock: '',
    unitNumber: '',
    floor: '',
    totalFloors: '',
    facing: 'North-East',
    furnishing: 'Semi-Furnished',
    bathrooms: '3',
    balcony: '2',
    ageOfProperty: '0-2 Years',
    overlooking: 'Park / Green View',

    // Pricing
    price: '',
    pricePerSqFt: '',
    rent: '',
    securityDeposit: '',
    maintenance: '',
    negotiable: false,
    brokerage: '',

    // Area
    carpetArea: '',
    superBuiltUpArea: '',
    plotArea: '',
    unit: 'Sq.Ft.',

    // Location & Relationships
    address: '',
    locality: '',
    sector: '',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '',
    microMarketId: '',
    societyId: '',

    // Details & Amenities
    description: '',
    parking: '1 Covered',
    powerBackup: '100%',
    waterSupply: '24 Hours',
    lift: '2 High-Speed',
    security: 'Gated 3-tier Security',
    rera: '',
    possessionStatus: 'Ready to Move',
    amenities: [],
    usp: '',

    // Owner Info
    ownerName: '',
    ownerPhone: '',
    alternatePhone: '',
    whatsapp: '',
    ownerEmail: '',
    ownerType: 'Individual',
    source: 'Direct',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const socs = societyService.getAll();
    const mms = microMarketService.getAll();
    setSocieties(socs);
    setMicroMarkets(mms);

    if (isEdit) {
      const existing = propertyService.getById(id);
      if (existing) {
        setFormData({
          ...existing,
          amenities: existing.amenities || [],
          usp: Array.isArray(existing.usp) ? existing.usp.join(', ') : (existing.usp || '')
        });
      } else {
        toast.error('Property not found');
        navigate('/properties');
      }
    }
  }, [id, isEdit]);

  // When society is selected, auto-select its micro-market and sector
  const handleSocietyChange = (socId) => {
    const selectedSoc = societies.find(s => s.id === socId);
    setFormData(prev => ({
      ...prev,
      societyId: socId,
      microMarketId: selectedSoc && selectedSoc.microMarketId ? selectedSoc.microMarketId : prev.microMarketId,
      sector: selectedSoc && selectedSoc.sector ? selectedSoc.sector : prev.sector
    }));
  };

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
    if (!formData.title.trim()) errs.title = 'Property title is required';
    if (!formData.price && formData.transactionType !== 'Rent') errs.price = 'Price is required';
    if (!formData.rent && formData.transactionType === 'Rent') errs.rent = 'Rent amount is required';
    if (!formData.ownerPhone) errs.ownerPhone = 'Owner contact number is required';
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
        usp: formData.usp ? formData.usp.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (isEdit) {
        propertyService.update(id, payload);
        toast.success('Property updated successfully');
        navigate(`/properties/${id}`);
      } else {
        const created = propertyService.create(payload);
        toast.success('Property created successfully');
        navigate(`/properties/${created.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Error saving property');
    }
  };

  return (
    <form className="prop-form-layout" onSubmit={handleSubmit}>
      <PageHeader
        title={isEdit ? 'Edit Property Record' : 'Add New Property to Inventory'}
        description="Comprehensive property specifications, unit details, location hierarchy, and ownership information"
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
              {isEdit ? 'Save Changes' : 'Create Property'}
            </button>
          </div>
        }
      />

      {/* 1. Basic Info */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">1. Basic Information</h3>
          <p className="form-section-desc">Primary classification and configuration</p>
        </div>
        <div className="form-grid-2">
          <FormField label="Property Title / Headline" error={errors.title} required style={{ gridColumn: 'span 2' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Luxury 3BHK Park Facing Apartment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormField>

          <FormField label="Property Type" required>
            <SelectField
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              options={PROPERTY_TYPES}
            />
          </FormField>

          <FormField label="Transaction Type" required>
            <SelectField
              value={formData.transactionType}
              onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
              options={TRANSACTION_TYPES}
            />
          </FormField>

          <FormField label="BHK Configuration" required>
            <SelectField
              value={formData.bhk}
              onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
              options={BHK_OPTIONS}
            />
          </FormField>

          <FormField label="Inventory Status" required>
            <SelectField
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={PROPERTY_STATUSES}
            />
          </FormField>
        </div>
      </div>

      {/* 2. Relationships & Location */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">2. Location & Relationship Mapping</h3>
          <p className="form-section-desc">Connect property to Society and Micro-Market</p>
        </div>
        <div className="form-grid-2">
          <FormField label="Society / Project">
            <SelectField
              placeholder="Select Linked Society"
              value={formData.societyId}
              onChange={(e) => handleSocietyChange(e.target.value)}
              options={societies.map(s => ({ value: s.id, label: s.name }))}
            />
          </FormField>

          <FormField label="Micro Market">
            <SelectField
              placeholder="Select Micro Market"
              value={formData.microMarketId}
              onChange={(e) => setFormData({ ...formData, microMarketId: e.target.value })}
              options={microMarkets.map(m => ({ value: m.id, label: m.name }))}
            />
          </FormField>

          <FormField label="Sector">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 57 or 83"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </FormField>

          <FormField label="Locality / Landmark">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Near Huda Metro Station"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 3. Unit Details & Floor Specs (NEW SECTION) */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">3. Unit Details & Floor Specs</h3>
          <p className="form-section-desc">Exact unit identification, floor numbers, orientation, and furnishing</p>
        </div>
        <div className="form-grid-3">
          <FormField label="Unit Block / Tower">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Tower A / Block 2"
              value={formData.towerBlock}
              onChange={(e) => setFormData({ ...formData, towerBlock: e.target.value })}
            />
          </FormField>

          <FormField label="Unit / Flat Number">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 502 / 1204"
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
            />
          </FormField>

          <FormField label="Unit Floor">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 5 or 12"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </FormField>

          <FormField label="Total Floors in Tower">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 18 or 24"
              value={formData.totalFloors}
              onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
            />
          </FormField>

          <FormField label="Unit Facing / Direction">
            <SelectField
              value={formData.facing}
              onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
              options={FACING_OPTIONS}
            />
          </FormField>

          <FormField label="Unit Furnishing">
            <SelectField
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              options={FURNISHING_OPTIONS}
            />
          </FormField>

          <FormField label="Bathrooms">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 3"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />
          </FormField>

          <FormField label="Balconies">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 2"
              value={formData.balcony}
              onChange={(e) => setFormData({ ...formData, balcony: e.target.value })}
            />
          </FormField>

          <FormField label="Age of Property / Construction">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 0-2 Years / Brand New"
              value={formData.ageOfProperty}
              onChange={(e) => setFormData({ ...formData, ageOfProperty: e.target.value })}
            />
          </FormField>

          <FormField label="View / Overlooking" style={{ gridColumn: 'span 3' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Central Park & Pool Facing, Road View"
              value={formData.overlooking}
              onChange={(e) => setFormData({ ...formData, overlooking: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 4. Pricing & Area */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">4. Pricing & Dimensions</h3>
          <p className="form-section-desc">Commercial figures and area calculations</p>
        </div>
        <div className="form-grid-3">
          {formData.transactionType === 'Rent' ? (
            <FormField label="Monthly Rent (₹)" error={errors.rent} required>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 45000"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </FormField>
          ) : (
            <FormField label="Total Price (₹)" error={errors.price} required>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 25000000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </FormField>
          )}

          <FormField label="Super Built-Up Area">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 1850"
              value={formData.superBuiltUpArea}
              onChange={(e) => setFormData({ ...formData, superBuiltUpArea: e.target.value })}
            />
          </FormField>

          <FormField label="Carpet Area">
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 1420"
              value={formData.carpetArea}
              onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* 5. Amenities */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">5. Society & Unit Amenities</h3>
          <p className="form-section-desc">Select available lifestyle and security features</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
      </div>

      {/* 6. Owner Information */}
      <div className="form-section-card">
        <div className="form-section-header">
          <h3 className="form-section-title">6. Owner & Contact Information</h3>
          <p className="form-section-desc">Direct contact person and lead source</p>
        </div>
        <div className="form-grid-2">
          <FormField label="Owner / Seller Name">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Rajesh Gupta"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            />
          </FormField>

          <FormField label="Owner Phone Number" error={errors.ownerPhone} required>
            <input
              type="tel"
              className="input-field"
              placeholder="e.g. 9811122233"
              value={formData.ownerPhone}
              onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
            />
          </FormField>

          <FormField label="Alternate / WhatsApp Phone">
            <input
              type="tel"
              className="input-field"
              placeholder="e.g. 9811122244"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            />
          </FormField>

          <FormField label="Internal Notes / Deal Remarks">
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Owner ready for negotiation, keys with guard"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
}