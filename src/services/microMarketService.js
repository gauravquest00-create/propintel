import { storageService } from './storageService';

export const microMarketService = {
  getAll() {
    return storageService.getMicroMarkets();
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find(m => m.id === id) || null;
  },

  create(data) {
    const list = this.getAll();
    const newMarket = {
      ...data,
      id: data.id || 'mm_' + Date.now(),
      name: (data.name || '').trim(),
      description: data.description || '',
      location: data.location || '',
      keySectors: Array.isArray(data.keySectors) ? data.keySectors : (data.keySectors || '').split(',').map(s => s.trim()).filter(Boolean),
      majorRoads: Array.isArray(data.majorRoads) ? data.majorRoads : (data.majorRoads || '').split(',').map(s => s.trim()).filter(Boolean),
      metroConnectivity: data.metroConnectivity || '',
      nearbyLandmarks: Array.isArray(data.nearbyLandmarks) ? data.nearbyLandmarks : (data.nearbyLandmarks || '').split(',').map(s => s.trim()).filter(Boolean),
      majorDevelopers: Array.isArray(data.majorDevelopers) ? data.majorDevelopers : (data.majorDevelopers || '').split(',').map(s => s.trim()).filter(Boolean),
      usp: Array.isArray(data.usp) ? data.usp : (data.usp || '').split(',').map(s => s.trim()).filter(Boolean),
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(newMarket);
    storageService.setMicroMarkets(list);
    return newMarket;
  },

  update(id, data) {
    const list = this.getAll();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Micro Market not found');

    const updated = {
      ...list[index],
      ...data,
      keySectors: Array.isArray(data.keySectors) ? data.keySectors : (data.keySectors ? data.keySectors.split(',').map(s => s.trim()).filter(Boolean) : list[index].keySectors),
      majorRoads: Array.isArray(data.majorRoads) ? data.majorRoads : (data.majorRoads ? data.majorRoads.split(',').map(s => s.trim()).filter(Boolean) : list[index].majorRoads),
      nearbyLandmarks: Array.isArray(data.nearbyLandmarks) ? data.nearbyLandmarks : (data.nearbyLandmarks ? data.nearbyLandmarks.split(',').map(s => s.trim()).filter(Boolean) : list[index].nearbyLandmarks),
      majorDevelopers: Array.isArray(data.majorDevelopers) ? data.majorDevelopers : (data.majorDevelopers ? data.majorDevelopers.split(',').map(s => s.trim()).filter(Boolean) : list[index].majorDevelopers),
      usp: Array.isArray(data.usp) ? data.usp : (data.usp ? data.usp.split(',').map(s => s.trim()).filter(Boolean) : list[index].usp),
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    storageService.setMicroMarkets(list);
    return updated;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(m => m.id !== id);
    storageService.setMicroMarkets(filtered);
    return true;
  },

  getStats(id) {
    const societies = storageService.getSocieties().filter(s => s.microMarketId === id);
    const properties = storageService.getProperties().filter(p => p.microMarketId === id);

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
      totalSocieties: societies.length,
      totalProperties: properties.length,
      resaleCount,
      rentCount,
      bhkCounts,
      minPrice,
      maxPrice,
      societies,
      properties
    };
  }
};
