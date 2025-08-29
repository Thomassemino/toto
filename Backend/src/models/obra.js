const mongoose = require('mongoose');

const obraSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  estado: { 
    type: String, 
    enum: ['activa', 'finalizada'], 
    default: 'activa' 
  },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  moneda: { type: String, default: 'ARS' },
  etiquetas: [{ type: String, trim: true }],
  notas: { type: String },
  cliente: {
    nombre: { type: String, required: true },
    contacto: { type: String }
  },
  ubicacion: {
    ciudad: { type: String },
    provincia: { type: String },
    direccion: { type: String }
  },
  superficie_m2: { type: Number },
  presupuestoVigente: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  avancePct: { type: Number, min: 0, max: 100, default: 0 },
  config: {
    avancePorHitos: { type: Boolean, default: false }
  },
  deletedAt: { type: Date, default: null },
  creadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

obraSchema.index({ nombre: 'text' });
obraSchema.index({ estado: 1 });
obraSchema.index({ fechaInicio: -1 });
obraSchema.index({ creadaPor: 1 });

module.exports = mongoose.model('Obra', obraSchema);