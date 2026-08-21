import { FRESHNESS_THRESHOLDS } from './constants';

export function calculateDaysAgo(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  const diffTime = Math.abs(now - date);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getFreshnessStatus(dateString) {
  const days = calculateDaysAgo(dateString);
  if (days === null) return { level: 'unknown', label: 'Unknown', days: null };

  if (days <= FRESHNESS_THRESHOLDS.FRESH_MAX_DAYS) {
    return { level: 'fresh', label: 'Fresh', days, color: 'var(--freshness-fresh)', bg: 'var(--freshness-fresh-bg)' };
  } else if (days <= FRESHNESS_THRESHOLDS.AGING_MAX_DAYS) {
    return { level: 'aging', label: 'Aging', days, color: 'var(--freshness-aging)', bg: 'var(--freshness-aging-bg)' };
  } else if (days <= FRESHNESS_THRESHOLDS.STALE_MAX_DAYS) {
    return { level: 'stale', label: 'Stale', days, color: 'var(--freshness-stale)', bg: 'var(--freshness-stale-bg)' };
  } else {
    return { level: 'critical', label: 'Critical / Needs Verification', days, color: 'var(--freshness-critical)', bg: 'var(--freshness-critical-bg)' };
  }
}

export function getFreshnessWarning(item, type = 'property') {
  const targetDate = item.lastVerifiedAt || item.updatedAt || item.createdAt;
  const days = calculateDaysAgo(targetDate);
  if (days === null) return null;

  if (type === 'property') {
    if (days > 60) return `Last verified ${days} days ago — Critical update required.`;
    if (days > 30) return `Last updated ${days} days ago — Verification recommended.`;
  } else if (type === 'lead') {
    if (days > 30) return `No activity for ${days} days — High risk of lead decay.`;
    if (days > 7) return `Not contacted in ${days} days — Follow-up overdue.`;
  }
  return null;
}
