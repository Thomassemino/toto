const mongoose = require('mongoose');

const adjuntoSchema = new mongoose.Schema({
  entidad: { type: String, required: true },
  entidadId: { type: mongoose.Schema.Types.ObjectId, required: true },
  nombreArchivo: { type: String, required: true },
  url: { type: String, required: true },
  mime: { type: String, required: true },
  size: { type: Number, required: true },
  subidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

adjuntoSchema.index({ entidad: 1, entidadId: 1 });
adjuntoSchema.index({ subidoPor: 1 });

module.exports = mongoose.model('Adjunto', adjuntoSchema);