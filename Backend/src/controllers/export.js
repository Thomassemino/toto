const Obra = require('../models/obra');
const Gasto = require('../models/gasto');
const Pago = require('../models/pago');
const InventarioItem = require('../models/inventarioItem');
const {
  generarResumenObraPDF,
  generarGastosExcel,
  generarPagosExcel,
  generarInventarioExcel
} = require('../services/export');

const exportarResumenPDF = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const [pagos, gastos, stockBajo] = await Promise.all([
      Pago.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { $group: { _id: null, totalPagado: { $sum: { $toDouble: '$monto' } } } }
      ]),
      
      Gasto.aggregate([
        { $match: { obraId: obra._id, deletedAt: null } },
        { 
          $group: { 
            _id: '$tipo', 
            total: { $sum: { $toDouble: '$monto' } } 
          } 
        }
      ]),
      
      InventarioItem.find({
        obraId: obra._id,
        deletedAt: null,
        $expr: { $lte: ['$cantidadActual', '$stockMinimo'] }
      }).select('nombreItem cantidadActual stockMinimo')
    ]);

    const totalPagado = pagos[0]?.totalPagado || 0;
    const presupuestoVigente = parseFloat(obra.presupuestoVigente?.toString() || '0');
    const saldo = presupuestoVigente - totalPagado;

    const gastosMateriales = gastos.find(g => g._id === 'materiales')?.total || 0;
    const gastosManoObra = gastos.find(g => g._id === 'mano_obra')?.total || 0;
    const totalGastado = gastosMateriales + gastosManoObra;

    const resumenData = {
      finanzas: {
        presupuestoVigente,
        totalPagado,
        saldo,
        totalGastado,
        gastosMateriales,
        gastosManoObra
      },
      alertas: {
        stockBajo: stockBajo.length,
        itemsStockBajo: stockBajo
      }
    };

    const pdfBuffer = await generarResumenObraPDF(obra, resumenData);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resumen-${obra.nombre.replace(/\s+/g, '-')}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar PDF', error: error.message });
  }
};

const exportarGastosExcel = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const gastos = await Gasto.find({
      obraId,
      deletedAt: null
    })
    .populate('proveedorId', 'nombre')
    .populate('contratistaId', 'nombre')
    .sort({ fecha: -1 });

    const excelBuffer = await generarGastosExcel(gastos, obra);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="gastos-${obra.nombre.replace(/\s+/g, '-')}.xlsx"`
    });

    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar Excel', error: error.message });
  }
};

const exportarPagosExcel = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const pagos = await Pago.find({
      obraId,
      deletedAt: null
    }).sort({ fechaRecepcion: -1 });

    const excelBuffer = await generarPagosExcel(pagos, obra);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="pagos-${obra.nombre.replace(/\s+/g, '-')}.xlsx"`
    });

    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar Excel', error: error.message });
  }
};

const exportarInventarioExcel = async (req, res) => {
  try {
    const { id: obraId } = req.params;

    const obra = await Obra.findOne({ _id: obraId, deletedAt: null });
    if (!obra) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    const items = await InventarioItem.find({
      obraId,
      deletedAt: null
    }).sort({ nombreItem: 1 });

    const excelBuffer = await generarInventarioExcel(items, obra);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="inventario-${obra.nombre.replace(/\s+/g, '-')}.xlsx"`
    });

    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error al generar Excel', error: error.message });
  }
};

module.exports = {
  exportarResumenPDF,
  exportarGastosExcel,
  exportarPagosExcel,
  exportarInventarioExcel
};