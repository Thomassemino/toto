const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  tipo: { type: String, enum: ['materiales', 'mano_obra'], required: true },
  descripcion: { type: String, required: true, trim: true },
  monto: { type: mongoose.Schema.Types.Decimal128, required: true },
  fecha: { type: Date, default: Date.now },
  proveedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tercero' },
  contratistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tercero' },
  etiquetas: [{ type: String, trim: true }],
  adjuntos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Adjunto' }],
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

gastoSchema.index({ obraId: 1, fecha: -1 });
gastoSchema.index({ obraId: 1, tipo: 1 });
gastoSchema.index({ proveedorId: 1 });
gastoSchema.index({ contratistaId: 1 });
gastoSchema.index({ descripcion: 'text' });
gastoSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Gasto', gastoSchema);