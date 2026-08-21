import { storageService } from './storageService';
import { calculateDaysAgo } from '../utils/freshness';

export const leadService = {
  getAll() {
    return storageService.getLeads();
  },

  getById(id) {
    if (!id) return null;
    const list = this.getAll();
    return list.find(l => l.id === id) || null;
  },

  create(data) {
    const list = this.getAll();
    const now = new Date().toISOString();

    const newLead = {
      ...data,
      id: data.id || 'lead_' + Date.now(),
      name: (data.name || '').trim(),
      phone: (data.phone || '').trim(),
      alternatePhone: (data.alternatePhone || '').trim(),
      whatsapp: (data.whatsapp || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      source: data.source || 'Direct Call',
      status: data.status || 'New',

      // Requirement
      requirementType: data.requirementType || 'Buying',
      preferredMicroMarketId: data.preferredMicroMarketId || '',
      preferredLocation: data.preferredLocation || '',
      preferredSocietyId: data.preferredSocietyId || '',
      propertyType: data.propertyType || 'Apartment',
      bhk: data.bhk || '3 BHK',
      minBudget: Number(data.minBudget) || 0,
      maxBudget: Number(data.maxBudget) || 0,
      preferredSize: data.preferredSize || '',
      furnishing: data.furnishing || '',
      preferredFloor: data.preferredFloor || '',
      possessionRequirement: data.possessionRequirement || '',

      // Context
      requirementDescription: data.requirementDescription || '',
      notes: data.notes || '',
      mustHave: Array.isArray(data.mustHave) ? data.mustHave : (data.mustHave || '').split(',').map(s => s.trim()).filter(Boolean),
      dealBreakers: Array.isArray(data.dealBreakers) ? data.dealBreakers : (data.dealBreakers || '').split(',').map(s => s.trim()).filter(Boolean),

      // Activity & Timeline
      lastContacted: now,
      lastUpdated: now,
      nextFollowUp: data.nextFollowUp || '',
      followUpNote: data.followUpNote || '',
      contactStatus: data.contactStatus || 'Contacted',
      activities: [
        {
          id: 'act_' + Date.now(),
          type: 'Created',
          title: 'Lead Created',
          note: 'Initial lead profile recorded.',
          timestamp: now
        }
      ],

      createdAt: now,
      updatedAt: now
    };

    list.unshift(newLead);
    storageService.setLeads(list);
    return newLead;
  },

  update(id, data) {
    const list = this.getAll();
    const index = list.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');

    const now = new Date().toISOString();
    const prev = list[index];

    // Activity note if status changed
    const activities = [...(prev.activities || [])];
    if (data.status && data.status !== prev.status) {
      activities.unshift({
        id: 'act_' + Date.now(),
        type: 'Status Change',
        title: `Status changed to ${data.status}`,
        note: `Updated from ${prev.status}`,
        timestamp: now
      });
    }

    const updated = {
      ...prev,
      ...data,
      mustHave: Array.isArray(data.mustHave) ? data.mustHave : (data.mustHave ? data.mustHave.split(',').map(s => s.trim()).filter(Boolean) : prev.mustHave),
      dealBreakers: Array.isArray(data.dealBreakers) ? data.dealBreakers : (data.dealBreakers ? data.dealBreakers.split(',').map(s => s.trim()).filter(Boolean) : prev.dealBreakers),
      activities,
      updatedAt: now,
      lastUpdated: now
    };

    list[index] = updated;
    storageService.setLeads(list);
    return updated;
  },

  addActivity(id, { type, title, note }) {
    const list = this.getAll();
    const index = list.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');

    const now = new Date().toISOString();
    const activities = list[index].activities || [];
    activities.unshift({
      id: 'act_' + Date.now(),
      type: type || 'Note',
      title: title || 'Interaction Logged',
      note: note || '',
      timestamp: now
    });

    list[index].activities = activities;
    list[index].lastContacted = now;
    list[index].updatedAt = now;

    storageService.setLeads(list);
    return list[index];
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(l => l.id !== id);
    storageService.setLeads(filtered);
    return true;
  },

  filterAndSort(leads, { search = '', filters = {}, sort = 'recentlyAdded' }) {
    let result = [...leads];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(l => {
        return (
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.id && l.id.toLowerCase().includes(q)) ||
          (l.phone && l.phone.includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.preferredLocation && l.preferredLocation.toLowerCase().includes(q)) ||
          (l.bhk && l.bhk.toLowerCase().includes(q))
        );
      });
    }

    if (filters.status) {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters.requirementType) {
      result = result.filter(l => l.requirementType === filters.requirementType);
    }
    if (filters.microMarketId) {
      result = result.filter(l => l.preferredMicroMarketId === filters.microMarketId);
    }
    if (filters.propertyType) {
      result = result.filter(l => l.propertyType === filters.propertyType);
    }
    if (filters.bhk) {
      result = result.filter(l => l.bhk === filters.bhk);
    }
    if (filters.source) {
      result = result.filter(l => l.source === filters.source);
    }
    if (filters.overdueOnly) {
      result = result.filter(l => {
        if (!l.nextFollowUp) return false;
        return new Date(l.nextFollowUp) < new Date();
      });
    }
    if (filters.staleOnly) {
      result = result.filter(l => {
        const days = calculateDaysAgo(l.lastUpdated || l.updatedAt);
        return days !== null && days >= 7;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      const updateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const updateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      const followA = a.nextFollowUp ? new Date(a.nextFollowUp).getTime() : Infinity;
      const followB = b.nextFollowUp ? new Date(b.nextFollowUp).getTime() : Infinity;

      switch (sort) {
        case 'recentlyAdded': return dateB - dateA;
        case 'recentlyUpdated': return updateB - updateA;
        case 'followUpAsc': return followA - followB;
        case 'nameAZ': return (a.name || '').localeCompare(b.name || '');
        default: return dateB - dateA;
      }
    });

    return result;
  }
};
