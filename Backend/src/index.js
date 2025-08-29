require('dotenv').config();
const express = require('express');
const buildCors = require('./config/cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');
const fs = require('fs');
const client = require('prom-client');
const mongoose = require('mongoose');
const crypto = require('crypto');

const { 
  dosProtection, 
  sanitizeParams, 
  csrfProtection, 
  generateCsrfToken, 
  detectSuspiciousContent,
  requestSizeLimit,
  cacheControl,
  logSuspiciousActivity
} = require('./middleware/security');
const MongoStore = require('connect-mongo');

// Inicializar Express
const app = express();

// Crear directorio de uploads si no existe
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar métricas Prometheus
const register = new client.Registry();
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route', 'method', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'method', 'status_code']
});
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

// Middleware para métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;
    
    httpRequestDuration
      .labels(route, req.method, res.statusCode.toString())
      .observe(duration);
    
    httpRequestsTotal
      .labels(route, req.method, res.statusCode.toString())
      .inc();
  });
  
  next();
});

// Habilitar confianza en Proxy si está detrás de un balanceador de carga o proxy inverso
app.set('trust proxy', 1);

// Registro de actividad sospechosa - aplicar temprano en la cadena de middlewares
app.use(logSuspiciousActivity);

// Middlewares básicos
app.use(buildCors());
app.use(express.json({ limit: '100kb' })); // Limitar tamaño de solicitudes JSON
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // Firmar cookies

// Límite de tamaño de solicitud explícito
app.use(requestSizeLimit);

// Seguridad avanzada con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"],
      workerSrc: ["'self'", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// Protección contra inyección NoSQL en MongoDB
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`¡Intento de inyección NoSQL detectado! Se sanitizó el campo: ${key}`);
  }
}));

// Protección contra contaminación de parámetros HTTP
app.use(sanitizeParams);

// Controlar caching de respuestas
app.use(cacheControl);

// Detección de contenido malicioso en solicitudes
app.use(detectSuspiciousContent);

// aplicar temprano, ANTES de rate-limit:
app.use(dosProtection);

// Configuración de sesiones con MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sid', // Nombre genérico para no revelar tecnología
  resave: false,
  saveUninitialized: false,
  rolling: true, // Renueva el tiempo de expiración en cada respuesta
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 día
    crypto: {
      secret: process.env.SESSION_CRYPTO_SECRET
    },
    autoRemove: 'interval',
    autoRemoveInterval: 60, // Limpiar sesiones expiradas cada 60 minutos
    touchAfter: 5 * 60 // Actualizar sesión en la base de datos solo después de 5 minutos
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));

// Generar y proporcionar token CSRF
app.use(generateCsrfToken);

// CSRF Protection - después de inicializar session
app.use(csrfProtection);

// Rate Limiting - diferente por rutas
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar solicitudes exitosas
  message: { 
    status: 'error',
    message: 'Demasiados intentos fallidos desde esta IP, por favor intente nuevamente después de 15 minutos' 
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // limitar cada IP a 200 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    status: 'error',
    message: 'Demasiadas solicitudes, por favor intente nuevamente después de 15 minutos' 
  }
});

// Aplicar limitadores de tasa según la ruta
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);
app.use('/api', apiLimiter);

// Headers de seguridad adicionales
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Añadir ID de petición para debugging y correlación de logs
  const requestId = crypto.randomBytes(16).toString('hex');
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  next();
});

// Endpoint para verificar estado de salud del servicio
app.get('/api/health', async (req, res) => {
  try {
    let mongoStatus = 'connected';
    let diskStatus = 'ok';
    
    // Verificar conexión a MongoDB
    if (mongoose.connection.readyState !== 1) {
      mongoStatus = 'disconnected';
    }
    
    // Verificar acceso al directorio de uploads
    try {
      await fs.promises.access(uploadDir, fs.constants.W_OK);
    } catch (error) {
      diskStatus = 'no_write_access';
    }
    
    const isHealthy = mongoStatus === 'connected' && diskStatus === 'ok';
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      uptime: process.uptime(),
      timestamp: Date.now(),
      checks: {
        mongo: mongoStatus,
        disk: diskStatus
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now()
    });
  }
});

// Endpoint para obtener token CSRF (útil para SPA)
app.get('/api/csrf-token', (req, res) => {
  res.json({ 
    csrfToken: req.session.csrfToken 
  });
});

// Endpoint para métricas de Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/obras', require('./routes/obras'));
app.use('/api/obras', require('./routes/presupuestos'));
app.use('/api/obras', require('./routes/pagos'));
app.use('/api/obras', require('./routes/gastos'));
app.use('/api/terceros', require('./routes/terceros'));
app.use('/api/obras', require('./routes/inventario'));
app.use('/api/obras', require('./routes/hitos'));
app.use('/api/adjuntos', require('./routes/adjuntos'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/auditoria', require('./routes/auditoria'));
app.use('/api/export', require('./routes/export'));

// Documentación Swagger
app.use('/api-docs', require('./routes/docs'));

// 404
app.use((req, res) => {
  if (res.headersSent) return;
  res.status(404).json({ status: 'error', message: 'Recurso no encontrado' });
});

// error handler blindado
app.use((err, req, res, next) => {
  console.error(`Error [${req.requestId || 'no-id'}]:`, err.message);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? (status === 500 ? 'Error del servidor' : err.message)
    : err.message || 'Error del servidor';
  res.status(status).json({ status: 'error', message, requestId: req.requestId });
});

// Proceso de cierre limpio
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('Iniciando cierre controlado del servidor...');
  
  // Dejar de aceptar nuevas conexiones
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    
    // Cerrar conexión a la base de datos
    mongoose.connection.close(false, () => {
      console.log('Conexión a MongoDB cerrada.');
      process.exit(0);
    });
  });
  
  // Si el cierre no ocurre en 10 segundos, forzar cierre
  setTimeout(() => {
    console.error('No se pudo cerrar limpiamente, forzando cierre...');
    process.exit(1);
  }, 10000);
}

// Iniciar servidor
const PORT = process.env.PORT || 4000;

let server;
connectDB()
  .then(() => {
    server = app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    
    // Configurar timeout del servidor
    server.timeout = 30000; // 30 segundos
    
    // Configurar keep-alive
    server.keepAliveTimeout = 65000; // Ligeramente mayor que el valor por defecto de ALB/Nginx (60s)
    server.headersTimeout = 66000; // Ligeramente mayor que keepAliveTimeout
  })
  .catch(err => {
    console.error('Error al iniciar servidor:', err);
    process.exit(1);
  });