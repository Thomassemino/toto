const Obra = require('../models/obra');
const Gasto = require('../models/gasto');
const Pago = require('../models/pago');
const InventarioItem = require('../models/inventarioItem');

const obtenerCostosObra = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const costos = await Gasto.aggregate([
      { $match: { obraId: obra._id, deletedAt: null } },
      { 
        $group: { 
          _id: '$tipo',
          totalGasto: { $sum: { $toDouble: '$monto' } },
          cantidadTransacciones: { $sum: 1 }
        } 
      }
    ]);

    const totalGastado = costos.reduce((sum, costo) => sum + costo.totalGasto, 0);

    res.json({
      data: {
        obra: {
          nombre: obra.nombre,
          presupuestoVigente: parseFloat(obra.presupuestoVigente?.toString() || '0')
        },
        costosPorCategoria: costos,
        totalGastado,
        porcentajePresupuesto: obra.presupuestoVigente > 0 
          ? ((totalGastado / parseFloat(obra.presupuestoVigente.toString())) * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener costos', error: error.message });
  }
};

const obtenerFinanzasObra = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const [pagosResult, gastosResult] = await Promise.all([
      Pago.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { 
          $group: { 
            _id: null, 
            totalPagado: { $sum: { $toDouble: '$monto' } },
            cantidadPagos: { $sum: 1 }
          } 
        }
      ]),
      
      Gasto.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { 
          $group: { 
            _id: null, 
            totalGastado: { $sum: { $toDouble: '$monto' } },
            cantidadGastos: { $sum: 1 }
          } 
        }
      ])
    ]);

    const presupuestoVigente = parseFloat(obra.presupuestoVigente?.toString() || '0');
    const totalPagado = pagosResult[0]?.totalPagado || 0;
    const totalGastado = gastosResult[0]?.totalGastado || 0;
    const saldo = presupuestoVigente - totalPagado;
    const margenDisponible = totalPagado - totalGastado;

    res.json({
      data: {
        obra: {
          nombre: obra.nombre,
          avancePct: obra.avancePct
        },
        finanzas: {
          presupuestoVigente,
          totalPagado,
          totalGastado,
          saldo,
          margenDisponible,
          porcentajePagado: presupuestoVigente > 0 
            ? ((totalPagado / presupuestoVigente) * 100).toFixed(2)
            : 0,
          porcentajeGastado: totalPagado > 0 
            ? ((totalGastado / totalPagado) * 100).toFixed(2)
            : 0
        },
        estadisticas: {
          cantidadPagos: pagosResult[0]?.cantidadPagos || 0,
          cantidadGastos: gastosResult[0]?.cantidadGastos || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener finanzas', error: error.message });
  }
};

const obtenerDashboardGlobal = async (req, res) => {
  try {
    const filtroObras = req.filtroObras || {};

    const [obras, resumenFinanciero] = await Promise.all([
      Obra.aggregate([
        { $match: { deletedAt: null, ...filtroObras } },
        {
          $group: {
            _id: '$estado',
            cantidad: { $sum: 1 },
            presupuestoTotal: { $sum: { $toDouble: '$presupuestoVigente' } }
          }
        }
      ]),
      
      Obra.aggregate([
        { $match: { deletedAt: null, ...filtroObras } },
        {
          $lookup: {
            from: 'pagos',
            let: { obraId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$obraId', '$$obraId'] }, { $eq: ['$deletedAt', null] }] } } },
              { $group: { _id: null, total: { $sum: { $toDouble: '$monto' } } } }
            ],
            as: 'pagos'
          }
        },
        {
          $lookup: {
            from: 'gastos',
            let: { obraId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$obraId', '$$obraId'] }, { $eq: ['$deletedAt', null] }] } } },
              { $group: { _id: null, total: { $sum: { $toDouble: '$monto' } } } }
            ],
            as: 'gastos'
          }
        },
        {
          $group: {
            _id: null,
            totalPresupuesto: { $sum: { $toDouble: '$presupuestoVigente' } },
            totalPagado: { $sum: { $arrayElemAt: ['$pagos.total', 0] } },
            totalGastado: { $sum: { $arrayElemAt: ['$gastos.total', 0] } }
          }
        }
      ])
    ]);

    const alertas = await InventarioItem.aggregate([
      { $match: { deletedAt: null, $expr: { $lte: ['$cantidadActual', '$stockMinimo'] } } },
      {
        $lookup: {
          from: 'obras',
          localField: 'obraId',
          foreignField: '_id',
          as: 'obra'
        }
      },
      { $match: { 'obra.deletedAt': null, ...Object.keys(filtroObras).reduce((acc, key) => {
        acc[`obra.${key}`] = filtroObras[key];
        return acc;
      }, {}) } },
      { $group: { _id: '$obraId', cantidad: { $sum: 1 } } },
      { $group: { _id: null, totalAlertas: { $sum: '$cantidad' }, obrasAfectadas: { $sum: 1 } } }
    ]);

    const kpis = {
      obras: {
        activas: obras.find(o => o._id === 'activa')?.cantidad || 0,
        finalizadas: obras.find(o => o._id === 'finalizada')?.cantidad || 0,
        total: obras.reduce((sum, o) => sum + o.cantidad, 0)
      },
      finanzas: {
        totalPresupuesto: resumenFinanciero[0]?.totalPresupuesto || 0,
        totalPagado: resumenFinanciero[0]?.totalPagado || 0,
        totalGastado: resumenFinanciero[0]?.totalGastado || 0,
        saldoTotal: (resumenFinanciero[0]?.totalPresupuesto || 0) - (resumenFinanciero[0]?.totalPagado || 0)
      },
      alertas: {
        itemsStockBajo: alertas[0]?.totalAlertas || 0,
        obrasConAlertas: alertas[0]?.obrasAfectadas || 0
      }
    };

    res.json({ data: kpis });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener dashboard', error: error.message });
  }
};

module.exports = {
  obtenerCostosObra,
  obtenerFinanzasObra,
  obtenerDashboardGlobal
};