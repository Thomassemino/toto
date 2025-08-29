const { body, param } = require('express-validator');

const validarCrearUsuario = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('rol')
    .isIn(['admin', 'jefe_obra', 'deposito', 'lectura'])
    .withMessage('Rol inválido'),
  
  body('obrasAsignadas')
    .optional()
    .isArray()
    .withMessage('obrasAsignadas debe ser un array'),
  
  body('obrasAsignadas.*')
    .optional()
    .isMongoId()
    .withMessage('ID de obra inválido')
];

const validarActualizarUsuario = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('rol')
    .optional()
    .isIn(['admin', 'jefe_obra', 'deposito', 'lectura'])
    .withMessage('Rol inválido'),
  
  body('obrasAsignadas')
    .optional()
    .isArray()
    .withMessage('obrasAsignadas debe ser un array'),
  
  body('obrasAsignadas.*')
    .optional()
    .isMongoId()
    .withMessage('ID de obra inválido'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('activo debe ser un booleano')
];

const validarEliminarUsuario = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido')
];

module.exports = {
  validarCrearUsuario,
  validarActualizarUsuario,
  validarEliminarUsuario
};