const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { auditAction } = require('../middleware/audit');
const { body, param, query } = require('express-validator');
const {
  obtenerPresupuestos,
  crearPresupuesto,
  marcarPresupuestoVigente,
  compararPresupuestos
} = require('../controllers/presupuestos');

const validarCrearPresupuesto = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  body('monto').isFloat({ min: 0.01 }).withMessage('El monto debe ser un número positivo'),
  body('descripcion').optional().trim().isLength({ max: 500 }).withMessage('La descripción debe tener máximo 500 caracteres')
];

const validarMarcarVigente = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  param('version').matches(/^v\d+$/).withMessage('Versión inválida')
];

const validarComparar = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  query('from').matches(/^v\d+$/).withMessage('Versión from inválida'),
  query('to').matches(/^v\d+$/).withMessage('Versión to inválida')
];

router.use(auth);

router.get('/:id/presupuestos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerPresupuestos
);

router.post('/:id/presupuestos',
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarCrearPresupuesto,
  auditAction('PresupuestoVersion', 'crear'),
  crearPresupuesto
);

router.patch('/:id/presupuestos/:version',
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarMarcarVigente,
  auditAction('PresupuestoVersion', 'marcar_vigente'),
  marcarPresupuestoVigente
);

router.get('/:id/presupuestos/compare',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarComparar,
  compararPresupuestos
);

module.exports = router;