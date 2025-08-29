// src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { LoginPayload, AuthResponse, PerfilResponse } from '../types/auth';

const API_BASE = import.meta.env.PUBLIC_API_URL; // ej: http://localhost:4000/api
const CLIENT_ID = import.meta.env.PUBLIC_X_CLIENT_ID || 'maestroobras-frontend';

if (!API_BASE) console.warn('[API] PUBLIC_API_URL no está definida');
else console.info('[API] baseURL =', API_BASE);

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
  headers: { 'X-Client-Id': CLIENT_ID },
});

export function getCookie(name: string): string | null {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop() as string) : null;
}

export async function ensureCsrf(): Promise<void> {
  const has = getCookie('XSRF-TOKEN');
  if (!has) {
    await api.get('/csrf-token', { params: { _t: Date.now() } });
  }
}

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const method = (config.method || 'get').toUpperCase();
  if (!['GET','HEAD','OPTIONS'].includes(method)) {
    let token = getCookie('XSRF-TOKEN');
    if (!token) {
      await ensureCsrf();
      token = getCookie('XSRF-TOKEN') || '';
    }
    config.headers = { ...(config.headers || {}), 'X-CSRF-Token': token };
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError<any>) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/csrf-token');
    if (!isAuthCall && (status === 401 || status === 403)) {
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await ensureCsrf();
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function getPerfil(): Promise<PerfilResponse> {
  const res = await api.get('/auth/perfil');
  return res.data;
}

export default api;