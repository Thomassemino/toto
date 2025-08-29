const mongoose = require('mongoose');

const movimientoStockSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventarioItem', required: true },
  tipo: { 
    type: String, 
    enum: ['ingreso', 'egreso', 'ajuste'], 
    required: true 
  },
  cantidad: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  motivo: { type: String, trim: true },
  adjuntos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Adjunto' }],
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

movimientoStockSchema.index({ obraId: 1, fecha: -1 });
movimientoStockSchema.index({ itemId: 1, fecha: -1 });
movimientoStockSchema.index({ tipo: 1 });
movimientoStockSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('MovimientoStock', movimientoStockSchema);