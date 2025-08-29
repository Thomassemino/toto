const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol } = require('../middleware/rbac');
const { query } = require('express-validator');
const {
  obtenerAuditoria
} = require('../controllers/auditoria');

const validarConsultaAuditoria = [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('entidad').optional().trim().isLength({ min: 1 }).withMessage('La entidad no puede estar vacía'),
  query('entidadId').optional().isMongoId().withMessage('ID de entidad inválido'),
  query('usuarioId').optional().isMongoId().withMessage('ID de usuario inválido'),
  query('desde').optional().isISO8601().toDate().withMessage('Fecha desde inválida'),
  query('hasta').optional().isISO8601().toDate().withMessage('Fecha hasta inválida')
];

router.use(auth);
router.use(verificarRol(['admin']));

router.get('/',
  validarConsultaAuditoria,
  obtenerAuditoria
);

module.exports = router;