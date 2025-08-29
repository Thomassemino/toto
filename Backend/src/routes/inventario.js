const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { body, param } = require('express-validator');
const {
  obtenerItems,
  crearItem,
  actualizarItem,
  eliminarItem,
  obtenerMovimientos,
  crearMovimiento,
  eliminarMovimiento
} = require('../controllers/inventario');
const InventarioItem = require('../models/inventarioItem');
const MovimientoStock = require('../models/movimientoStock');

const validarCrearItem = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  body('nombreItem').trim().isLength({ min: 2, max: 200 }).withMessage('El nombre del item es requerido'),
  body('cantidadActual').optional().isFloat({ min: 0 }).withMessage('La cantidad debe ser positiva'),
  body('stockMinimo').optional().isFloat({ min: 0 }).withMessage('El stock mínimo debe ser positivo'),
  body('unidadMedida').optional().trim().isLength({ max: 50 }).withMessage('La unidad de medida es inválida')
];

const validarCrearMovimiento = [
  param('id').isMongoId().withMessage('ID de obra inválido'),
  body('itemId').isMongoId().withMessage('ID de item inválido'),
  body('tipo').isIn(['ingreso', 'egreso', 'ajuste']).withMessage('Tipo de movimiento inválido'),
  body('cantidad').isFloat({ min: 0.01 }).withMessage('La cantidad debe ser positiva'),
  body('motivo').optional().trim().isLength({ max: 500 }).withMessage('El motivo es muy largo')
];

router.use(auth);

router.get('/:id/inventario/items',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerItems
);

router.post('/:id/inventario/items',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  verificarAccesoObra,
  validarCrearItem,
  auditAction('InventarioItem', 'crear'),
  crearItem
);

router.patch('/inventario/items/:itemId',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  captureOriginalData(InventarioItem),
  auditAction('InventarioItem', 'actualizar'),
  actualizarItem
);

router.delete('/inventario/items/:itemId',
  verificarRol(['admin', 'jefe_obra']),
  captureOriginalData(InventarioItem),
  auditAction('InventarioItem', 'eliminar'),
  eliminarItem
);

router.get('/:id/inventario/movimientos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerMovimientos
);

router.post('/:id/inventario/movimientos',
  verificarRol(['admin', 'jefe_obra', 'deposito']),
  verificarAccesoObra,
  validarCrearMovimiento,
  auditAction('MovimientoStock', 'crear'),
  crearMovimiento
);

router.delete('/inventario/movimientos/:id',
  verificarRol(['admin', 'jefe_obra']),
  captureOriginalData(MovimientoStock),
  auditAction('MovimientoStock', 'eliminar'),
  eliminarMovimiento
);

module.exports = router;