import { storageService } from './storageService';

export const societyService = {
  getAll() {
    return storageService.getSocieties();
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find(s => s.id === id) || null;
  },

  getByMicroMarket(microMarketId) {
    if (!microMarketId) return [];
    return this.getAll().filter(s => s.microMarketId === microMarketId);
  },

  create(data) {
    const list = this.getAll();
    const newSociety = {
      ...data,
      id: data.id || 'soc_' + Date.now(),
      name: (data.name || '').trim(),
      developer: data.developer || '',
      microMarketId: data.microMarketId || '',
      location: data.location || '',
      sector: data.sector || '',
      city: data.city || 'Gurugram',
      address: data.address || '',
      propertyTypes: Array.isArray(data.propertyTypes) ? data.propertyTypes : (data.propertyTypes || '').split(',').map(s => s.trim()).filter(Boolean),
      totalTowers: Number(data.totalTowers) || '',
      totalUnits: Number(data.totalUnits) || '',
      rera: data.rera || '',
      possession: data.possession || '',
      amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities || '').split(',').map(s => s.trim()).filter(Boolean),
      connectivity: data.connectivity || {},
      nearbyLandmarks: Array.isArray(data.nearbyLandmarks) ? data.nearbyLandmarks : (data.nearbyLandmarks || '').split(',').map(s => s.trim()).filter(Boolean),
      description: data.description || '',
      usp: Array.isArray(data.usp) ? data.usp : (data.usp || '').split(',').map(s => s.trim()).filter(Boolean),
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newSociety);
    storageService.setSocieties(list);
    return newSociety;
  },

  update(id, data) {
    const list = this.getAll();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Society not found');

    const updated = {
      ...list[index],
      ...data,
      propertyTypes: Array.isArray(data.propertyTypes) ? data.propertyTypes : (data.propertyTypes ? data.propertyTypes.split(',').map(s => s.trim()).filter(Boolean) : list[index].propertyTypes),
      amenities: Array.isArray(data.amenities) ? data.amenities : (data.amenities ? data.amenities.split(',').map(s => s.trim()).filter(Boolean) : list[index].amenities),
      nearbyLandmarks: Array.isArray(data.nearbyLandmarks) ? data.nearbyLandmarks : (data.nearbyLandmarks ? data.nearbyLandmarks.split(',').map(s => s.trim()).filter(Boolean) : list[index].nearbyLandmarks),
      usp: Array.isArray(data.usp) ? data.usp : (data.usp ? data.usp.split(',').map(s => s.trim()).filter(Boolean) : list[index].usp),
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    storageService.setSocieties(list);
    return updated;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(s => s.id !== id);
    storageService.setSocieties(filtered);
    return true;
  },

  getStats(id) {
    const properties = storageService.getProperties().filter(p => p.societyId === id);
    const resaleCount = properties.filter(p => p.transactionType === 'Resale').length;
    const rentCount = properties.filter(p => p.transactionType === 'Rent').length;

    const bhkCounts = properties.reduce((acc, p) => {
      const bhk = p.bhk || 'Other';
      acc[bhk] = (acc[bhk] || 0) + 1;
      return acc;
    }, {});

    const prices = properties.map(p => Number(p.price) || 0).filter(p => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      totalProperties: properties.length,
      resaleCount,
      rentCount,
      bhkCounts,
      minPrice,
      maxPrice,
      properties
    };
  }
};
