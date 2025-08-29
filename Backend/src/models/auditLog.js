const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  entidad: { type: String, required: true },
  entidadId: { type: mongoose.Schema.Types.ObjectId, required: true },
  accion: { type: String, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  diff: {
    antes: mongoose.Schema.Types.Mixed,
    despues: mongoose.Schema.Types.Mixed
  },
  ip: { type: String },
  userAgent: { type: String }
}, { timestamps: false });

auditLogSchema.index({ entidad: 1, entidadId: 1, fecha: -1 });
auditLogSchema.index({ usuarioId: 1, fecha: -1 });
auditLogSchema.index({ fecha: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);