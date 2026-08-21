import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { propertyService } from './propertyService';
import { leadService } from './leadService';
import { societyService } from './societyService';
import { microMarketService } from './microMarketService';
import { checkPropertyDuplicate, checkLeadDuplicate, checkSocietyDuplicate } from '../utils/duplicateDetector';

export const PROPERTY_SCHEMA_FIELDS = [
  { key: 'title', label: 'Property Title', required: true, synonyms: ['title', 'property name', 'property title', 'name', 'project'] },
  { key: 'propertyType', label: 'Property Type', required: false, synonyms: ['type', 'property type', 'category'] },
  { key: 'transactionType', label: 'Transaction Type', required: false, synonyms: ['transaction', 'transaction type', 'intent', 'for'] },
  { key: 'bhk', label: 'BHK / Config', required: false, synonyms: ['bhk', 'configuration', 'bedrooms', 'bed'] },
  { key: 'price', label: 'Price', required: false, synonyms: ['price', 'total price', 'cost', 'amount', 'rate', 'rent'] },
  { key: 'superBuiltUpArea', label: 'Super Built-Up Area', required: false, synonyms: ['area', 'super area', 'built up area', 'size', 'sqft', 'sq ft'] },
  { key: 'sector', label: 'Sector / Locality', required: false, synonyms: ['sector', 'locality', 'location', 'address'] },
  { key: 'societyName', label: 'Society / Project Name', required: false, synonyms: ['society', 'project', 'society name', 'building'] },
  { key: 'microMarketName', label: 'Micro Market', required: false, synonyms: ['micro market', 'zone', 'micromarket', 'region'] },
  { key: 'ownerName', label: 'Owner Name', required: false, synonyms: ['owner', 'owner name', 'contact person', 'seller'] },
  { key: 'ownerPhone', label: 'Owner Phone', required: false, synonyms: ['phone', 'mobile', 'owner phone', 'contact', 'cell'] }
];

export const LEAD_SCHEMA_FIELDS = [
  { key: 'name', label: 'Lead Name', required: true, synonyms: ['name', 'lead name', 'client', 'buyer', 'contact name'] },
  { key: 'phone', label: 'Phone Number', required: true, synonyms: ['phone', 'mobile', 'contact', 'cell', 'number'] },
  { key: 'email', label: 'Email', required: false, synonyms: ['email', 'mail', 'email address'] },
  { key: 'requirementType', label: 'Requirement (Buy/Rent)', required: false, synonyms: ['requirement', 'intent', 'type', 'buying/renting', 'purpose'] },
  { key: 'bhk', label: 'BHK Preference', required: false, synonyms: ['bhk', 'configuration', 'bedrooms'] },
  { key: 'maxBudget', label: 'Max Budget', required: false, synonyms: ['budget', 'max budget', 'price range', 'budget max'] },
  { key: 'preferredLocation', label: 'Preferred Location / Sector', required: false, synonyms: ['location', 'sector', 'preferred location', 'preferred sector'] },
  { key: 'status', label: 'Lead Status', required: false, synonyms: ['status', 'lead status', 'stage'] },
  { key: 'source', label: 'Lead Source', required: false, synonyms: ['source', 'channel', 'lead source'] },
  { key: 'notes', label: 'Notes / Remarks', required: false, synonyms: ['notes', 'remarks', 'comment', 'description'] }
];

export const importService = {
  async parseFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv' || ext === 'txt') {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve({
              headers: results.meta.fields || [],
              rows: results.data
            });
          },
          error: (err) => reject(err)
        });
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
      return { headers, rows };
    }
    throw new Error('Unsupported file format. Please upload CSV or Excel (.xlsx, .xls) files.');
  },

  async parseGoogleSheetCSV(csvText) {
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve({
            headers: results.meta.fields || [],
            rows: results.data
          });
        },
        error: (err) => reject(err)
      });
    });
  },

  detectMapping(headers, targetType = 'properties') {
    const schema = targetType === 'properties' ? PROPERTY_SCHEMA_FIELDS : LEAD_SCHEMA_FIELDS;
    const mapping = {};

    schema.forEach(field => {
      const matchedHeader = headers.find(h => {
        const norm = h.trim().toLowerCase();
        return field.synonyms.some(syn => norm === syn || norm.includes(syn));
      });
      mapping[field.key] = matchedHeader || '';
    });

    return mapping;
  },

  validateAndPrepare(rows, mapping, targetType = 'properties') {
    const schema = targetType === 'properties' ? PROPERTY_SCHEMA_FIELDS : LEAD_SCHEMA_FIELDS;
    const requiredKeys = schema.filter(f => f.required).map(f => f.key);

    const existingProperties = propertyService.getAll();
    const existingLeads = leadService.getAll();
    const existingSocieties = societyService.getAll();
    const existingMarkets = microMarketService.getAll();

    const prepared = [];
    let validCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    rows.forEach((row, index) => {
      const mappedRecord = {};
      Object.keys(mapping).forEach(fieldKey => {
        const header = mapping[fieldKey];
        mappedRecord[fieldKey] = header && row[header] !== undefined ? String(row[header]).trim() : '';
      });

      // Check required
      const missingRequired = requiredKeys.filter(k => !mappedRecord[k]);
      let isDuplicate = false;
      let duplicateReason = null;

      if (missingRequired.length === 0) {
        if (targetType === 'properties') {
          const dup = checkPropertyDuplicate(mappedRecord, existingProperties);
          if (dup) {
            isDuplicate = true;
            duplicateReason = `Matches existing property: ${dup.title}`;
          }
        } else if (targetType === 'leads') {
          const dup = checkLeadDuplicate(mappedRecord, existingLeads);
          if (dup) {
            isDuplicate = true;
            duplicateReason = `Matches phone/email: ${dup.name}`;
          }
        }
      }

      const status = missingRequired.length > 0 ? 'error' : isDuplicate ? 'duplicate' : 'valid';
      if (status === 'valid') validCount++;
      if (status === 'error') errorCount++;
      if (status === 'duplicate') duplicateCount++;

      prepared.push({
        rowIndex: index + 1,
        raw: row,
        mapped: mappedRecord,
        status,
        errorMessage: missingRequired.length ? `Missing: ${missingRequired.join(', ')}` : null,
        duplicateReason,
        includeInImport: status === 'valid'
      });
    });

    return {
      items: prepared,
      summary: {
        total: rows.length,
        valid: validCount,
        error: errorCount,
        duplicate: duplicateCount
      }
    };
  },

  executeImport(preparedItems, targetType = 'properties') {
    const societies = societyService.getAll();
    const markets = microMarketService.getAll();

    let importedCount = 0;
    let skippedCount = 0;

    preparedItems.forEach(item => {
      if (!item.includeInImport || item.status === 'error') {
        skippedCount++;
        return;
      }

      const data = item.mapped;

      if (targetType === 'properties') {
        // Resolve or create micro market & society if specified by name
        let microMarketId = '';
        let societyId = '';

        if (data.microMarketName) {
          const mm = markets.find(m => m.name.toLowerCase() === data.microMarketName.toLowerCase());
          if (mm) {
            microMarketId = mm.id;
          } else {
            const newMm = microMarketService.create({ name: data.microMarketName });
            markets.push(newMm);
            microMarketId = newMm.id;
          }
        }

        if (data.societyName) {
          const soc = societies.find(s => s.name.toLowerCase() === data.societyName.toLowerCase());
          if (soc) {
            societyId = soc.id;
            if (!microMarketId && soc.microMarketId) microMarketId = soc.microMarketId;
          } else {
            const newSoc = societyService.create({
              name: data.societyName,
              sector: data.sector || '',
              microMarketId: microMarketId || ''
            });
            societies.push(newSoc);
            societyId = newSoc.id;
          }
        }

        propertyService.create({
          ...data,
          societyId,
          microMarketId,
          price: Number(data.price) || 0,
          superBuiltUpArea: Number(data.superBuiltUpArea) || 0
        });
        importedCount++;
      } else if (targetType === 'leads') {
        let microMarketId = '';
        if (data.microMarketName) {
          const mm = markets.find(m => m.name.toLowerCase() === data.microMarketName.toLowerCase());
          if (mm) microMarketId = mm.id;
        }

        leadService.create({
          ...data,
          preferredMicroMarketId: microMarketId,
          maxBudget: Number(data.maxBudget) || 0
        });
        importedCount++;
      }
    });

    return { importedCount, skippedCount };
  }
};
