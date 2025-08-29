const mongoose = require('mongoose');

const presupuestoVersionSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  version: { type: String, required: true },
  monto: { type: mongoose.Schema.Types.Decimal128, required: true },
  vigente: { type: Boolean, default: false },
  descripcion: { type: String },
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

presupuestoVersionSchema.index({ obraId: 1, version: 1 }, { unique: true });
presupuestoVersionSchema.index({ obraId: 1, vigente: 1 });

module.exports = mongoose.model('PresupuestoVersion', presupuestoVersionSchema);