const AuditLog = require('../models/auditLog');

const obtenerAuditoria = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      entidad, 
      entidadId, 
      usuarioId, 
      desde, 
      hasta 
    } = req.query;

    const filter = {};
    
    if (entidad) filter.entidad = entidad;
    if (entidadId) filter.entidadId = entidadId;
    if (usuarioId) filter.usuarioId = usuarioId;
    
    if (desde || hasta) {
      filter.fecha = {};
      if (desde) filter.fecha.$gte = new Date(desde);
      if (hasta) filter.fecha.$lte = new Date(hasta);
    }

    const logs = await AuditLog.find(filter)
      .populate('usuarioId', 'nombre email rol')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fecha: -1 });

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      totalPaginas: Math.ceil(total / limit),
      paginaActual: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logs de auditoría', error: error.message });
  }
};

module.exports = {
  obtenerAuditoria
};