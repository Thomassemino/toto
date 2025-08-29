const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra } = require('../middleware/rbac');
const { param } = require('express-validator');
const {
  exportarResumenPDF,
  exportarGastosExcel,
  exportarPagosExcel,
  exportarInventarioExcel
} = require('../controllers/export');

const validarObraId = [
  param('id').isMongoId().withMessage('ID de obra inválido')
];

router.use(auth);

router.get('/obras/:id/resumen.pdf',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  exportarResumenPDF
);

router.get('/obras/:id/gastos.xlsx',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  exportarGastosExcel
);

router.get('/obras/:id/pagos.xlsx',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  exportarPagosExcel
);

router.get('/obras/:id/inventario.xlsx',
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  validarObraId,
  exportarInventarioExcel
);

module.exports = router;