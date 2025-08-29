const Obra = require('../models/obra');
const PresupuestoVersion = require('../models/presupuestoVersion');
const Pago = require('../models/pago');
const Gasto = require('../models/gasto');
const InventarioItem = require('../models/inventarioItem');
const Hito = require('../models/hito');
const { validationResult } = require('express-validator');

const obtenerObras = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, q, etiquetas, desde, hasta } = req.query;
    const filter = { deletedAt: null, ...req.filtroObras };
    
    if (estado) filter.estado = estado;
    if (q) filter.$text = { $search: q };
    if (etiquetas) filter.etiquetas = { $in: etiquetas.split(',') };
    if (desde || hasta) {
      filter.createdAt = {};
      if (desde) filter.createdAt.$gte = new Date(desde);
      if (hasta) filter.createdAt.$lte = new Date(hasta);
    }

    const obras = await Obra.find(filter)
      .populate('creadaPor', 'nombre email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Obra.countDocuments(filter);

    res.json({
      obras,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener obras', error: error.message });
  }
};

const obtenerObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findOne({ _id: id, deletedAt: null })
      .populate('creadaPor', 'nombre email');

    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    res.json({ data: obra });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener obra', error: error.message });
  }
};

const crearObra = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const obraData = {
      ...req.body,
      creadaPor: req.user._id
    };

    const obra = new Obra(obraData);
    await obra.save();

    if (req.body.presupuestoInicial) {
      const presupuesto = new PresupuestoVersion({
        obraId: obra._id,
        version: 'v1',
        monto: req.body.presupuestoInicial,
        vigente: true,
        descripcion: 'Presupuesto inicial',
        creadoPor: req.user._id
      });
      await presupuesto.save();

      obra.presupuestoVigente = req.body.presupuestoInicial;
      await obra.save();
    }

    const obraPoblada = await Obra.findById(obra._id)
      .populate('creadaPor', 'nombre email');

    res.status(201).json({ 
      message: 'Obra creada exitosamente',
      data: obraPoblada 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear obra', error: error.message });
  }
};

const actualizarObra = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const obra = await Obra.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateData,
      { new: true }
    ).populate('creadaPor', 'nombre email');

    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    res.json({ 
      message: 'Obra actualizada exitosamente',
      data: obra 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar obra', error: error.message });
  }
};

const eliminarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    res.json({ message: 'Obra eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar obra', error: error.message });
  }
};

const cambiarEstadoObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, motivo } = req.body;

    if (!['activa', 'finalizada'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const obra = await Obra.findOne({ _id: id, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    obra.estado = estado;
    if (motivo) {
      obra.notas = (obra.notas || '') + `\n[${new Date().toISOString()}] Cambio estado a ${estado}: ${motivo}`;
    }

    await obra.save();

    res.json({ 
      message: `Obra ${estado} exitosamente`,
      data: obra 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado de obra', error: error.message });
  }
};

const obtenerResumenObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findOne({ _id: id, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const [pagos, gastos, stockBajo] = await Promise.all([
      Pago.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { $group: { _id: null, totalPagado: { $sum: { $toDouble: '$monto' } } } }
      ]),
      
      Gasto.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { 
          $group: { 
            _id: '$tipo', 
            total: { $sum: { $toDouble: '$monto' } } 
          } 
        }
      ]),
      
      InventarioItem.find({
        obraId: obra._id,
        deletedAt: null,
        $expr: { $lte: ['$cantidadActual', '$stockMinimo'] }
      }).select('nombreItem cantidadActual stockMinimo')
    ]);

    const totalPagado = pagos[0]?.totalPagado || 0;
    const presupuestoVigente = parseFloat(obra.presupuestoVigente?.toString() || '0');
    const saldo = presupuestoVigente - totalPagado;

    const gastosMateriales = gastos.find(g => g._id === 'materiales')?.total || 0;
    const gastosManoObra = gastos.find(g => g._id === 'mano_obra')?.total || 0;
    const totalGastado = gastosMateriales + gastosManoObra;

    const resumen = {
      obra: {
        nombre: obra.nombre,
        estado: obra.estado,
        avancePct: obra.avancePct
      },
      finanzas: {
        presupuestoVigente,
        totalPagado,
        saldo,
        totalGastado,
        gastosMateriales,
        gastosManoObra
      },
      alertas: {
        stockBajo: stockBajo.length,
        itemsStockBajo: stockBajo
      }
    };

    res.json({ data: resumen });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener resumen de obra', error: error.message });
  }
};

module.exports = {
  obtenerObras,
  obtenerObra,
  crearObra,
  actualizarObra,
  eliminarObra,
  cambiarEstadoObra,
  obtenerResumenObra
};