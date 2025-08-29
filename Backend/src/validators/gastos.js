const { body, param } = require('express-validator');

const validarCrearGasto = [
  param('id')
    .isMongoId()
    .withMessage('ID de obra inválido'),
  
  body('tipo')
    .isIn(['materiales', 'mano_obra'])
    .withMessage('El tipo debe ser materiales o mano_obra'),
  
  body('descripcion')
    .trim()
    .isLength({ min: 2, max: 300 })
    .withMessage('La descripción es requerida y debe tener entre 2 y 300 caracteres'),
  
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('fecha')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha inválida'),
  
  body('proveedorId')
    .optional()
    .isMongoId()
    .withMessage('ID de proveedor inválido'),
  
  body('contratistaId')
    .optional()
    .isMongoId()
    .withMessage('ID de contratista inválido'),
  
  body('etiquetas')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array'),
  
  body('etiquetas.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada etiqueta debe tener entre 1 y 50 caracteres')
];

const validarActualizarGasto = [
  param('gastoId')
    .isMongoId()
    .withMessage('ID de gasto inválido'),
  
  body('tipo')
    .optional()
    .isIn(['materiales', 'mano_obra'])
    .withMessage('El tipo debe ser materiales o mano_obra'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ min: 2, max: 300 })
    .withMessage('La descripción debe tener entre 2 y 300 caracteres'),
  
  body('monto')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('fecha')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha inválida'),
  
  body('proveedorId')
    .optional()
    .isMongoId()
    .withMessage('ID de proveedor inválido'),
  
  body('contratistaId')
    .optional()
    .isMongoId()
    .withMessage('ID de contratista inválido')
];

const validarEliminarGasto = [
  param('gastoId')
    .isMongoId()
    .withMessage('ID de gasto inválido')
];

module.exports = {
  validarCrearGasto,
  validarActualizarGasto,
  validarEliminarGasto
};