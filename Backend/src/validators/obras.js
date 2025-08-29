const { body, param } = require('express-validator');

const validarCrearObra = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['activa', 'finalizada'])
    .withMessage('Estado inválido'),
  
  body('fechaInicio')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de inicio inválida'),
  
  body('fechaFin')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de fin inválida'),
  
  body('moneda')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Moneda inválida'),
  
  body('etiquetas')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array'),
  
  body('etiquetas.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Cada etiqueta debe tener entre 1 y 50 caracteres'),
  
  body('cliente.nombre')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre del cliente es requerido y debe tener entre 2 y 200 caracteres'),
  
  body('cliente.contacto')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El contacto debe tener máximo 100 caracteres'),
  
  body('superficie_m2')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La superficie debe ser un número positivo'),
  
  body('presupuestoInicial')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número positivo'),
  
  body('config.avancePorHitos')
    .optional()
    .isBoolean()
    .withMessage('avancePorHitos debe ser un booleano')
];

const validarActualizarObra = [
  param('id')
    .isMongoId()
    .withMessage('ID de obra inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['activa', 'finalizada'])
    .withMessage('Estado inválido'),
  
  body('fechaInicio')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de inicio inválida'),
  
  body('fechaFin')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha de fin inválida'),
  
  body('avancePct')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El avance debe estar entre 0 y 100'),
  
  body('superficie_m2')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La superficie debe ser un número positivo')
];

const validarCambiarEstadoObra = [
  param('id')
    .isMongoId()
    .withMessage('ID de obra inválido'),
  
  body('estado')
    .isIn(['activa', 'finalizada'])
    .withMessage('Estado inválido'),
  
  body('motivo')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El motivo debe tener máximo 500 caracteres')
];

module.exports = {
  validarCrearObra,
  validarActualizarObra,
  validarCambiarEstadoObra
};