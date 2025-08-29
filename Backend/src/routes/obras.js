const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol, verificarAccesoObra, filtrarObrasPorUsuario } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { 
  validarCrearObra, 
  validarActualizarObra, 
  validarCambiarEstadoObra 
} = require('../validators/obras');
const {
  obtenerObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  eliminarObra,
  cambiarEstadoObra,
  obtenerResumenObra
} = require('../controllers/obras');
const Obra = require('../models/obra');

router.use(auth);

router.get('/', 
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  filtrarObrasPorUsuario,
  obtenerObras
);

router.post('/', 
  verificarRol(['admin']),
  validarCrearObra,
  auditAction('Obra', 'crear'),
  crearObra
);

router.get('/:id', 
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerObra
);

router.patch('/:id', 
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarActualizarObra,
  captureOriginalData(Obra),
  auditAction('Obra', 'actualizar'),
  actualizarObra
);

router.delete('/:id', 
  verificarRol(['admin']),
  captureOriginalData(Obra),
  auditAction('Obra', 'eliminar'),
  eliminarObra
);

router.patch('/:id/estado', 
  verificarRol(['admin', 'jefe_obra']),
  verificarAccesoObra,
  validarCambiarEstadoObra,
  captureOriginalData(Obra),
  auditAction('Obra', 'cambiar_estado'),
  cambiarEstadoObra
);

router.get('/:id/resumen', 
  verificarRol(['admin', 'jefe_obra', 'deposito', 'lectura']),
  verificarAccesoObra,
  obtenerResumenObra
);

module.exports = router;