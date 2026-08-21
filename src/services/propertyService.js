import { storageService } from './storageService';
import { calculateDaysAgo } from '../utils/freshness';

export const propertyService = {
  getAll() {
    return storageService.getProperties();
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find(p => p.id === id) || null;
  },

  getBySociety(societyId) {
    if (!societyId) return [];
    return this.getAll().filter(p => p.societyId === societyId);
  },

  getByMicroMarket(microMarketId) {
    if (!microMarketId) return [];
    return this.getAll().filter(p => p.microMarketId === microMarketId);
  },

  create(data) {
    const list = this.getAll();
    const now = new Date().toISOString();

    const newProperty = {
      ...data,
      id: data.id || 'prop_' + Date.now(),
      title: (data.title || '').trim(),
      propertyType: data.propertyType || 'Apartment',
      transactionType: data.transactionType || 'Resale',
      status: data.status || 'Available',
      bhk: data.bhk || '3 BHK',

      // Unit Details
      towerBlock: (data.towerBlock || '').trim(),
      unitNumber: (data.unitNumber || '').trim(),
      floor: data.floor !== undefined && data.floor !== null ? String(data.floor).trim() : '',
      totalFloors: data.totalFloors !== undefined && data.totalFloors !== null ? String(data.totalFloors).trim() : '',
      facing: data.facing || 'North-East',
      furnishing: data.furnishing || 'Semi-Furnished',
      bathrooms: data.bathrooms ? String(data.bathrooms).trim() : '3',
      balcony: data.balcony ? String(data.balcony).trim() : '2',
      ageOfProperty: data.ageOfProperty || '0-2 Years',
      overlooking: data.overlooking || '',

      // Pricing
      price: Number(data.price) || 0,
      pricePerSqFt: Number(data.pricePerSqFt) || 0,
      rent: Number(data.rent) || 0,
      securityDeposit: Number(data.securityDeposit) || 0,
      maintenance: Number(data.maintenance) || 0,
      negotiable: Boolean(data.negotiable),
      brokerage: data.brokerage || '',

      // Area
      carpetArea: Number(data.carpetArea) || 0,
      builtUpArea: Number(data.builtUpArea) || 0,
      superBuiltUpArea: Number(data.superBuiltUpArea) || 0,
      plotArea: Number(data.plotArea) || 0,
      unit: data.unit || 'Sq.Ft.',

      // Location & Relationships
      address: data.address || '',
      locality: data.locality || '',
      sector: data.sector || '',
      city: data.city || 'Gurugram',
      state: data.state || 'Haryana',
      pincode: data.pincode || '',
      microMarketId: data.microMarketId || '',
      societyId: data.societyId || '',

      // Details & Amenities
      description: data.description || '',
      parking: data.parking || '1 Covered',
      powerBackup: data.powerBackup || '100%',
      waterSupply: data.waterSupply || '24 Hours',
      lift: data.lift || 'Available',
      security: data.security || 'Gated 3-Tier Security',
      rera: data.rera || '',
      possessionStatus: data.possessionStatus || 'Ready to Move',
      amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities || '').split(',').map(s => s.trim()).filter(Boolean),
      connectivity: data.connectivity || {},
      usp: Array.isArray(data.usp) ? data.usp : (data.usp || '').split(',').map(s => s.trim()).filter(Boolean),

      // Owner Info
      ownerName: (data.ownerName || '').trim(),
      ownerPhone: (data.ownerPhone || '').trim(),
      alternatePhone: (data.alternatePhone || '').trim(),
      whatsapp: (data.whatsapp || '').trim(),
      ownerEmail: (data.ownerEmail || '').trim(),
      ownerType: data.ownerType || 'Individual',
      source: data.source || 'Direct',
      notes: data.notes || '',

      // Media
      images: Array.isArray(data.images) ? data.images : [],
      floorPlan: data.floorPlan || '',
      brochure: data.brochure || '',

      createdAt: now,
      updatedAt: now,
      lastVerifiedAt: now
    };

    list.unshift(newProperty);
    storageService.setProperties(list);
    return newProperty;
  },

  update(id, data) {
    const list = this.getAll();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');

    const updated = {
      ...list[index],
      ...data,
      towerBlock: data.towerBlock !== undefined ? String(data.towerBlock).trim() : list[index].towerBlock,
      unitNumber: data.unitNumber !== undefined ? String(data.unitNumber).trim() : list[index].unitNumber,
      floor: data.floor !== undefined ? String(data.floor).trim() : list[index].floor,
      totalFloors: data.totalFloors !== undefined ? String(data.totalFloors).trim() : list[index].totalFloors,
      facing: data.facing || list[index].facing,
      furnishing: data.furnishing || list[index].furnishing,
      bathrooms: data.bathrooms !== undefined ? String(data.bathrooms).trim() : list[index].bathrooms,
      balcony: data.balcony !== undefined ? String(data.balcony).trim() : list[index].balcony,
      ageOfProperty: data.ageOfProperty || list[index].ageOfProperty,
      overlooking: data.overlooking || list[index].overlooking,
      amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities ? data.amenities.split(',').map(s => s.trim()).filter(Boolean) : list[index].amenities),
      usp: Array.isArray(data.usp) ? data.usp : (data.usp ? data.usp.split(',').map(s => s.trim()).filter(Boolean) : list[index].usp),
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    storageService.setProperties(list);
    return updated;
  },

  markVerified(id) {
    const list = this.getAll();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');

    const now = new Date().toISOString();
    list[index].lastVerifiedAt = now;
    list[index].updatedAt = now;

    storageService.setProperties(list);
    return list[index];
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(p => p.id !== id);
    storageService.setProperties(filtered);
    return true;
  },

  filterAndSort(properties, { search = '', filters = {}, sort = 'recentlyAdded' }) {
    let result = [...properties];

    // Search query across fields
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => {
        return (
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q)) ||
          (p.towerBlock && p.towerBlock.toLowerCase().includes(q)) ||
          (p.unitNumber && p.unitNumber.toLowerCase().includes(q)) ||
          (p.sector && p.sector.toLowerCase().includes(q)) ||
          (p.locality && p.locality.toLowerCase().includes(q)) ||
          (p.address && p.address.toLowerCase().includes(q)) ||
          (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
          (p.ownerPhone && p.ownerPhone.includes(q)) ||
          (p.bhk && p.bhk.toLowerCase().includes(q)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(q))
        );
      });
    }

    // Filters
    if (filters.bhk && filters.bhk.length) {
      result = result.filter(p => filters.bhk.includes(p.bhk));
    }
    if (filters.microMarketId) {
      result = result.filter(p => p.microMarketId === filters.microMarketId);
    }
    if (filters.societyId) {
      result = result.filter(p => p.societyId === filters.societyId);
    }
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.transactionType) {
      result = result.filter(p => p.transactionType === filters.transactionType);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.minPrice) {
      result = result.filter(p => (Number(p.price) || 0) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => (Number(p.price) || 0) <= Number(filters.maxPrice));
    }
    if (filters.minArea) {
      result = result.filter(p => (Number(p.superBuiltUpArea || p.carpetArea) || 0) >= Number(filters.minArea));
    }
    if (filters.maxArea) {
      result = result.filter(p => (Number(p.superBuiltUpArea || p.carpetArea) || 0) <= Number(filters.maxArea));
    }

    // Special health filters
    if (filters.staleOnly) {
      result = result.filter(p => {
        const days = calculateDaysAgo(p.lastVerifiedAt || p.updatedAt || p.createdAt);
        return days !== null && days >= 30;
      });
    }
    if (filters.missingSociety) {
      result = result.filter(p => !p.societyId);
    }
    if (filters.missingMicroMarket) {
      result = result.filter(p => !p.microMarketId);
    }
    if (filters.missingPrice) {
      result = result.filter(p => !p.price || Number(p.price) === 0);
    }
    if (filters.incompleteOnly) {
      result = result.filter(p => !p.microMarketId || !p.societyId || !p.price || !p.ownerPhone);
    }

    // Sorting
    result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const areaA = Number(a.superBuiltUpArea || a.carpetArea) || 0;
      const areaB = Number(b.superBuiltUpArea || b.carpetArea) || 0;
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      const updateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const updateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      switch (sort) {
        case 'recentlyAdded': return dateB - dateA;
        case 'recentlyUpdated': return updateB - updateA;
        case 'oldest': return dateA - dateB;
        case 'priceLowHigh': return priceA - priceB;
        case 'priceHighLow': return priceB - priceA;
        case 'sizeLowHigh': return areaA - areaB;
        case 'sizeHighLow': return areaB - areaA;
        case 'titleAZ': return (a.title || '').localeCompare(b.title || '');
        case 'titleZA': return (b.title || '').localeCompare(a.title || '');
        default: return dateB - dateA;
      }
    });

    return result;
  }
};