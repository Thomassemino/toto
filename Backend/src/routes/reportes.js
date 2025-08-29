const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra, filtrarObrasPorUsuario } = require('../middleware/rbac');
const { param } = require('express-validator');
const {
  obtenerCostosObra,
  obtenerFinanzasObra,
  obtenerDashboardGlobal
} = require('../controllers/reportes');

const validarObraId = [
  param('id').isMongoId().withMessage('ID de obra inválido')
];

router.use(auth);

router.get('/obras/:id/costos',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  obtenerCostosObra
);

router.get('/obras/:id/finanzas',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  obtenerFinanzasObra
);

router.get('/global/dashboard',
  verificarRol(['admin', 'jefe_obra', 'lectura']),
  filtrarObrasPorUsuario,
  obtenerDashboardGlobal
);

module.exports = router;