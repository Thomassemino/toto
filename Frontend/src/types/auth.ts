import type { Role } from '../constants';

export interface User {
  _id: string;
  email: string;
  rol: Role;
  nombre?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PerfilResponse {
  user: User;
}

export interface CsrfResponse {
  csrfToken: string;
}

export interface ApiError {
  status?: string;
  message: string;
  errors?: Record<string, string[]>;
}