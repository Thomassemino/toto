const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const obtenerUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, rol } = req.query;
    const filter = { deletedAt: null };
    
    if (rol) filter.rol = rol;

    const usuarios = await User.find(filter)
      .select('-password')
      .populate('obrasAsignadas', 'nombre')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      usuarios,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nombre, rol, obrasAsignadas } = req.body;

    const usuarioExistente = await User.findOne({ email, deletedAt: null });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const usuario = new User({
      email,
      password,
      nombre,
      rol,
      obrasAsignadas: obrasAsignadas || []
    });

    await usuario.save();

    const usuarioRespuesta = await User.findById(usuario._id)
      .select('-password')
      .populate('obrasAsignadas', 'nombre');

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      data: usuarioRespuesta 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, password, nombre, rol, obrasAsignadas, activo } = req.body;

    const usuario = await User.findOne({ _id: id, deletedAt: null });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (email && email !== usuario.email) {
      const emailExiste = await User.findOne({ email, deletedAt: null, _id: { $ne: id } });
      if (emailExiste) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
      usuario.email = email;
    }

    if (password) {
      usuario.password = password;
    }
    
    if (nombre) usuario.nombre = nombre;
    if (rol) usuario.rol = rol;
    if (obrasAsignadas !== undefined) usuario.obrasAsignadas = obrasAsignadas;
    if (activo !== undefined) usuario.activo = activo;

    await usuario.save();

    const usuarioActualizado = await User.findById(usuario._id)
      .select('-password')
      .populate('obrasAsignadas', 'nombre');

    res.json({ 
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findOne({ _id: id, deletedAt: null });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.deletedAt = new Date();
    await usuario.save();

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};