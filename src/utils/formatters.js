export function formatCurrency(amount, transactionType = 'Resale') {
  if (!amount && amount !== 0) return 'Price on Request';
  const num = Number(amount);
  if (isNaN(num)) return 'Price on Request';

  if (transactionType === 'Rent' || transactionType === 'Commercial Lease') {
    return `₹ ${num.toLocaleString('en-IN')}/mo`;
  }

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹ ${cr} Cr`;
  } else if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹ ${lakh} L`;
  } else if (num >= 1000) {
    const k = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `₹ ${k} K`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatArea(area, unit = 'Sq.Ft.') {
  if (!area) return '—';
  return `${Number(area).toLocaleString('en-IN')} ${unit}`;
}

export function formatPhone(phone) {
  if (!phone) return '—';
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone;
}
