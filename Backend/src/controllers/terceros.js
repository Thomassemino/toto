const Tercero = require('../models/tercero');
const { validationResult } = require('express-validator');

const obtenerTerceros = async (req, res) => {
  try {
    const { page = 1, limit = 10, tipo, q } = req.query;
    const filter = { deletedAt: null };
    
    if (tipo) filter.tipo = tipo;
    if (q) filter.$text = { $search: q };

    const terceros = await Tercero.find(filter)
      .populate('creadoPor', 'nombre email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ nombre: 1 });

    const total = await Tercero.countDocuments(filter);

    res.json({
      terceros,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener terceros', error: error.message });
  }
};

const crearTercero = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const terceroData = {
      ...req.body,
      creadoPor: req.user._id
    };

    const tercero = new Tercero(terceroData);
    await tercero.save();

    const terceroPoblado = await Tercero.findById(tercero._id)
      .populate('creadoPor', 'nombre email');

    res.status(201).json({
      message: 'Tercero creado exitosamente',
      data: terceroPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tercero', error: error.message });
  }
};

const actualizarTercero = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const tercero = await Tercero.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true }
    ).populate('creadoPor', 'nombre email');

    if (!tercero) {
      return res.status(404).json({ message: 'Tercero no encontrado' });
    }

    res.json({
      message: 'Tercero actualizado exitosamente',
      data: tercero
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tercero', error: error.message });
  }
};

const eliminarTercero = async (req, res) => {
  try {
    const { id } = req.params;

    const tercero = await Tercero.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!tercero) {
      return res.status(404).json({ message: 'Tercero no encontrado' });
    }

    res.json({ message: 'Tercero eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tercero', error: error.message });
  }
};

module.exports = {
  obtenerTerceros,
  crearTercero,
  actualizarTercero,
  eliminarTercero
};