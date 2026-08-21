export function checkPropertyDuplicate(newProp, existingProperties = []) {
  const normTitle = (newProp.title || '').trim().toLowerCase();
  const normPhone = (newProp.ownerPhone || '').replace(/\D/g, '');
  const normId = (newProp.id || '').trim().toLowerCase();
  const normSocietyId = newProp.societyId;
  const normArea = Number(newProp.superBuiltUpArea || newProp.carpetArea || 0);

  return existingProperties.find(p => {
    if (normId && p.id && p.id.toLowerCase() === normId) return true;
    if (normPhone && p.ownerPhone && p.ownerPhone.replace(/\D/g, '') === normPhone && normTitle && p.title && p.title.toLowerCase() === normTitle) return true;
    if (normSocietyId && p.societyId === normSocietyId && normTitle && p.title && p.title.toLowerCase() === normTitle && normArea > 0 && Math.abs((p.superBuiltUpArea || p.carpetArea || 0) - normArea) < 10) return true;
    return false;
  });
}

export function checkLeadDuplicate(newLead, existingLeads = []) {
  const normPhone = (newLead.phone || '').replace(/\D/g, '');
  const normEmail = (newLead.email || '').trim().toLowerCase();
  const normId = (newLead.id || '').trim().toLowerCase();

  return existingLeads.find(l => {
    if (normId && l.id && l.id.toLowerCase() === normId) return true;
    if (normPhone && l.phone && l.phone.replace(/\D/g, '') === normPhone) return true;
    if (normEmail && l.email && l.email.toLowerCase() === normEmail) return true;
    return false;
  });
}

export function checkSocietyDuplicate(newSoc, existingSocieties = []) {
  const normName = (newSoc.name || '').trim().toLowerCase();
  const normSector = (newSoc.sector || '').trim().toLowerCase();
  return existingSocieties.find(s => {
    return (s.name || '').trim().toLowerCase() === normName && (s.sector || '').trim().toLowerCase() === normSector;
  });
}

export function checkMicroMarketDuplicate(newMm, existingMicroMarkets = []) {
  const normName = (newMm.name || '').trim().toLowerCase();
  return existingMicroMarkets.find(m => (m.name || '').trim().toLowerCase() === normName);
}
