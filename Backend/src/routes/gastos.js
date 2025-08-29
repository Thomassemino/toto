const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { 
  validarCrearGasto, 
  validarActualizarGasto, 
  validarEliminarGasto 
} = require('../validators/gastos');
const {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto
} = require('../controllers/gastos');
const Gasto = require('../models/gasto');

router.use(auth);

router.get('/:id/gastos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerGastos
);

router.post('/:id/gastos',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  verificarAccesoObra,
  validarCrearGasto,
  auditAction('Gasto', 'crear'),
  crearGasto
);

router.patch('/gastos/:gastoId',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  validarActualizarGasto,
  captureOriginalData(Gasto),
  auditAction('Gasto', 'actualizar'),
  actualizarGasto
);

router.delete('/gastos/:gastoId',
  verificarRol(['admin', 'jefe_obra']),
  validarEliminarGasto,
  captureOriginalData(Gasto),
  auditAction('Gasto', 'eliminar'),
  eliminarGasto
);

module.exports = router;