# MaestroObras Frontend

Aplicación web frontend para gestión de obras de construcción, desarrollada con Astro + React + TypeScript + Tailwind CSS.

## 🚀 Características

- **Arquitectura Moderna**: Astro + React 19 + TypeScript
- **UI/UX**: Tailwind CSS + HeadlessUI con modo oscuro
- **Seguridad**: JWT en cookies, CSRF double-submit, middleware de autenticación
- **RBAC**: Sistema de roles (Admin, Jefe Obra, Depósito, Lectura)
- **Internacionalización**: Español, formato es-AR (ARS, fechas dd/mm/yyyy)
- **Responsive**: Mobile-first, PWA-ready
- **Formularios**: react-hook-form + Zod con validaciones en español
- **Gráficos**: Recharts para visualizaciones
- **Uploads**: Drag & drop con validación y progreso

## 🛠 Tecnologías

### Core
- Astro 5.3+
- React 19
- TypeScript 5.7+
- Tailwind CSS 3.4+

### UI & Formularios
- @headlessui/react
- react-hook-form
- Zod
- Lucide React

### Estado y Datos
- @tanstack/react-query
- Axios
- JWT Decode

### Utilidades
- dayjs (fechas)
- recharts (gráficos)
- file-saver (descargas)
- uuid

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Backend MaestroObras configurado

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```env
# API Configuration
PUBLIC_API_URL=http://localhost:4000/api
PUBLIC_SITE_URL=http://localhost:3000

# Branding & Theming
PUBLIC_BRAND_NAME=MaestroObras
PUBLIC_BRAND_PRIMARY=#2563eb
PUBLIC_BRAND_SECONDARY=#64748b
PUBLIC_BRAND_ACCENT=#0ea5e9
PUBLIC_BRAND_LOGO_URL=/logos/logo-light.svg
PUBLIC_BRAND_LOGO_DARK_URL=/logos/logo-dark.svg

# UI Configuration
PUBLIC_DARK_MODE_DEFAULT=true
PUBLIC_SESSION_IDLE_MINUTES=30
PUBLIC_PAGE_SIZE_DEFAULT=20

# Client Identification
PUBLIC_X_CLIENT_ID=maestroobras-frontend
```

## 💻 Desarrollo

```bash
npm run dev
```

## 📁 Estructura

```
src/
├── components/     # Componentes React
│   ├── auth/       # Componentes de autenticación
│   ├── ui/         # Componentes UI
│   └── common/     # Componentes comunes
├── layouts/        # Layouts Astro
├── pages/          # Rutas
├── services/       # Servicios API con seguridad mejorada
├── hooks/          # Custom hooks con validación avanzada
├── middleware/     # Middleware de autenticación y seguridad
├── utils/          # Utilidades de seguridad (cookies, etc.)
├── types/          # TypeScript types
└── styles/         # Estilos
```

## 🔐 Implementaciones de Seguridad Avanzadas

### 1. Sistema Completo CSRF
Implementación del patrón Double Submit Cookie:
- Recepción automática de tokens CSRF desde el backend
- Inclusión automática del token en encabezados para solicitudes de mutación
- Manejo de errores de CSRF con reintentos automáticos
- Renovación automática de tokens expirados o inválidos

### 2. Gestión Avanzada de Cookies
Clase de utilidad `SecureCookies` con múltiples funciones:
- Configuración automática de atributos de seguridad (Secure, SameSite, HttpOnly)
- Sanitización de valores para prevenir XSS
- Soporte para diferentes entornos (dev/prod)
- Detección de vulnerabilidades en navegadores antiguos

### 3. Servicio API con Características Empresariales
- Peticiones tipadas con TypeScript para mayor seguridad
- Soporte para control de caché fino (omitir anti-caché cuando sea necesario)
- Gestión de Request/Response IDs para correlación con logs del backend
- Identificación de cliente con X-Client-ID para seguimiento en el backend
- Sistema avanzado de reintentos para errores específicos (CSRF, etc.)

### 4. Control de Sesión y Autenticación
- Verificación periódica del estado de autenticación (health check)
- Detección de tokens JWT inválidos o manipulados
- Cierre de sesión en todos los dispositivos
- Soporte completo para recuperación y cambio de contraseña
- Verificación de roles y permisos del usuario

### 5. Middleware Astro Sofisticado
- Validación de tokens JWT en el lado del servidor
- Detección de inactividad con timeout configurable
- Preservación segura de URLs para redirección post-login
- Exposición de datos de usuario a componentes Astro vía locals
- Manejo de mensajes de error vía cookies temporales

### 6. Validación y Decodificación de Tokens
- Verificación básica de tokens JWT en el cliente
- Extracción segura de datos de usuario desde el token
- Detección de tokens expirados para renovación proactiva
- Manejo de tokens manipulados o inválidos

## 🔄 Flujo de Seguridad CSRF Implementado

1. **Inicialización**:
   - El backend genera un token CSRF seguro usando crypto.randomBytes()
   - El token se almacena en la sesión del usuario
   - Se envía al frontend en una cookie no-HttpOnly para acceso por JavaScript

2. **Solicitudes Estándar**:
   - El cliente lee el token CSRF desde la cookie XSRF-TOKEN
   - El token se incluye en el header X-CSRF-Token para cada solicitud mutante
   - El backend verifica que el token en el header coincida con el guardado en sesión

3. **Manejo de Errores**:
   - Si ocurre un error de CSRF, el cliente solicita automáticamente un nuevo token
   - Se reintenta la solicitud original con el nuevo token
   - Se registra el error para prevenir ataques coordinados

4. **Renovación**:
   - El token se renueva automáticamente en caso de errores
   - Endpoint dedicado `/api/csrf-token` para obtener nuevo token cuando sea necesario
   - El frontend mantiene el token actualizado entre solicitudes

## 📱 Páginas y Rutas Seguras

- `/login` - Inicio de sesión con detección de sesiones expiradas
- `/register` - Registro con validación robusta
- `/dashboard` - Panel principal protegido
- `/profile` - Gestión de perfil de usuario (protegido)
- `/forgot-password` - Solicitud de recuperación
- `/reset-password` - Restablecimiento con token seguro

## 🛡️ Control de Caché y Prevención de Ataques

### Control de Caché
- Parámetro de timestamp en solicitudes GET para prevenir cacheo
- Opción para permitir cacheo en recursos estáticos no sensibles
- Headers específicos para control de caché en respuestas

### Prevención de XSS
- Sanitización de valores de cookies
- Escape de datos dinámicos en componentes React
- Validación de entradas antes de enviarlas al backend

### Control de Inactividad
- Seguimiento de actividad del usuario
- Cierre automático de sesión después de periodo configurable
- Almacenamiento de timestamp de última actividad en cookie segura

## ⚠️ Consideraciones para Producción

1. Asegurar que el sitio utilice HTTPS (requerido para cookies seguras)
2. Configurar correctamente el dominio en las cookies
3. Revisar y ajustar tiempos de expiración según necesidades
4. Verificar que el backend implemente la protección CSRF correspondiente
5. Considerar implementar protección adicional:
   - Implementar SRI (Subresource Integrity) para scripts
   - Considerar despliegue con Cloudflare o similar para WAF adicional
   - Configurar CSP (Content Security Policy) en el servidor

## 🔍 Scripts Disponibles

- `npm run dev` - Desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build

## 📝 Licencia

MIT