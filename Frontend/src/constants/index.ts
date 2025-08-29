export const ROLE = {
  Admin: 'admin',
  JefeObra: 'jefe_obra',
  Deposito: 'deposito',
  Lectura: 'lectura',
} as const;

export const ROLES = [
  ROLE.Admin,
  ROLE.JefeObra,
  ROLE.Deposito,
  ROLE.Lectura,
] as const;

export type Role = typeof ROLES[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  jefe_obra: 'Jefe de obra',
  deposito: 'Depósito',
  lectura: 'Solo lectura',
};

export const OBRA_STATES = {
  PLANIFICADA: 'planificada',
  EN_PROCESO: 'en_proceso',
  PAUSADA: 'pausada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
} as const;

export type ObraState = typeof OBRA_STATES[keyof typeof OBRA_STATES];

export const OBRA_STATE_LABELS: Record<ObraState, string> = {
  [OBRA_STATES.PLANIFICADA]: 'Planificada',
  [OBRA_STATES.EN_PROCESO]: 'En Proceso',
  [OBRA_STATES.PAUSADA]: 'Pausada',
  [OBRA_STATES.COMPLETADA]: 'Completada',
  [OBRA_STATES.CANCELADA]: 'Cancelada'
};

export const OBRA_STATE_COLORS: Record<ObraState, string> = {
  [OBRA_STATES.PLANIFICADA]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [OBRA_STATES.EN_PROCESO]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [OBRA_STATES.PAUSADA]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [OBRA_STATES.COMPLETADA]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [OBRA_STATES.CANCELADA]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export const MOVEMENT_TYPES = {
  INGRESO: 'ingreso',
  EGRESO: 'egreso',
  AJUSTE: 'ajuste'
} as const;

export type MovementType = typeof MOVEMENT_TYPES[keyof typeof MOVEMENT_TYPES];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MOVEMENT_TYPES.INGRESO]: 'Ingreso',
  [MOVEMENT_TYPES.EGRESO]: 'Egreso',
  [MOVEMENT_TYPES.AJUSTE]: 'Ajuste'
};

export const MILESTONE_STATES = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado'
} as const;

export type MilestoneState = typeof MILESTONE_STATES[keyof typeof MILESTONE_STATES];

export const MILESTONE_STATE_LABELS: Record<MilestoneState, string> = {
  [MILESTONE_STATES.PENDIENTE]: 'Pendiente',
  [MILESTONE_STATES.EN_PROCESO]: 'En Proceso',
  [MILESTONE_STATES.COMPLETADO]: 'Completado'
};

export const PAYMENT_METHODS = {
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  CHEQUE: 'cheque',
  TARJETA: 'tarjeta'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHODS.EFECTIVO]: 'Efectivo',
  [PAYMENT_METHODS.TRANSFERENCIA]: 'Transferencia',
  [PAYMENT_METHODS.CHEQUE]: 'Cheque',
  [PAYMENT_METHODS.TARJETA]: 'Tarjeta'
};

export const EXPENSE_CATEGORIES = {
  MATERIALES: 'materiales',
  MANO_OBRA: 'mano_obra',
  EQUIPOS: 'equipos',
  SERVICIOS: 'servicios',
  OTROS: 'otros'
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[keyof typeof EXPENSE_CATEGORIES];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [EXPENSE_CATEGORIES.MATERIALES]: 'Materiales',
  [EXPENSE_CATEGORIES.MANO_OBRA]: 'Mano de Obra',
  [EXPENSE_CATEGORIES.EQUIPOS]: 'Equipos',
  [EXPENSE_CATEGORIES.SERVICIOS]: 'Servicios',
  [EXPENSE_CATEGORIES.OTROS]: 'Otros'
};

export const ALLOWED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'] as const;
export const MAX_FILE_SIZE_MB = 10;

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    PERFIL: '/auth/perfil',
    LOGOUT: '/auth/logout'
  },
  CSRF: '/csrf-token',
  OBRAS: '/obras',
  TERCEROS: '/terceros',
  USUARIOS: '/usuarios',
  REPORTES: '/reportes',
  ADJUNTOS: '/adjuntos',
  AUDITORIA: '/auditoria',
  PLANTILLAS: '/plantillas'
} as const;

export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Deposito, ROLE.Lectura]
  },
  {
    name: 'Obras',
    href: '/obras',
    icon: 'Building2',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Deposito, ROLE.Lectura]
  },
  {
    name: 'Terceros',
    href: '/terceros',
    icon: 'Users',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Lectura]
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: 'BarChart3',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Lectura]
  },
  {
    name: 'Plantillas',
    href: '/plantillas',
    icon: 'Template',
    roles: [ROLE.Admin, ROLE.JefeObra]
  },
  {
    name: 'Usuarios',
    href: '/usuarios',
    icon: 'UserCog',
    roles: [ROLE.Admin]
  }
] as const;