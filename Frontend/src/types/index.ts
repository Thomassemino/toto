// Core shared interfaces and types
export * from './auth';
export * from './obra';
export * from './tercero';
export * from './material';
export * from './reporte';
export * from './ui';
export * from './api';
export * from './usuario';
export * from './plantilla';

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginResponse extends ApiResponse {
  token: string;
  user: User;
}

export interface RegisterResponse extends ApiResponse {
  message: string;
}

// Common query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

// Form validation schemas
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Dashboard KPI types
export interface KPIData {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
  color?: string;
  description?: string;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartDataPoint[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  title?: string;
  legend?: boolean;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  createdAt: Date;
}