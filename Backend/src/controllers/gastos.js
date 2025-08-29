const Gasto = require('../models/gasto');
const Obra = require('../models/obra');
const { validationResult } = require('express-validator');

const obtenerGastos = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { page = 1, limit = 10, tipo, desde, hasta, proveedorId } = req.query;
    
    const filter = { obraId, deletedAt: null };
    
    if (tipo) filter.tipo = tipo;
    if (proveedorId) filter.proveedorId = proveedorId;
    
    if (desde || hasta) {
      filter.fecha = {};
      if (desde) filter.fecha.$gte = new Date(desde);
      if (hasta) filter.fecha.$lte = new Date(hasta);
    }

    const gastos = await Gasto.find(filter)
      .populate('creadoPor', 'nombre email')
      .populate('proveedorId', 'nombre tipo')
      .populate('contratistaId', 'nombre tipo')
      .populate('adjuntos')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    const total = await Gasto.countDocuments(filter);

    res.json({
      gastos,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener gastos', error: error.message });
  }
};

const crearGasto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const gastoData = {
      ...req.body,
      obraId,
      creadoPor: req.user._id
    };

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const gasto = new Gasto(gastoData);
    await gasto.save();

    const gastoPoblado = await Gasto.findById(gasto._id)
      .populate('creadoPor', 'nombre email')
      .populate('proveedorId', 'nombre tipo')
      .populate('contratistaId', 'nombre tipo')
      .populate('adjuntos');

    res.status(201).json({
      message: 'Gasto registrado exitosamente',
      data: gastoPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear gasto', error: error.message });
  }
};

const actualizarGasto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gastoId } = req.params;
    const updateData = req.body;

    const gasto = await Gasto.findOneAndUpdate(
      { _id: gastoId, deletedAt: null },
      updateData,
      { new: true }
    )
    .populate('creadoPor', 'nombre email')
    .populate('proveedorId', 'nombre tipo')
    .populate('contratistaId', 'nombre tipo')
    .populate('adjuntos');

    if (!gasto) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    res.json({
      message: 'Gasto actualizado exitosamente',
      data: gasto
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar gasto', error: error.message });
  }
};

const eliminarGasto = async (req, res) => {
  try {
    const { gastoId } = req.params;

    const gasto = await Gasto.findOneAndUpdate(
      { _id: gastoId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!gasto) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    res.json({ message: 'Gasto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar gasto', error: error.message });
  }
};

module.exports = {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto
};