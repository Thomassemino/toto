const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { verificarRol } = require('../middleware/rbac');
const { auditAction } = require('../middleware/audit');
const { query, param } = require('express-validator');
const {
  subirAdjunto,
  obtenerAdjuntos,
  eliminarAdjunto,
  descargarAdjunto
} = require('../controllers/adjuntos');

const uploadDir = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { entidad, entidadId } = req.body;
    const destPath = path.join(uploadDir, entidad, entidadId);
    
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

const validarObtenerAdjuntos = [
  query('entidad').notEmpty().withMessage('La entidad es requerida'),
  query('entidadId').isMongoId().withMessage('ID de entidad inválido')
];

router.use(auth);

router.post('/',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  upload.single('archivo'),
  auditAction('Adjunto', 'subir'),
  subirAdjunto
);

router.get('/',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  validarObtenerAdjuntos,
  obtenerAdjuntos
);

router.get('/:id/descargar',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  descargarAdjunto
);

router.delete('/:id',
  verificarRol(['admin', 'jefe_obra']),
  auditAction('Adjunto', 'eliminar'),
  eliminarAdjunto
);

module.exports = router;