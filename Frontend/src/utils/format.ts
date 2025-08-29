import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale('es');

export const formatMoneyAR = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumberAR = (number: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number);
};

export const formatDateAR = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateTimeAR = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'minutes');
  
  if (diff < 1) return 'hace un momento';
  if (diff < 60) return `hace ${diff} min`;
  
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `hace ${hours}h`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  
  return formatDateAR(date);
};

export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const parsed = dayjs(dateStr, ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'], 'es', true);
  return parsed.isValid() ? parsed.toDate() : null;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPhoneAR = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{1})(\d{2})(\d{4})(\d{4})/, '$1$2 $3-$4');
  }
  
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCUIT = (cuit: string): boolean => {
  const cleanCuit = cuit.replace(/\D/g, '');
  if (cleanCuit.length !== 11) return false;
  
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cleanCuit[i]) * multiplicadores[i];
  }
  
  const resto = suma % 11;
  const digitoVerificador = resto < 2 ? resto : 11 - resto;
  
  return digitoVerificador === parseInt(cleanCuit[10]);
};