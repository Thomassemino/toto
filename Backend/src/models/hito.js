const mongoose = require('mongoose');

const hitoSchema = new mongoose.Schema({
  obraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  pesoPct: { type: Number, min: 0, max: 100, default: 0 },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_proceso', 'completado'], 
    default: 'pendiente' 
  },
  fechaVencimiento: { type: Date },
  deletedAt: { type: Date, default: null },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

hitoSchema.index({ obraId: 1, estado: 1 });
hitoSchema.index({ obraId: 1, fechaVencimiento: 1 });
hitoSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Hito', hitoSchema);