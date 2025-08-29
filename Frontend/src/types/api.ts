// API-specific types and interfaces

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  requestId?: string;
  timestamp?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
  requestId?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse {
  data: {
    items: T[];
    meta: PaginationMeta;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  include?: string[];
  fields?: string[];
}

// Request/Response types for specific endpoints
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse extends ApiResponse {
  data: {
    user: User;
    token: string;
    expiresAt: string;
  };
}

export interface RefreshTokenResponse extends ApiResponse {
  data: {
    token: string;
    expiresAt: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  timezone?: string;
}

// File upload types
export interface FileUploadResponse extends ApiResponse {
  data: {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  };
}

export interface MultipleFileUploadResponse extends ApiResponse {
  data: {
    files: Array<{
      id: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string;
    }>;
    errors?: Array<{
      filename: string;
      error: string;
    }>;
  };
}

// Bulk operations
export interface BulkOperationRequest {
  ids: string[];
  operation: string;
  data?: any;
}

export interface BulkOperationResponse extends ApiResponse {
  data: {
    successful: string[];
    failed: Array<{
      id: string;
      error: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

// Export/Import types
export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf';
  filters?: Record<string, any>;
  fields?: string[];
  includeHeaders?: boolean;
}

export interface ExportResponse extends ApiResponse {
  data: {
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  };
}

export interface ImportRequest {
  file: File;
  mapping?: Record<string, string>;
  options?: {
    skipHeader?: boolean;
    delimiter?: string;
    encoding?: string;
  };
}

export interface ImportResponse extends ApiResponse {
  data: {
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    summary?: {
      total: number;
      imported: number;
      failed: number;
      warnings: number;
    };
    errors?: Array<{
      row: number;
      field: string;
      message: string;
    }>;
  };
}

// Search types
export interface SearchRequest {
  query: string;
  entities?: ('obras' | 'terceros' | 'materiales' | 'usuarios')[];
  filters?: Record<string, any>;
  limit?: number;
}

export interface SearchResult {
  id: string;
  type: 'obra' | 'tercero' | 'material' | 'usuario';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface SearchResponse extends ApiResponse {
  data: {
    results: SearchResult[];
    total: number;
    suggestions?: string[];
  };
}

// Analytics/Stats types
export interface StatsRequest {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dateFrom?: string;
  dateTo?: string;
  groupBy?: string;
  metrics: string[];
}

export interface StatsResponse extends ApiResponse {
  data: {
    metrics: Record<string, number>;
    timeSeries?: Array<{
      date: string;
      values: Record<string, number>;
    }>;
    breakdown?: Array<{
      category: string;
      value: number;
      percentage: number;
    }>;
  };
}

// Audit log types
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, {
    from: any;
    to: any;
  }>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface AuditLogRequest extends QueryParams {
  userId?: string;
  entity?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Notification types
export interface NotificationPreferences {
  email: {
    obraUpdates: boolean;
    gastoApprovals: boolean;
    milestoneDeadlines: boolean;
    facturaReminders: boolean;
    systemAlerts: boolean;
  };
  push: {
    obraUpdates: boolean;
    gastoApprovals: boolean;
    milestoneDeadlines: boolean;
    facturaReminders: boolean;
    systemAlerts: boolean;
  };
}

export interface UpdateNotificationPreferencesRequest {
  preferences: NotificationPreferences;
}

// System health types
export interface HealthCheckResponse extends ApiResponse {
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    environment: string;
    uptime: number;
    checks: {
      database: 'healthy' | 'unhealthy';
      storage: 'healthy' | 'unhealthy';
      cache: 'healthy' | 'unhealthy';
      email: 'healthy' | 'unhealthy';
    };
  };
}

// Version info
export interface VersionInfo {
  version: string;
  buildDate: string;
  commitHash: string;
  environment: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'notification' | 'update' | 'error' | 'heartbeat';
  payload: any;
  timestamp: string;
}

export interface WebSocketNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
}

export interface WebSocketUpdate {
  entity: string;
  entityId: string;
  action: 'created' | 'updated' | 'deleted';
  data: any;
  timestamp: string;
}