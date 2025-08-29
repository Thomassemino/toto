const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { 
  validarCrearPago, 
  validarActualizarPago, 
  validarEliminarPago 
} = require('../validators/pagos');
const {
  obtenerPagos,
  crearPago,
  actualizarPago,
  eliminarPago
} = require('../controllers/pagos');
const Pago = require('../models/pago');

router.use(auth);

router.get('/:id/pagos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerPagos
);

router.post('/:id/pagos',
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarCrearPago,
  auditAction('Pago', 'crear'),
  crearPago
);

router.patch('/pagos/:pagoId',
  verificarRol(['admin', 'jefe_obra']),
  validarActualizarPago,
  captureOriginalData(Pago),
  auditAction('Pago', 'actualizar'),
  actualizarPago
);

router.delete('/pagos/:pagoId',
  verificarRol(['admin', 'jefe_obra']),
  validarEliminarPago,
  captureOriginalData(Pago),
  auditAction('Pago', 'eliminar'),
  eliminarPago
);

module.exports = router;