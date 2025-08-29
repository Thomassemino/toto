const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { 
  validarCrearTercero, 
  validarActualizarTercero, 
  validarEliminarTercero 
} = require('../validators/terceros');
const {
  obtenerTerceros,
  crearTercero,
  actualizarTercero,
  eliminarTercero
} = require('../controllers/terceros');
const Tercero = require('../models/tercero');

router.use(auth);

router.get('/',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  obtenerTerceros
);

router.post('/',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  validarCrearTercero,
  auditAction('Tercero', 'crear'),
  crearTercero
);

router.patch('/:id',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  validarActualizarTercero,
  captureOriginalData(Tercero),
  auditAction('Tercero', 'actualizar'),
  actualizarTercero
);

router.delete('/:id',
  verificarRol(['admin', 'jefe_obra']),
  validarEliminarTercero,
  captureOriginalData(Tercero),
  auditAction('Tercero', 'eliminar'),
  eliminarTercero
);

module.exports = router;