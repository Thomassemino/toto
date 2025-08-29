const { body, param } = require('express-validator');

const validarCrearPago = [
  param('id')
    .isMongoId()
    .withMessage('ID de obra inválido'),
  
  body('monto')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('fechaRecepcion')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de recepción inválida'),
  
  body('metodo')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El método de pago es requerido y debe tener entre 2 y 100 caracteres'),
  
  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las observaciones deben tener máximo 500 caracteres')
];

const validarActualizarPago = [
  param('pagoId')
    .isMongoId()
    .withMessage('ID de pago inválido'),
  
  body('monto')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número positivo'),
  
  body('fechaRecepcion')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de recepción inválida'),
  
  body('metodo')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El método de pago debe tener entre 2 y 100 caracteres'),
  
  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las observaciones deben tener máximo 500 caracteres')
];

const validarEliminarPago = [
  param('pagoId')
    .isMongoId()
    .withMessage('ID de pago inválido')
];

module.exports = {
  validarCrearPago,
  validarActualizarPago,
  validarEliminarPago
};