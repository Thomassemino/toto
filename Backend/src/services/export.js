const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const generarResumenObraPDF = async (obraData, resumenData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Resumen de Obra', { align: 'center' });
      doc.moveDown();

      doc.fontSize(16).text(`Obra: ${obraData.nombre}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Estado: ${obraData.estado}`);
      doc.text(`Avance: ${obraData.avancePct}%`);
      doc.text(`Cliente: ${obraData.cliente?.nombre || 'N/A'}`);
      
      if (obraData.ubicacion) {
        doc.text(`Ubicación: ${obraData.ubicacion.ciudad || ''}, ${obraData.ubicacion.provincia || ''}`);
      }
      
      doc.moveDown();

      doc.fontSize(14).text('Resumen Financiero:', { underline: true });
      doc.fontSize(12);
      doc.text(`Presupuesto Vigente: $${resumenData.finanzas.presupuestoVigente.toLocaleString()}`);
      doc.text(`Total Pagado: $${resumenData.finanzas.totalPagado.toLocaleString()}`);
      doc.text(`Saldo: $${resumenData.finanzas.saldo.toLocaleString()}`);
      doc.text(`Total Gastado: $${resumenData.finanzas.totalGastado.toLocaleString()}`);
      doc.text(`Gastos en Materiales: $${resumenData.finanzas.gastosMateriales.toLocaleString()}`);
      doc.text(`Gastos en Mano de Obra: $${resumenData.finanzas.gastosManoObra.toLocaleString()}`);
      
      doc.moveDown();

      if (resumenData.alertas.stockBajo > 0) {
        doc.fontSize(14).text('Alertas de Stock:', { underline: true });
        doc.fontSize(12);
        doc.text(`Items con stock bajo: ${resumenData.alertas.stockBajo}`);
        
        resumenData.alertas.itemsStockBajo.forEach(item => {
          doc.text(`- ${item.nombreItem}: ${item.cantidadActual} (mín: ${item.stockMinimo})`);
        });
      }

      doc.moveDown();
      doc.fontSize(10).text(`Generado el: ${new Date().toLocaleDateString('es-AR')}`, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generarGastosExcel = async (gastos, obraData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Gastos');

  worksheet.columns = [
    { header: 'Fecha', key: 'fecha', width: 12 },
    { header: 'Tipo', key: 'tipo', width: 15 },
    { header: 'Descripción', key: 'descripcion', width: 30 },
    { header: 'Monto', key: 'monto', width: 15 },
    { header: 'Proveedor', key: 'proveedor', width: 20 },
    { header: 'Contratista', key: 'contratista', width: 20 },
    { header: 'Etiquetas', key: 'etiquetas', width: 25 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  gastos.forEach(gasto => {
    worksheet.addRow({
      fecha: new Date(gasto.fecha).toLocaleDateString('es-AR'),
      tipo: gasto.tipo,
      descripcion: gasto.descripcion,
      monto: parseFloat(gasto.monto.toString()),
      proveedor: gasto.proveedorId?.nombre || '',
      contratista: gasto.contratistaId?.nombre || '',
      etiquetas: gasto.etiquetas.join(', ')
    });
  });

  const totalGastos = gastos.reduce((sum, gasto) => 
    sum + parseFloat(gasto.monto.toString()), 0
  );

  const summaryRow = worksheet.addRow({
    fecha: '',
    tipo: '',
    descripcion: 'TOTAL',
    monto: totalGastos,
    proveedor: '',
    contratista: '',
    etiquetas: ''
  });

  summaryRow.font = { bold: true };
  summaryRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }
  };

  worksheet.getColumn('D').numFmt = '"$"#,##0.00';

  const infoWorksheet = workbook.addWorksheet('Información');
  infoWorksheet.addRow(['Obra:', obraData.nombre]);
  infoWorksheet.addRow(['Estado:', obraData.estado]);
  infoWorksheet.addRow(['Generado:', new Date().toLocaleDateString('es-AR')]);
  
  return workbook.xlsx.writeBuffer();
};

const generarPagosExcel = async (pagos, obraData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Pagos');

  worksheet.columns = [
    { header: 'Fecha Recepción', key: 'fechaRecepcion', width: 15 },
    { header: 'Monto', key: 'monto', width: 15 },
    { header: 'Método', key: 'metodo', width: 20 },
    { header: 'Observaciones', key: 'observaciones', width: 40 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  pagos.forEach(pago => {
    worksheet.addRow({
      fechaRecepcion: new Date(pago.fechaRecepcion).toLocaleDateString('es-AR'),
      monto: parseFloat(pago.monto.toString()),
      metodo: pago.metodo,
      observaciones: pago.observaciones || ''
    });
  });

  const totalPagos = pagos.reduce((sum, pago) => 
    sum + parseFloat(pago.monto.toString()), 0
  );

  const summaryRow = worksheet.addRow({
    fechaRecepcion: '',
    monto: totalPagos,
    metodo: 'TOTAL',
    observaciones: ''
  });

  summaryRow.font = { bold: true };
  summaryRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }
  };

  worksheet.getColumn('B').numFmt = '"$"#,##0.00';

  const infoWorksheet = workbook.addWorksheet('Información');
  infoWorksheet.addRow(['Obra:', obraData.nombre]);
  infoWorksheet.addRow(['Estado:', obraData.estado]);
  infoWorksheet.addRow(['Generado:', new Date().toLocaleDateString('es-AR')]);
  
  return workbook.xlsx.writeBuffer();
};

const generarInventarioExcel = async (items, obraData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventario');

  worksheet.columns = [
    { header: 'Item', key: 'nombreItem', width: 30 },
    { header: 'Cantidad Actual', key: 'cantidadActual', width: 15 },
    { header: 'Stock Mínimo', key: 'stockMinimo', width: 15 },
    { header: 'Unidad', key: 'unidadMedida', width: 12 },
    { header: 'Estado', key: 'estado', width: 15 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  items.forEach(item => {
    const estado = item.cantidadActual <= item.stockMinimo ? 'STOCK BAJO' : 'OK';
    const row = worksheet.addRow({
      nombreItem: item.nombreItem,
      cantidadActual: item.cantidadActual,
      stockMinimo: item.stockMinimo,
      unidadMedida: item.unidadMedida,
      estado: estado
    });

    if (estado === 'STOCK BAJO') {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCCCC' }
      };
    }
  });

  const infoWorksheet = workbook.addWorksheet('Información');
  infoWorksheet.addRow(['Obra:', obraData.nombre]);
  infoWorksheet.addRow(['Estado:', obraData.estado]);
  infoWorksheet.addRow(['Generado:', new Date().toLocaleDateString('es-AR')]);
  
  return workbook.xlsx.writeBuffer();
};

module.exports = {
  generarResumenObraPDF,
  generarGastosExcel,
  generarPagosExcel,
  generarInventarioExcel
};