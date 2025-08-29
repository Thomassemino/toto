import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin, getPerfil, api } from '../services/api';
import type { User, LoginPayload, AuthResponse, PerfilResponse } from '../types/auth';
import { API_ENDPOINTS, ROLE } from '../constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Clase de utilidad para manejo de cookies seguras
class SecureCookies {
  static get(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
  }

  static set(name: string, value: string, options: { [key: string]: any } = {}): void {
    if (typeof document === 'undefined') return;
    
    const cookieOptions = {
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      ...options
    };
    
    let cookieString = `${name}=${value}`;
    
    if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`;
    if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`;
    if (cookieOptions.secure) cookieString += '; secure';
    if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`;
    
    document.cookie = cookieString;
  }

  static delete(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict`;
  }
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Función para comprobar si hay sesión activa
  const checkAuth = useCallback(async (silent: boolean = true) => {
    if (typeof document === 'undefined') return;
    
    const token = SecureCookies.get('token');
    if (!token) {
      setAuth({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      return null;
    }
    
    try {
      // Verificar sesión del usuario
      const data = await getPerfil();
      
      setAuth({
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
      return data.user;
    } catch (error: any) {
      // Solo establecer error si no estamos en modo silencioso
      if (!silent) {
        setAuth(prev => ({
          ...prev,
          error: error.message || 'Error al verificar sesión'
        }));
      }
      
      // Limpiar datos de autenticación
      SecureCookies.delete('token');
      setAuth({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: silent ? null : error.message
      });
      
      return null;
    }
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    // Verificación inmediata
    checkAuth(true);
    
    // Verificar sesión periódicamente (cada 5 minutos)
    const interval = setInterval(() => {
      // Solo verificar si estamos autenticados
      if (auth.isAuthenticated) {
        checkAuth(true);
      }
    }, 5 * 60 * 1000);
    
    // Limpiar interval al desmontar
    return () => clearInterval(interval);
  }, [checkAuth, auth.isAuthenticated]);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await apiLogin({ email, password });
      
      if (data.token) {
        // Establecer cookie segura
        SecureCookies.set('token', data.token, { 
          maxAge: 86400, // 1 día
          secure: true,
          sameSite: 'strict'
        });
        
        setAuth({
          user: data.user || { email },
          isAuthenticated: true,
          loading: false,
          error: null
        });
        
        // Post-login redirect del lado del cliente
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const redirectTo = params.get('redirect') || '/dashboard';
          window.location.assign(redirectTo);
        }
        
        return data.user || { email };
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al iniciar sesión'
      }));
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async (redirectUrl: string = '/login'): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true }));
      
      // Llamar al endpoint de logout si existe
      try {
        await api.post('/auth/logout');
      } catch (error) {
        // Continuar con el logout incluso si falla el backend
        console.error('Error durante logout en el servidor:', error);
      }
      
      // Limpiar datos del cliente
      SecureCookies.delete('token');
      
      setAuth({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      
      // Redirigir
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (error: any) {
      console.error('Error durante logout:', error);
      
      // Asegurar que el usuario se desconecte incluso si hay error
      SecureCookies.delete('token');
      setAuth({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.message || 'Error durante el cierre de sesión'
      });
      
      // Redirigir de todos modos
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    }
  };

  // Función para registrar nuevo usuario
  const register = async (email: string, password: string, name?: string): Promise<RegisterResponse> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await api.post('/auth/register', { 
        email, 
        password,
        name
      });
      const data = response.data;
      
      setAuth(prev => ({ ...prev, loading: false }));
      return data;
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al registrar usuario'
      }));
      throw error;
    }
  };

  // Función para actualizar datos del usuario actual
  const updateProfile = async (profileData: Partial<User>): Promise<User> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data;
      
      setAuth(prev => ({
        ...prev,
        user: updatedUser,
        loading: false
      }));
      
      return updatedUser;
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al actualizar perfil'
      }));
      throw error;
    }
  };

  // Función para solicitar cambio de contraseña
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      await api.post('/auth/forgot-password', { email });
      
      setAuth(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al solicitar cambio de contraseña'
      }));
      throw error;
    }
  };

  // Función para establecer nueva contraseña
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      await api.post('/auth/reset-password', { token, password: newPassword });
      
      setAuth(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al restablecer contraseña'
      }));
      throw error;
    }
  };

  // Función para cambiar contraseña (usuario autenticado)
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      
      await api.post('/auth/change-password', { 
        currentPassword, 
        newPassword 
      });
      
      setAuth(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setAuth(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Error al cambiar contraseña'
      }));
      throw error;
    }
  };

  // Función para limpiar estado de error
  const clearError = () => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  // Verificar si usuario tiene rol específico
  const hasRole = (role: string): boolean => {
    return auth.user?.rol === role || false;
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    register,
    checkAuth,
    updateProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError,
    hasRole
  };
};