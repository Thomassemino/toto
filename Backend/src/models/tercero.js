const mongoose = require('mongoose');

const terceroSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  cuit: { type: String, trim: true },
  email: { type: String, trim: true },
  telefono: { type: String, trim: true },
  tipo: { 
    type: String, 
    enum: ['proveedor', 'contratista', 'cuadrilla'], 
    required: true 
  },
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

terceroSchema.index({ nombre: 'text' });
terceroSchema.index({ tipo: 1 });
terceroSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Tercero', terceroSchema);