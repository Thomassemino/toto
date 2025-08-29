const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { body, param } = require('express-validator');
const {
  obtenerHitos,
  crearHito,
  actualizarHito,
  eliminarHito
} = require('../controllers/hitos');
const Hito = require('../models/hito');

const validarCrearHito = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  body('titulo').trim().isLength({ min: 2, max: 200 }).withMessage('El título es requerido'),
  body('descripcion').optional().trim().isLength({ max: 1000 }).withMessage('La descripción es muy larga'),
  body('pesoPct').optional().isFloat({ min: 0, max: 100 }).withMessage('El peso debe estar entre 0 y 100'),
  body('estado').optional().isIn(['pendiente', 'en_proceso', 'completado']).withMessage('Estado inválido'),
  body('fechaVencimiento').optional().isISO8601().toDate().withMessage('Fecha de vencimiento inválida')
];

const validarActualizarHito = [
  param('hitoId').isMongoId().withMessage('ID de hito inválido'),
  body('titulo').optional().trim().isLength({ min: 2, max: 200 }).withMessage('El título debe tener entre 2 y 200 caracteres'),
  body('descripcion').optional().trim().isLength({ max: 1000 }).withMessage('La descripción es muy larga'),
  body('pesoPct').optional().isFloat({ min: 0, max: 100 }).withMessage('El peso debe estar entre 0 y 100'),
  body('estado').optional().isIn(['pendiente', 'en_proceso', 'completado']).withMessage('Estado inválido'),
  body('fechaVencimiento').optional().isISO8601().toDate().withMessage('Fecha de vencimiento inválida')
];

router.use(auth);

router.get('/:id/hitos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerHitos
);

router.post('/:id/hitos',
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarCrearHito,
  auditAction('Hito', 'crear'),
  crearHito
);

router.patch('/hitos/:hitoId',
  verificarRol(['admin', 'jefe_obra']),
  validarActualizarHito,
  captureOriginalData(Hito),
  auditAction('Hito', 'actualizar'),
  actualizarHito
);

router.delete('/hitos/:hitoId',
  verificarRol(['admin', 'jefe_obra']),
  captureOriginalData(Hito),
  auditAction('Hito', 'eliminar'),
  eliminarHito
);

module.exports = router;