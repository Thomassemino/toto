const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  monto: { type: mongoose.Schema.Types.Decimal128, required: true },
  fechaRecepcion: { type: Date, default: Date.now },
  metodo: { type: String, required: true },
  observaciones: { type: String },
  adjuntos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Adjunto' }],
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

pagoSchema.index({ obraId: 1, fechaRecepcion: -1 });
pagoSchema.index({ obraId: 1, metodo: 1 });
pagoSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Pago', pagoSchema);