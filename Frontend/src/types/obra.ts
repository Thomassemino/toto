import { BaseEntity, UploadedFile } from './index';
import { ObraState, MilestoneState, ExpenseCategory, PaymentMethod } from '../constants';

// Presupuesto types
export interface Presupuesto extends BaseEntity {
  obraId: string;
  version: number;
  fechaVersion: string;
  activo: boolean;
  items: PresupuestoItem[];
  montoTotal: number;
  observaciones?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
}

export interface PresupuestoItem extends BaseEntity {
  presupuestoId: string;
  codigo?: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  categoria: string;
  orden?: number;
}

// Pago types
export interface Pago extends BaseEntity {
  obraId: string;
  fecha: string;
  monto: number;
  tipo: 'anticipo' | 'certificacion' | 'final' | 'extra';
  metodoPago: PaymentMethod;
  referencia?: string;
  descripcion?: string;
  estado: 'pendiente' | 'procesado' | 'rechazado';
  adjuntos?: UploadedFile[];
  aprobadoPor?: string;
  observaciones?: string;
}

// Inventario types
export interface InventarioItem extends BaseEntity {
  obraId: string;
  materialId: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  costoPromedio: number;
  ubicacion?: string;
  
  // Material info (desnormalizada)
  materialNombre: string;
  materialUnidad: string;
  materialDescripcion?: string;
}

// Hito types (alias for Milestone for consistency)
export interface Hito extends Milestone {}

// Adjunto types
export interface Adjunto extends BaseEntity {
  entidadTipo: 'obra' | 'gasto' | 'pago' | 'hito';
  entidadId: string;
  archivo: UploadedFile;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  fechaDocumento?: string;
  privado: boolean;
  tags?: string[];
}

// Auditoria types
export interface AuditoriaLog extends BaseEntity {
  entidadTipo: string;
  entidadId: string;
  accion: 'create' | 'update' | 'delete' | 'view';
  camposModificados?: string[];
  valoresAnteriores?: Record<string, any>;
  valoresNuevos?: Record<string, any>;
  usuarioId: string;
  usuarioNombre: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface Obra extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente: string;
  direccion: string;
  estado: ObraState;
  fechaInicio: string;
  fechaFinPrevista?: string;
  fechaFinReal?: string;
  presupuestoTotal: number;
  gastoActual: number;
  progreso: number; // 0-100
  jefeObra?: string;
  observaciones?: string;
  adjuntos?: UploadedFile[];
  coordenadas?: {
    lat: number;
    lng: number;
  };
  
  // Campos calculados
  porcentajeGastado: number;
  diasRestantes?: number;
  diasTranscurridos: number;
  estado_presupuesto: 'bajo' | 'normal' | 'alto' | 'excedido';
}

export interface ObraDetalle extends Obra {
  cronograma: Milestone[];
  gastos: Gasto[];
  movimientosMateriales: MovimientoMaterial[];
  terceros: ObraTercero[];
  documentos: Documento[];
}

export interface Milestone extends BaseEntity {
  obraId: string;
  nombre: string;
  descripcion?: string;
  fechaPrevista: string;
  fechaReal?: string;
  estado: MilestoneState;
  progreso: number; // 0-100
  orden: number;
  dependencias?: string[]; // IDs de milestones que deben completarse antes
  responsable?: string;
  observaciones?: string;
}

export interface Gasto extends BaseEntity {
  obraId: string;
  fecha: string;
  descripcion: string;
  categoria: ExpenseCategory;
  monto: number;
  proveedor?: string;
  metodoPago: PaymentMethod;
  numeroFactura?: string;
  adjuntos?: UploadedFile[];
  aprobadoPor?: string;
  observaciones?: string;
}

export interface MovimientoMaterial extends BaseEntity {
  obraId: string;
  materialId: string;
  tipo: 'ingreso' | 'egreso' | 'ajuste';
  cantidad: number;
  fecha: string;
  descripcion?: string;
  responsable?: string;
  documentoReferencia?: string;
  
  // Información del material (desnormalizada para consultas)
  materialNombre: string;
  materialUnidad: string;
  materialCosto?: number;
}

export interface ObraTercero extends BaseEntity {
  obraId: string;
  terceroId: string;
  rol: 'cliente' | 'proveedor' | 'subcontratista' | 'consultor';
  activo: boolean;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
  
  // Información del tercero (desnormalizada)
  terceroNombre: string;
  terceroEmail?: string;
  terceroTelefono?: string;
}

export interface Documento extends BaseEntity {
  obraId: string;
  nombre: string;
  tipo: 'plano' | 'permiso' | 'contrato' | 'factura' | 'foto' | 'informe' | 'otro';
  archivo: UploadedFile;
  descripcion?: string;
  fechaDocumento?: string;
  version?: string;
  tags?: string[];
  privado: boolean; // Solo visible para ciertos roles
}

// Tipos para creación/edición
export interface CreateObraData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  cliente: string;
  direccion: string;
  fechaInicio: string;
  fechaFinPrevista?: string;
  presupuestoTotal: number;
  jefeObra?: string;
  observaciones?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface UpdateObraData extends Partial<CreateObraData> {
  estado?: ObraState;
  fechaFinReal?: string;
  progreso?: number;
}

export interface CreateMilestoneData {
  nombre: string;
  descripcion?: string;
  fechaPrevista: string;
  orden: number;
  dependencias?: string[];
  responsable?: string;
  observaciones?: string;
}

export interface CreateGastoData {
  fecha: string;
  descripcion: string;
  categoria: ExpenseCategory;
  monto: number;
  proveedor?: string;
  metodoPago: PaymentMethod;
  numeroFactura?: string;
  observaciones?: string;
}

// Filtros y búsquedas
export interface ObraFilters {
  estado?: ObraState[];
  jefeObra?: string[];
  fechaInicioDesde?: string;
  fechaInicioHasta?: string;
  presupuestoMin?: number;
  presupuestoMax?: number;
  cliente?: string[];
  progreso?: {
    min: number;
    max: number;
  };
}

export interface GastoFilters {
  categoria?: ExpenseCategory[];
  fechaDesde?: string;
  fechaHasta?: string;
  montoMin?: number;
  montoMax?: number;
  proveedor?: string[];
  metodoPago?: PaymentMethod[];
}

// Estadísticas y reportes
export interface ObraStats {
  totalObras: number;
  obrasPorEstado: Record<ObraState, number>;
  presupuestoTotal: number;
  gastoTotal: number;
  progresoPromedio: number;
  obrasAtrasadas: number;
  obrasSinPresupuesto: number;
  gastosUltimoMes: number;
  tendenciaGastos: 'up' | 'down' | 'stable';
}

export interface ObraResumen {
  obra: Obra;
  ultimosGastos: Gasto[];
  proximosMilestones: Milestone[];
  alertas: ObraAlerta[];
}

export interface ObraAlerta {
  tipo: 'presupuesto' | 'cronograma' | 'milestone' | 'documento';
  nivel: 'info' | 'warning' | 'error';
  mensaje: string;
  fecha: string;
}