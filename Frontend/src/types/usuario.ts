import { BaseEntity } from './index';

export type UserRole = 'admin' | 'jefe_obra' | 'deposito' | 'lectura';

export interface User extends BaseEntity {
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  activo: boolean;
  ultimoAcceso?: string;
  telefono?: string;
  avatar?: string;
  obrasAsignadas?: string[]; // Solo para jefe_obra
  preferencias?: UserPreferences;
}

export interface UserPreferences {
  tema: 'light' | 'dark' | 'auto';
  idioma: 'es-AR';
  notificaciones: {
    email: boolean;
    push: boolean;
    alertasStock: boolean;
    vencimientos: boolean;
  };
  dashboard: {
    kpisVisibles: string[];
    graficosVisibles: string[];
    ordenPersonalizado?: string[];
  };
}

export interface CreateUserData {
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  password: string;
  telefono?: string;
  obrasAsignadas?: string[];
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  activo?: boolean;
  password?: string;
}

export interface UserFilters {
  rol?: UserRole[];
  activo?: boolean;
  ultimoAccesoDesde?: string;
  ultimoAccesoHasta?: string;
}

// Permission types for RBAC
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition?: (user: User, resource?: any) => boolean;
}

export interface RolePermissions {
  admin: Permission[];
  jefe_obra: Permission[];
  deposito: Permission[];
  lectura: Permission[];
}