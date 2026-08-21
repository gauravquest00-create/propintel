import initialProperties from '../data/properties.json';
import initialLeads from '../data/leads.json';
import initialSocieties from '../data/societies.json';
import initialMicroMarkets from '../data/microMarkets.json';
import initialUsers from '../data/users.json';

const KEYS = {
  PROPERTIES: 'propintel_properties',
  LEADS: 'propintel_leads',
  SOCIETIES: 'propintel_societies',
  MICRO_MARKETS: 'propintel_micro_markets',
  USERS: 'propintel_users',
  AUTH: 'propintel_auth'
};

export const storageService = {
  init() {
    if (!localStorage.getItem(KEYS.PROPERTIES)) {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(initialProperties || []));
    }
    if (!localStorage.getItem(KEYS.LEADS)) {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(initialLeads || []));
    }
    if (!localStorage.getItem(KEYS.SOCIETIES)) {
      localStorage.setItem(KEYS.SOCIETIES, JSON.stringify(initialSocieties || []));
    }
    if (!localStorage.getItem(KEYS.MICRO_MARKETS)) {
      localStorage.setItem(KEYS.MICRO_MARKETS, JSON.stringify(initialMicroMarkets || []));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers || []));
    }
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return [];
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
      return false;
    }
  },

  getProperties() { return this.get(KEYS.PROPERTIES); },
  setProperties(data) { return this.set(KEYS.PROPERTIES, data); },

  getLeads() { return this.get(KEYS.LEADS); },
  setLeads(data) { return this.set(KEYS.LEADS, data); },

  getSocieties() { return this.get(KEYS.SOCIETIES); },
  setSocieties(data) { return this.set(KEYS.SOCIETIES, data); },

  getMicroMarkets() { return this.get(KEYS.MICRO_MARKETS); },
  setMicroMarkets(data) { return this.set(KEYS.MICRO_MARKETS, data); },

  getUsers() { return this.get(KEYS.USERS); },
  setUsers(data) { return this.set(KEYS.USERS, data); },

  exportAll() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      properties: this.getProperties(),
      leads: this.getLeads(),
      societies: this.getSocieties(),
      microMarkets: this.getMicroMarkets()
    };
  },

  importBackup(backupData) {
    if (!backupData || typeof backupData !== 'object') {
      throw new Error('Invalid backup file format');
    }
    if (Array.isArray(backupData.properties)) this.setProperties(backupData.properties);
    if (Array.isArray(backupData.leads)) this.setLeads(backupData.leads);
    if (Array.isArray(backupData.societies)) this.setSocieties(backupData.societies);
    if (Array.isArray(backupData.microMarkets)) this.setMicroMarkets(backupData.microMarkets);
    return true;
  },

  resetAll() {
    this.setProperties([]);
    this.setLeads([]);
    this.setSocieties([]);
    this.setMicroMarkets([]);
    return true;
  }
};

// Auto init on import
storageService.init();
