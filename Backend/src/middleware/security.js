const toobusy = require('toobusy-js');
const { validationResult } = require('express-validator');
const hpp = require('hpp');
const crypto = require('crypto');

// Configuración de DoS
toobusy.maxLag(70); // Ajustar sensibilidad (valor en ms, menor es más sensible)

// Protección contra DoS
function dosProtection(req, res, next) {
  const busy = toobusy();
  if (busy) {
    if (!res.headersSent) {
      res.setHeader('Retry-After', '120');
      return res.status(503).json({
        status: 'error',
        message: 'Servidor ocupado, intentá de nuevo en unos segundos',
      });
    }
    // Si ya se enviaron headers, no intentes responder de nuevo ni setear headers
    return;
  }
  return next();
}

// Validación de entrada
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Sanitización de parámetros HTTP
const sanitizeParams = hpp({
  whitelist: [] // Añadir parámetros que pueden duplicarse, si es necesario
});


// Detector de contenido malicioso
const detectSuspiciousContent = (req, res, next) => {
  const body = JSON.stringify(req.body).toLowerCase();
  
  // Patrones que podrían indicar contenido malicioso
  const suspiciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /onclick/i,
    /onerror/i,
    /onload/i,
    /eval\(/i,
    /document\.cookie/i,
    /exec\(/i,
    /function\(\)/i,
    /\$where:/i, // Intento de inyección NoSQL
    /\$ne:/i,    // Intento de inyección NoSQL
    /\$gt:/i     // Intento de inyección NoSQL
  ];
  
  // Revisar el cuerpo de la solicitud para patrones sospechosos
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(body)) {
      console.warn(`Contenido sospechoso detectado: ${pattern.toString()}`);
      return res.status(403).json({
        status: 'error',
        message: 'La solicitud contiene contenido potencialmente malicioso'
      });
    }
  }
  
  next();
};

// Limitar tamaño de solicitudes
const requestSizeLimit = (req, res, next) => {
  // Ya configurado globalmente en express.json() y express.urlencoded(),
  // Este middleware es para verificación adicional
  const contentLength = parseInt(req.headers['content-length'] || '0');
  
  // Límite de 100KB
  if (contentLength > 102400) {
    return res.status(413).json({
      status: 'error',
      message: 'Payload demasiado grande. El límite es 100KB.'
    });
  }
  
  next();
};

// Establecer restricciones de cache
const cacheControl = (req, res, next) => {
  // No cachear respuestas por defecto
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Registro de actividad sospechosa
const logSuspiciousActivity = (req, res, next) => {
  // Lista de patrones sospechosos en URL
  const suspiciousUrlPatterns = [
    /\/\.git/,
    /\/\.env/,
    /\/wp-admin/,
    /\/admin/,
    /\/backup/,
    /\/config/,
    /\/shell/,
    /\/cmd/,
    /\/login\.php/,
    /\/admin\.php/
  ];
  
  const url = req.originalUrl || req.url;
  
  // Verificar si la URL es sospechosa
  for (const pattern of suspiciousUrlPatterns) {
    if (pattern.test(url)) {
      const ipAddress = req.ip || req.connection.remoteAddress;
      console.warn(`Actividad sospechosa: IP=${ipAddress}, URL=${url}, Método=${req.method}`);
      // Continuar la ejecución pero registrar la actividad
      break;
    }
  }
  
  next();
};


// 1) Genera token y lo expone en cookie legible por JS (double-submit)

const PROD = process.env.NODE_ENV === 'production';

function generateCsrfToken(req, res, next) {
  try {
    if (!req.session) return next(); // por si sesión falla
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    // Cookie NO HttpOnly, para que el front la lea y la mande en header
    res.cookie('XSRF-TOKEN', req.session.csrfToken, {
      httpOnly: false,
      sameSite: 'strict',
      secure: PROD,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    next();
  } catch (e) {
    next(e);
  }
}

// 2) Valida CSRF solo en mutaciones; no asumas que hay cookies siempre
function csrfProtection(req, res, next) {
  const method = (req.method || 'GET').toUpperCase();
  // Solo proteger métodos que cambian estado
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next();

  const headerToken = req.get('X-CSRF-Token') || req.body?._csrf || req.query?._csrf;
  const cookieToken = req.cookies?.['XSRF-TOKEN'];
  const sessionToken = req.session?.csrfToken;

  if (!headerToken || !cookieToken || !sessionToken) {
    return res.status(403).json({ status: 'error', message: 'CSRF token faltante' });
  }
  if (headerToken !== cookieToken || headerToken !== sessionToken) {
    return res.status(403).json({ status: 'error', message: 'CSRF token inválido' });
  }
  return next();
}

module.exports = { 
  dosProtection, 
  validate, 
  sanitizeParams,
  csrfProtection,
  generateCsrfToken,
  detectSuspiciousContent,
  requestSizeLimit,
  cacheControl,
  logSuspiciousActivity
};