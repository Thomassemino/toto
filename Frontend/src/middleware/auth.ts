// src/middleware/auth.ts
import type { MiddlewareHandler } from 'astro';

const API_BASE = import.meta.env.PUBLIC_API_URL; // ej: http://localhost:4000/api
const isDev = import.meta.env.DEV;

async function fetchCsrf(cookie: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/csrf-token`, {
      method: 'GET',
      headers: { cookie },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    const token = (data && (data.csrfToken || data.token)) || null;
    if (isDev) console.info('[MW] CSRF token obtenido:', Boolean(token));
    return token;
  } catch {
    return null;
  }
}

async function fetchPerfil(cookie: string, csrf?: string): Promise<any | null> {
  const headers: Record<string, string> = { cookie };
  if (csrf) headers['X-CSRF-Token'] = csrf;

  const res = await fetch(`${API_BASE}/auth/perfil`, { method: 'GET', headers });
  if (!res.ok) {
    if (isDev) console.info('[MW] /auth/perfil status:', res.status);
    return null;
  }
  const data = await res.json().catch(() => null);
  // Aceptar formatos { user: {...} } o el objeto directo
  const user = data?.user ?? (data && typeof data === 'object' ? data : null);
  return user || null;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, url, locals, redirect } = context;
  const { pathname, search } = new URL(request.url);
  const cookie = request.headers.get('cookie') ?? '';

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const isPublic =
    isAuthPage ||
    pathname === '/' ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/_image');

  // 1) Intento 1: perfil sin CSRF (por si el back NO lo exige en GET)
  let user = await fetchPerfil(cookie);

  // 2) Si no hay user, conseguir CSRF y reintentar
  if (!user) {
    const csrf = await fetchCsrf(cookie);
    if (csrf) user = await fetchPerfil(cookie, csrf);
  }

  locals.user = user || null;

  // Autenticado en páginas de auth -> mandarlo al destino
  if (user && isAuthPage) {
    const target = url.searchParams.get('redirect') || '/dashboard';
    if (isDev) console.info('[MW] Autenticado, redirigiendo desde auth a:', target);
    return redirect(target);
  }

  // No autenticado en rutas protegidas -> login con redirect
  if (!user && !isPublic) {
    const backTo = encodeURIComponent(pathname + (search || ''));
    if (isDev) console.info('[MW] No autenticado, redirigiendo a login con redirect:', backTo);
    return redirect(`/login?redirect=${backTo}`);
  }

  return next();
};