import { storageService } from './storageService';
import { calculateDaysAgo } from '../utils/freshness';

export const healthEngineService = {
  getSystemHealth() {
    const properties = storageService.getProperties();
    const leads = storageService.getLeads();
    const societies = storageService.getSocieties();
    const microMarkets = storageService.getMicroMarkets();

    const attentionItems = [];

    // 1. Properties not verified for 30+ days
    const staleProps30 = properties.filter(p => {
      const days = calculateDaysAgo(p.lastVerifiedAt || p.updatedAt || p.createdAt);
      return days !== null && days >= 30 && days < 60;
    });
    if (staleProps30.length > 0) {
      attentionItems.push({
        id: 'stale_props_30',
        severity: 'warning',
        category: 'Properties',
        count: staleProps30.length,
        title: `${staleProps30.length} properties need routine verification (30+ days)`,
        description: 'Information may be getting outdated. Confirm pricing and availability.',
        link: '/properties?stale=true'
      });
    }

    // 2. Properties not verified for 60+ days (Critical)
    const criticalProps60 = properties.filter(p => {
      const days = calculateDaysAgo(p.lastVerifiedAt || p.updatedAt || p.createdAt);
      return days !== null && days >= 60;
    });
    if (criticalProps60.length > 0) {
      attentionItems.push({
        id: 'critical_props_60',
        severity: 'danger',
        category: 'Properties',
        count: criticalProps60.length,
        title: `${criticalProps60.length} properties in critical stale status (60+ days)`,
        description: 'High risk of outdated information or sold inventory.',
        link: '/properties?stale=true'
      });
    }

    // 3. Properties missing price or critical details
    const incompleteProps = properties.filter(p => !p.price || !p.microMarketId || !p.ownerPhone);
    if (incompleteProps.length > 0) {
      attentionItems.push({
        id: 'incomplete_props',
        severity: 'info',
        category: 'Properties',
        count: incompleteProps.length,
        title: `${incompleteProps.length} properties have incomplete records`,
        description: 'Missing pricing, micro-market linkage, or owner contact number.',
        link: '/properties?incomplete=true'
      });
    }

    // 4. Properties without linked society
    const noSocietyProps = properties.filter(p => !p.societyId && p.propertyType === 'Apartment');
    if (noSocietyProps.length > 0) {
      attentionItems.push({
        id: 'no_society_props',
        severity: 'info',
        category: 'Properties',
        count: noSocietyProps.length,
        title: `${noSocietyProps.length} apartments without linked society`,
        description: 'Link them to societies to maintain relationship hierarchy.',
        link: '/properties?missingSociety=true'
      });
    }

    // 5. Leads not updated for 7+ days
    const staleLeads7 = leads.filter(l => {
      const days = calculateDaysAgo(l.lastUpdated || l.updatedAt);
      return days !== null && days >= 7 && l.status !== 'Closed / Won' && l.status !== 'Lost';
    });
    if (staleLeads7.length > 0) {
      attentionItems.push({
        id: 'stale_leads_7',
        severity: 'warning',
        category: 'Leads',
        count: staleLeads7.length,
        title: `${staleLeads7.length} active leads have no recent updates (7+ days)`,
        description: 'Follow up with leads before they become cold.',
        link: '/leads?stale=true'
      });
    }

    // 6. Leads with overdue follow-ups
    const now = new Date();
    const overdueLeads = leads.filter(l => {
      return l.nextFollowUp && new Date(l.nextFollowUp) < now && l.status !== 'Closed / Won' && l.status !== 'Lost';
    });
    if (overdueLeads.length > 0) {
      attentionItems.push({
        id: 'overdue_leads',
        severity: 'danger',
        category: 'Leads',
        count: overdueLeads.length,
        title: `${overdueLeads.length} leads have overdue follow-up dates`,
        description: 'Scheduled follow-up date has passed.',
        link: '/leads?overdue=true'
      });
    }

    // 7. Societies without linked micro-market
    const unlinkedSocieties = societies.filter(s => !s.microMarketId);
    if (unlinkedSocieties.length > 0) {
      attentionItems.push({
        id: 'unlinked_societies',
        severity: 'info',
        category: 'Societies',
        count: unlinkedSocieties.length,
        title: `${unlinkedSocieties.length} societies missing micro-market assignment`,
        description: 'Categorize societies into their respective geographic zones.',
        link: '/societies'
      });
    }

    return {
      totalIssues: attentionItems.reduce((acc, item) => acc + item.count, 0),
      items: attentionItems,
      metrics: {
        totalProperties: properties.length,
        stalePropertiesCount: staleProps30.length + criticalProps60.length,
        totalLeads: leads.length,
        overdueLeadsCount: overdueLeads.length,
        totalSocieties: societies.length,
        totalMicroMarkets: microMarkets.length
      }
    };
  }
};
