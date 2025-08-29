const PresupuestoVersion = require('../models/presupuestoVersion');
const Obra = require('../models/obra');
const { validationResult } = require('express-validator');

const obtenerPresupuestos = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const presupuestos = await PresupuestoVersion.find({
      obraId,
      deletedAt: null
    })
    .populate('creadoPor', 'nombre email')
    .sort({ createdAt: -1 });

    res.json({ data: presupuestos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener presupuestos', error: error.message });
  }
};

const crearPresupuesto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const { monto, descripcion } = req.body;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const ultimaVersion = await PresupuestoVersion.findOne({
      obraId,
      deletedAt: null
    })
    .sort({ createdAt: -1 })
    .select('version');

    let nuevaVersion = 'v1';
    if (ultimaVersion) {
      const numeroVersion = parseInt(ultimaVersion.version.substring(1)) + 1;
      nuevaVersion = `v${numeroVersion}`;
    }

    await PresupuestoVersion.updateMany(
      { obraId, deletedAt: null },
      { vigente: false }
    );

    const presupuesto = new PresupuestoVersion({
      obraId,
      version: nuevaVersion,
      monto,
      descripcion,
      vigente: true,
      creadoPor: req.user._id
    });

    await presupuesto.save();

    await Obra.findByIdAndUpdate(obraId, { presupuestoVigente: monto });

    const presupuestoPoblado = await PresupuestoVersion.findById(presupuesto._id)
      .populate('creadoPor', 'nombre email');

    res.status(201).json({
      message: 'Presupuesto creado exitosamente',
      data: presupuestoPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear presupuesto', error: error.message });
  }
};

const marcarPresupuestoVigente = async (req, res) => {
  try {
    const { id: obraId, version } = req.params;

    const presupuesto = await PresupuestoVersion.findOne({
      obraId,
      version,
      deletedAt: null
    });

    if (!presupuesto) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    await PresupuestoVersion.updateMany(
      { obraId, deletedAt: null },
      { vigente: false }
    );

    presupuesto.vigente = true;
    await presupuesto.save();

    await Obra.findByIdAndUpdate(obraId, { 
      presupuestoVigente: presupuesto.monto 
    });

    res.json({
      message: 'Presupuesto marcado como vigente exitosamente',
      data: presupuesto
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar presupuesto vigente', error: error.message });
  }
};

const compararPresupuestos = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'Parámetros from y to son requeridos' });
    }

    const [presupuestoFrom, presupuestoTo] = await Promise.all([
      PresupuestoVersion.findOne({
        obraId,
        version: from,
        deletedAt: null
      }).populate('creadoPor', 'nombre email'),
      
      PresupuestoVersion.findOne({
        obraId,
        version: to,
        deletedAt: null
      }).populate('creadoPor', 'nombre email')
    ]);

    if (!presupuestoFrom || !presupuestoTo) {
      return res.status(404).json({ message: 'Una o ambas versiones no encontradas' });
    }

    const montoFrom = parseFloat(presupuestoFrom.monto.toString());
    const montoTo = parseFloat(presupuestoTo.monto.toString());
    const diferencia = montoTo - montoFrom;
    const porcentajeCambio = montoFrom > 0 ? ((diferencia / montoFrom) * 100) : 0;

    const comparacion = {
      versionAnterior: presupuestoFrom,
      versionNueva: presupuestoTo,
      diferencia: {
        monto: diferencia,
        porcentaje: porcentajeCambio.toFixed(2)
      }
    };

    res.json({ data: comparacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al comparar presupuestos', error: error.message });
  }
};

module.exports = {
  obtenerPresupuestos,
  crearPresupuesto,
  marcarPresupuestoVigente,
  compararPresupuestos
};