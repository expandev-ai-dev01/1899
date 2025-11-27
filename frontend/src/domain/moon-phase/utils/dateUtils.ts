import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format date to YYYY-MM-DD for API
 */
export const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format date to DD/MM for display
 */
export const formatDateForDisplay = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM', { locale: ptBR });
};

/**
 * Format date to full format DD/MM/YYYY
 */
export const formatDateFull = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Check if date is within allowed range (±50 years)
 */
export const isDateInRange = (date: Date): boolean => {
  const now = new Date();
  const fiftyYearsAgo = new Date(now.getFullYear() - 50, now.getMonth(), now.getDate());
  const fiftyYearsAhead = new Date(now.getFullYear() + 50, now.getMonth(), now.getDate());

  return date >= fiftyYearsAgo && date <= fiftyYearsAhead;
};
