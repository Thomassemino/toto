const User = require('../models/user');
const Obra = require('../models/obra');

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    next();
  };
};

const verificarAccesoObra = async (req, res, next) => {
  try {
    const { id: obraId } = req.params;
    const usuario = req.user;

    if (usuario.rol === 'admin') {
      return next();
    }

    if (usuario.rol === 'jefe_obra') {
      const obraAsignada = usuario.obrasAsignadas.some(
        obra => obra.toString() === obraId
      );
      
      if (!obraAsignada) {
        return res.status(403).json({ 
          message: 'No tienes acceso a esta obra' 
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar acceso a obra', error: error.message });
  }
};

const verificarAccesoObraFromBody = async (req, res, next) => {
  try {
    const { obraId } = req.body;
    const usuario = req.user;

    if (!obraId) {
      return res.status(400).json({ message: 'obraId requerido' });
    }

    if (usuario.rol === 'admin') {
      return next();
    }

    if (usuario.rol === 'jefe_obra') {
      const obraAsignada = usuario.obrasAsignadas.some(
        obra => obra.toString() === obraId
      );
      
      if (!obraAsignada) {
        return res.status(403).json({ 
          message: 'No tienes acceso a esta obra' 
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar acceso a obra', error: error.message });
  }
};

const filtrarObrasPorUsuario = async (req, res, next) => {
  try {
    const usuario = req.user;

    if (usuario.rol === 'admin') {
      return next();
    }

    if (usuario.rol === 'jefe_obra') {
      req.filtroObras = { _id: { $in: usuario.obrasAsignadas } };
    } else {
      req.filtroObras = {};
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al filtrar obras', error: error.message });
  }
};

module.exports = {
  verificarRol,
  verificarAccesoObra,
  verificarAccesoObraFromBody,
  filtrarObrasPorUsuario
};