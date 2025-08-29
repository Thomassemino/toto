const InventarioItem = require('../models/inventarioItem');
const MovimientoStock = require('../models/movimientoStock');
const Obra = require('../models/obra');
const { validationResult } = require('express-validator');

const obtenerItems = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const items = await InventarioItem.find({
      obraId,
      deletedAt: null
    })
    .populate('creadoPor', 'nombre email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ nombreItem: 1 });

    const total = await InventarioItem.countDocuments({
      obraId,
      deletedAt: null
    });

    res.json({
      items,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener items', error: error.message });
  }
};

const crearItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const itemData = {
      ...req.body,
      obraId,
      creadoPor: req.user._id
    };

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const item = new InventarioItem(itemData);
    await item.save();

    const itemPoblado = await InventarioItem.findById(item._id)
      .populate('creadoPor', 'nombre email');

    res.status(201).json({
      message: 'Item creado exitosamente',
      data: itemPoblado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ya existe un item con ese nombre en esta obra' 
      });
    }
    res.status(500).json({ message: 'Error al crear item', error: error.message });
  }
};

const actualizarItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId } = req.params;
    const updateData = req.body;

    const item = await InventarioItem.findOneAndUpdate(
      { _id: itemId, deletedAt: null },
      updateData,
      { new: true }
    ).populate('creadoPor', 'nombre email');

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    res.json({
      message: 'Item actualizado exitosamente',
      data: item
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar item', error: error.message });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await InventarioItem.findOneAndUpdate(
      { _id: itemId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    res.json({ message: 'Item eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar item', error: error.message });
  }
};

const obtenerMovimientos = async (req, res) => {
  try {
    const { id: obraId } = req.params;
    const { page = 1, limit = 20, tipo, desde, hasta } = req.query;
    
    const filter = { obraId, deletedAt: null };
    
    if (tipo) filter.tipo = tipo;
    
    if (desde || hasta) {
      filter.fecha = {};
      if (desde) filter.fecha.$gte = new Date(desde);
      if (hasta) filter.fecha.$lte = new Date(hasta);
    }

    const movimientos = await MovimientoStock.find(filter)
      .populate('itemId', 'nombreItem unidadMedida')
      .populate('creadoPor', 'nombre email')
      .populate('adjuntos')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    const total = await MovimientoStock.countDocuments(filter);

    res.json({
      movimientos,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
  }
};

const crearMovimiento = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: obraId } = req.params;
    const { itemId, tipo, cantidad, motivo } = req.body;

    const item = await InventarioItem.findOne({
      _id: itemId,
      obraId,
      deletedAt: null
    });

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    let nuevaCantidad = item.cantidadActual;
    if (tipo === 'ingreso' || tipo === 'ajuste') {
      nuevaCantidad += Math.abs(cantidad);
    } else if (tipo === 'egreso') {
      nuevaCantidad -= Math.abs(cantidad);
    }

    if (nuevaCantidad < 0) {
      return res.status(400).json({ 
        message: 'La operación resultaría en stock negativo' 
      });
    }

    const movimiento = new MovimientoStock({
      obraId,
      itemId,
      tipo,
      cantidad: tipo === 'egreso' ? -Math.abs(cantidad) : Math.abs(cantidad),
      motivo,
      creadoPor: req.user._id
    });

    await movimiento.save();

    item.cantidadActual = nuevaCantidad;
    await item.save();

    const movimientoPoblado = await MovimientoStock.findById(movimiento._id)
      .populate('itemId', 'nombreItem unidadMedida')
      .populate('creadoPor', 'nombre email')
      .populate('adjuntos');

    res.status(201).json({
      message: 'Movimiento registrado exitosamente',
      data: movimientoPoblado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear movimiento', error: error.message });
  }
};

const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await MovimientoStock.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    res.json({ message: 'Movimiento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar movimiento', error: error.message });
  }
};

module.exports = {
  obtenerItems,
  crearItem,
  actualizarItem,
  eliminarItem,
  obtenerMovimientos,
  crearMovimiento,
  eliminarMovimiento
};