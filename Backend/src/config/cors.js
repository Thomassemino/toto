// src/config/cors.js
const cors = require('cors');

module.exports = function buildCors() {
  const RAW = process.env.CORS_ORIGINS || 'http://localhost:4321,http://localhost:3000';
  const ALLOW_LIST = RAW.split(',').map(s => s.trim()).filter(Boolean);

  const options = {
    origin(origin, cb) {
      // sin Origin (Postman/health) o en whitelist → OK
      if (!origin || ALLOW_LIST.includes(origin)) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token','X-Request-Id','X-Client-Id'],
    exposedHeaders: ['Content-Disposition'], // para descargas
  };

  return cors(options);
};
