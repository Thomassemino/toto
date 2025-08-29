const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verificarRol } = require('../middleware/rbac');
const { auditAction, captureOriginalData } = require('../middleware/audit');
const { 
  validarCrearUsuario, 
  validarActualizarUsuario, 
  validarEliminarUsuario 
} = require('../validators/usuarios');
const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarios');
const User = require('../models/user');

router.use(auth);
router.use(verificarRol(['admin']));

router.get('/', obtenerUsuarios);

router.post('/', 
  validarCrearUsuario,
  auditAction('Usuario', 'crear'),
  crearUsuario
);

router.patch('/:id', 
  validarActualizarUsuario,
  captureOriginalData(User),
  auditAction('Usuario', 'actualizar'),
  actualizarUsuario
);

router.delete('/:id', 
  validarEliminarUsuario,
  captureOriginalData(User),
  auditAction('Usuario', 'eliminar'),
  eliminarUsuario
);

module.exports = router;