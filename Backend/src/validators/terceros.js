const { body, param } = require('express-validator');

const validarCrearTercero = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre es requerido y debe tener entre 2 y 200 caracteres'),
  
  body('cuit')
    .optional()
    .trim()
    .matches(/^\d{2}-?\d{8}-?\d{1}$/)
    .withMessage('CUIT inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono debe tener máximo 20 caracteres'),
  
  body('tipo')
    .isIn(['proveedor', 'contratista', 'cuadrilla'])
    .withMessage('El tipo debe ser proveedor, contratista o cuadrilla')
];

const validarActualizarTercero = [
  param('id')
    .isMongoId()
    .withMessage('ID de tercero inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('cuit')
    .optional()
    .trim()
    .matches(/^\d{2}-?\d{8}-?\d{1}$/)
    .withMessage('CUIT inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono debe tener máximo 20 caracteres'),
  
  body('tipo')
    .optional()
    .isIn(['proveedor', 'contratista', 'cuadrilla'])
    .withMessage('El tipo debe ser proveedor, contratista o cuadrilla')
];

const validarEliminarTercero = [
  param('id')
    .isMongoId()
    .withMessage('ID de tercero inválido')
];

module.exports = {
  validarCrearTercero,
  validarActualizarTercero,
  validarEliminarTercero
};