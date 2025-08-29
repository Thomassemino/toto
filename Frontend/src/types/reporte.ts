import { BaseEntity } from './index';
import { ObraState, ExpenseCategory, MovementType } from '../constants';

export interface Reporte extends BaseEntity {
  nombre: string;
  tipo: ReporteTipo;
  descripcion?: string;
  parametros: ReporteParametros;
  formato: ReporteFormato;
  programado: boolean;
  frecuencia?: ReporteFrecuencia;
  proximaEjecucion?: string;
  ultimaEjecucion?: string;
  activo: boolean;
  createdBy: string;
}

export type ReporteTipo = 
  | 'obras_general'
  | 'obras_detalle'
  | 'gastos_por_obra'
  | 'gastos_por_categoria'
  | 'terceros_general'
  | 'facturas_pendientes'
  | 'materiales_stock'
  | 'materiales_movimientos'
  | 'rentabilidad'
  | 'cronograma'
  | 'personalizado';

export type ReporteFormato = 'pdf' | 'excel' | 'csv';

export type ReporteFrecuencia = 'diario' | 'semanal' | 'mensual' | 'trimestral';

export interface ReporteParametros {
  fechaDesde?: string;
  fechaHasta?: string;
  obras?: string[];
  terceros?: string[];
  materiales?: string[];
  estados?: ObraState[];
  categorias?: ExpenseCategory[];
  incluirDetalle?: boolean;
  incluirGraficos?: boolean;
  filtrosAdicionales?: Record<string, any>;
}

export interface ReporteEjecucion extends BaseEntity {
  reporteId: string;
  estado: 'generando' | 'completado' | 'error';
  archivo?: UploadedFile;
  error?: string;
  parametrosUsados: ReporteParametros;
  tiempoEjecucion?: number; // en segundos
  tamanoArchivo?: number; // en bytes
  ejecutadoPor: string;
}

// Datos para reportes específicos
export interface ReporteObrasGeneral {
  resumen: {
    totalObras: number;
    obrasPorEstado: Record<ObraState, number>;
    presupuestoTotal: number;
    gastoTotal: number;
    progresoPromedio: number;
  };
  obras: {
    codigo: string;
    nombre: string;
    cliente: string;
    estado: ObraState;
    progreso: number;
    presupuesto: number;
    gastado: number;
    margen: number;
    fechaInicio: string;
    fechaFinPrevista?: string;
    diasRestantes?: number;
  }[];
  graficos: {
    obrasPorEstado: ChartDataPoint[];
    gastosPorMes: ChartDataPoint[];
    progresoPromedio: ChartDataPoint[];
  };
}

export interface ReporteGastosPorObra {
  obra: {
    codigo: string;
    nombre: string;
    cliente: string;
    presupuesto: number;
  };
  resumen: {
    totalGastado: number;
    gastosPorCategoria: Record<ExpenseCategory, number>;
    promedioMensual: number;
    tendencia: 'up' | 'down' | 'stable';
  };
  gastos: {
    fecha: string;
    descripcion: string;
    categoria: ExpenseCategory;
    monto: number;
    proveedor?: string;
  }[];
  graficos: {
    gastosPorCategoria: ChartDataPoint[];
    gastosPorMes: ChartDataPoint[];
    tendenciaGastos: ChartDataPoint[];
  };
}

export interface ReporteFacturasPendientes {
  resumen: {
    totalFacturas: number;
    montoTotal: number;
    facturasVencidas: number;
    montoVencido: number;
    promedioVencimiento: number; // días
  };
  facturas: {
    numero: string;
    tercero: string;
    fecha: string;
    vencimiento?: string;
    monto: number;
    diasVencido?: number;
    obra?: string;
  }[];
  terceros: {
    nombre: string;
    totalFacturas: number;
    montoTotal: number;
    facturasVencidas: number;
    montoVencido: number;
  }[];
  graficos: {
    facturasPorTercero: ChartDataPoint[];
    vencimientoPorMes: ChartDataPoint[];
    montoPorEstado: ChartDataPoint[];
  };
}

export interface ReporteMaterialesStock {
  resumen: {
    totalMateriales: number;
    valorTotalStock: number;
    materialesBajoStock: number;
    materialesSinMovimiento: number;
  };
  materiales: {
    codigo: string;
    nombre: string;
    categoria: string;
    stockActual: number;
    stockMinimo?: number;
    valorUnitario?: number;
    valorTotal: number;
    ultimoMovimiento?: string;
    estado: 'normal' | 'bajo_stock' | 'sin_stock';
  }[];
  categorias: {
    categoria: string;
    cantidadMateriales: number;
    valorTotal: number;
    materialesBajoStock: number;
  }[];
  graficos: {
    valorPorCategoria: ChartDataPoint[];
    materialesPorEstado: ChartDataPoint[];
    movimientosRecientes: ChartDataPoint[];
  };
}

export interface ReporteRentabilidad {
  periodo: {
    desde: string;
    hasta: string;
  };
  resumen: {
    ingresoTotal: number;
    gastoTotal: number;
    utilidadBruta: number;
    margenBruto: number; // porcentaje
    obrasMasRentables: string[];
    obrasMenosRentables: string[];
  };
  obras: {
    codigo: string;
    nombre: string;
    cliente: string;
    ingresos: number;
    gastos: number;
    utilidad: number;
    margen: number;
    estado: ObraState;
  }[];
  categorias: {
    categoria: ExpenseCategory;
    gastos: number;
    porcentaje: number;
  }[];
  graficos: {
    rentabilidadPorObra: ChartDataPoint[];
    gastosPorCategoria: ChartDataPoint[];
    evolucionRentabilidad: ChartDataPoint[];
  };
}

// Tipos para creación/edición
export interface CreateReporteData {
  nombre: string;
  tipo: ReporteTipo;
  descripcion?: string;
  parametros: ReporteParametros;
  formato: ReporteFormato;
  programado?: boolean;
  frecuencia?: ReporteFrecuencia;
}

export interface UpdateReporteData extends Partial<CreateReporteData> {
  activo?: boolean;
}

export interface GenerarReporteData {
  reporteId?: string;
  tipo: ReporteTipo;
  parametros: ReporteParametros;
  formato: ReporteFormato;
  nombre?: string;
}

// Filtros
export interface ReporteFilters {
  tipo?: ReporteTipo[];
  formato?: ReporteFormato[];
  programado?: boolean;
  activo?: boolean;
  createdBy?: string[];
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;
}

export interface ReporteEjecucionFilters {
  estado?: ('generando' | 'completado' | 'error')[];
  fechaDesde?: string;
  fechaHasta?: string;
  ejecutadoPor?: string[];
}

// Plantillas de reportes predefinidos
export interface ReportePlantilla {
  id: string;
  nombre: string;
  tipo: ReporteTipo;
  descripcion: string;
  parametrosDefault: ReporteParametros;
  formato: ReporteFormato;
  categoria: 'financiero' | 'operativo' | 'inventario' | 'general';
  tags: string[];
}

export const REPORTES_PLANTILLAS: ReportePlantilla[] = [
  {
    id: 'obras-resumen-mensual',
    nombre: 'Resumen Mensual de Obras',
    tipo: 'obras_general',
    descripcion: 'Resumen general de todas las obras del mes actual',
    parametrosDefault: {
      fechaDesde: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      fechaHasta: new Date().toISOString().split('T')[0],
      incluirGraficos: true
    },
    formato: 'pdf',
    categoria: 'operativo',
    tags: ['obras', 'mensual', 'resumen']
  },
  {
    id: 'gastos-categoria',
    nombre: 'Gastos por Categoría',
    tipo: 'gastos_por_categoria',
    descripcion: 'Análisis detallado de gastos agrupados por categoría',
    parametrosDefault: {
      incluirDetalle: true,
      incluirGraficos: true
    },
    formato: 'excel',
    categoria: 'financiero',
    tags: ['gastos', 'categorías', 'análisis']
  }
];

// Dashboard de reportes
export interface ReporteDashboard {
  reportesRecientes: ReporteEjecucion[];
  reportesProgramados: Reporte[];
  estadisticas: {
    reportesGenerados: number;
    reportesUltimoMes: number;
    formatoMasUsado: ReporteFormato;
    tipoMasGenerado: ReporteTipo;
  };
}