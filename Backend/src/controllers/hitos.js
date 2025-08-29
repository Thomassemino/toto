const Hito = require('../models/hito');
const Obra = require('../models/obra');
const { validationResult } = require('express-validator');

const obtenerHitos = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { estado } = req.query;

    const filter = { obraId, deletedAt: null };
    if (estado) filter.estado = estado;

    const hitos = await Hito.find(filter)
      .populate('creadoPor', 'nombre email')
      .sort({ fechaVencimiento: 1, createdAt: 1 });

    res.json({ data: hitos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener hitos', error: error.message });
  }
};

const crearHito = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const hitoData = {
      ...req.body,
      obraId,
      creadoPor: req.user._id
    };

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const hito = new Hito(hitoData);
    await hito.save();

    const hitoPoblado = await Hito.findById(hito._id)
      .populate('creadoPor', 'nombre email');

    res.status(201).json({
      message: 'Hito creado exitosamente',
      data: hitoPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear hito', error: error.message });
  }
};

const actualizarHito = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { hitoId } = req.params;
    const updateData = req.body;

    const hito = await Hito.findOneAndUpdate(
      { _id: hitoId, deletedAt: null },
      updateData,
      { new: true }
    ).populate('creadoPor', 'nombre email');

    if (!hito) {
      return res.status(404).json({ message: 'Hito no encontrado' });
    }

    if (updateData.estado === 'completado') {
      await actualizarAvanceObra(hito.obraId);
    }

    res.json({
      message: 'Hito actualizado exitosamente',
      data: hito
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar hito', error: error.message });
  }
};

const eliminarHito = async (req, res) => {
  try {
    const { hitoId } = req.params;

    const hito = await Hito.findOneAndUpdate(
      { _id: hitoId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!hito) {
      return res.status(404).json({ message: 'Hito no encontrado' });
    }

    await actualizarAvanceObra(hito.obraId);

    res.json({ message: 'Hito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar hito', error: error.message });
  }
};

const actualizarAvanceObra = async (obraId) => {
  try {
    const obra = await Obra.findById(obraId);
    if (!obra || !obra.config.avancePorHitos) return;

    const hitos = await Hito.find({
      obraId,
      deletedAt: null
    });

    const totalPeso = hitos.reduce((sum, hito) => sum + hito.pesoPct, 0);
    const pesoCompletado = hitos
      .filter(hito => hito.estado === 'completado')
      .reduce((sum, hito) => sum + hito.pesoPct, 0);

    const avancePct = totalPeso > 0 ? Math.round((pesoCompletado / totalPeso) * 100) : 0;

    await Obra.findByIdAndUpdate(obraId, { avancePct });
  } catch (error) {
    console.error('Error actualizando avance de obra:', error);
  }
};

module.exports = {
  obtenerHitos,
  crearHito,
  actualizarHito,
  eliminarHito
};