import { format } from 'date-fns';

export function formatCurrency(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

export function formatTime(date) {
  try {
    return format(date instanceof Date ? date : new Date(date), 'pp');
  } catch {
    return '—';
  }
}

export function formatDate(date) {
  try {
    return format(date instanceof Date ? date : new Date(date), 'PP');
  } catch {
    return '—';
  }
}
