import { storageService } from './storageService';
import * as XLSX from 'xlsx';

export const exportService = {
  exportJSON(type = 'all') {
    let data;
    let filename = `propintel_${type}_${new Date().toISOString().slice(0, 10)}.json`;

    if (type === 'properties') data = storageService.getProperties();
    else if (type === 'leads') data = storageService.getLeads();
    else if (type === 'societies') data = storageService.getSocieties();
    else if (type === 'microMarkets') data = storageService.getMicroMarkets();
    else {
      data = storageService.exportAll();
      filename = `propintel_backup_full_${new Date().toISOString().slice(0, 10)}.json`;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportCSV(type = 'properties') {
    let data = [];
    let filename = `propintel_${type}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'properties') {
      const societies = storageService.getSocieties();
      const markets = storageService.getMicroMarkets();
      data = storageService.getProperties().map(p => {
        const soc = societies.find(s => s.id === p.societyId);
        const mm = markets.find(m => m.id === p.microMarketId);
        return {
          'Property ID': p.id,
          'Title': p.title,
          'Type': p.propertyType,
          'Transaction': p.transactionType,
          'Status': p.status,
          'BHK': p.bhk,
          'Price': p.price,
          'Super Built-Up Area': p.superBuiltUpArea,
          'Carpet Area': p.carpetArea,
          'Unit': p.unit,
          'Sector': p.sector,
          'Society': soc ? soc.name : '',
          'Micro Market': mm ? mm.name : '',
          'Owner Name': p.ownerName,
          'Owner Phone': p.ownerPhone,
          'Last Verified': p.lastVerifiedAt || p.updatedAt
        };
      });
    } else if (type === 'leads') {
      data = storageService.getLeads().map(l => ({
        'Lead ID': l.id,
        'Name': l.name,
        'Phone': l.phone,
        'Email': l.email,
        'Status': l.status,
        'Requirement': l.requirementType,
        'Property Type': l.propertyType,
        'BHK': l.bhk,
        'Min Budget': l.minBudget,
        'Max Budget': l.maxBudget,
        'Preferred Location': l.preferredLocation,
        'Next Follow Up': l.nextFollowUp,
        'Source': l.source
      }));
    } else if (type === 'societies') {
      const markets = storageService.getMicroMarkets();
      data = storageService.getSocieties().map(s => {
        const mm = markets.find(m => m.id === s.microMarketId);
        return {
          'Society ID': s.id,
          'Name': s.name,
          'Developer': s.developer,
          'Sector': s.sector,
          'Micro Market': mm ? mm.name : '',
          'Total Towers': s.totalTowers,
          'Total Units': s.totalUnits,
          'Possession': s.possession
        };
      });
    }

    if (!data.length) return false;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }
};
