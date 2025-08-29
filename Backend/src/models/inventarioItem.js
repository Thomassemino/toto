const mongoose = require('mongoose');

const inventarioItemSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  nombreItem: { type: String, required: true, trim: true },
  cantidadActual: { type: Number, required: true, min: 0, default: 0 },
  stockMinimo: { type: Number, min: 0, default: 0 },
  unidadMedida: { type: String, default: 'unidades' },
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

inventarioItemSchema.index({ obraId: 1, nombreItem: 1 }, { unique: true });
inventarioItemSchema.index({ nombreItem: 'text' });
inventarioItemSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('InventarioItem', inventarioItemSchema);