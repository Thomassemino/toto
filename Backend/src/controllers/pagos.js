const Pago = require('../models/pago');
const Obra = require('../models/obra');
const { validationResult } = require('express-validator');

const obtenerPagos = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { page = 1, limit = 10, desde, hasta, metodo } = req.query;
    
    const filter = { obraId, deletedAt: null };
    
    if (desde || hasta) {
      filter.fechaRecepcion = {};
      if (desde) filter.fechaRecepcion.$gte = new Date(desde);
      if (hasta) filter.fechaRecepcion.$lte = new Date(hasta);
    }
    
    if (metodo) filter.metodo = metodo;

    const pagos = await Pago.find(filter)
      .populate('creadoPor', 'nombre email')
      .populate('adjuntos')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fechaRecepcion: -1 });

    const total = await Pago.countDocuments(filter);

    res.json({
      pagos,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
  }
};

const crearPago = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const { monto, fechaRecepcion, metodo, observaciones } = req.body;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const pago = new Pago({
      obraId,
      monto,
      fechaRecepcion: fechaRecepcion || new Date(),
      metodo,
      observaciones,
      creadoPor: req.user._id
    });

    await pago.save();

    const pagoPoblado = await Pago.findById(pago._id)
      .populate('creadoPor', 'nombre email')
      .populate('adjuntos');

    res.status(201).json({
      message: 'Pago registrado exitosamente',
      data: pagoPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pago', error: error.message });
  }
};

const actualizarPago = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pagoId } = req.params;
    const updateData = req.body;

    const pago = await Pago.findOneAndUpdate(
      { _id: pagoId, deletedAt: null },
      updateData,
      { new: true }
    )
    .populate('creadoPor', 'nombre email')
    .populate('adjuntos');

    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({
      message: 'Pago actualizado exitosamente',
      data: pago
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pago', error: error.message });
  }
};

const eliminarPago = async (req, res) => {
  try {
    const { pagoId } = req.params;

    const pago = await Pago.findOneAndUpdate(
      { _id: pagoId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json({ message: 'Pago eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar pago', error: error.message });
  }
};

module.exports = {
  obtenerPagos,
  crearPago,
  actualizarPago,
  eliminarPago
};