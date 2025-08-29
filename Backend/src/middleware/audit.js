const AuditLog = require('../models/auditLog');

const auditAction = (entidad, accion) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseData = null;
    let statusCode = null;

    res.send = function(data) {
      responseData = data;
      statusCode = this.statusCode;
      return originalSend.call(this, data);
    };

    res.json = function(data) {
      responseData = data;
      statusCode = this.statusCode;
      return originalJson.call(this, data);
    };

    res.on('finish', async () => {
      try {
        if (statusCode >= 200 && statusCode < 300 && req.user) {
          const entidadId = req.params.id || req.body._id || 
                           (responseData && typeof responseData === 'object' && responseData.data && responseData.data._id);

          if (entidadId) {
            await AuditLog.create({
              entidad,
              entidadId,
              accion,
              usuarioId: req.user._id,
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.get('User-Agent'),
              diff: {
                antes: req.originalData || null,
                despues: req.body || null
              }
            });
          }
        }
      } catch (error) {
        console.error('Error en auditoría:', error);
      }
    });

    next();
  };
};

const captureOriginalData = (Model) => {
  return async (req, res, next) => {
    try {
      if (req.params.id) {
        const original = await Model.findById(req.params.id);
        req.originalData = original ? original.toObject() : null;
      }
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = {
  auditAction,
  captureOriginalData
};