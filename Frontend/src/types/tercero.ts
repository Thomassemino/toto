import { BaseEntity } from './index';

export interface Tercero extends BaseEntity {
  nombre: string;
  apellido?: string;
  razonSocial?: string;
  tipoDocumento: 'DNI' | 'CUIT' | 'CUIL' | 'PASAPORTE';
  numeroDocumento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  tipo: TerceroTipo[];
  activo: boolean;
  observaciones?: string;
  
  // Información adicional
  contactoPrincipal?: string;
  sitioWeb?: string;
  condicionIva?: CondicionIva;
  
  // Metadatos
  fechaUltimaOperacion?: string;
  totalOperaciones: number;
  montoTotalOperaciones: number;
}

export type TerceroTipo = 'cliente' | 'proveedor' | 'subcontratista' | 'empleado' | 'consultor';

export type CondicionIva = 
  | 'inscripto'
  | 'monotributo'
  | 'exento'
  | 'consumidor_final'
  | 'responsable_no_inscripto';

export interface TerceroDetalle extends Tercero {
  obras: TerceroObra[];
  facturas: TerceroFactura[];
  pagos: TerceroPago[];
  contactos: TerceroContacto[];
  documentos: TerceroDocumento[];
}

export interface TerceroObra extends BaseEntity {
  terceroId: string;
  obraId: string;
  rol: 'cliente' | 'proveedor' | 'subcontratista' | 'consultor';
  activo: boolean;
  fechaInicio: string;
  fechaFin?: string;
  
  // Información desnormalizada de la obra
  obraNombre: string;
  obraCodigo: string;
  obraEstado: string;
}

export interface TerceroFactura extends BaseEntity {
  terceroId: string;
  obraId?: string;
  numero: string;
  fecha: string;
  fechaVencimiento?: string;
  tipo: 'factura_a' | 'factura_b' | 'factura_c' | 'nota_credito' | 'nota_debito';
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  observaciones?: string;
  adjuntos?: UploadedFile[];
}

export interface TerceroPago extends BaseEntity {
  terceroId: string;
  facturaId?: string;
  fecha: string;
  monto: number;
  metodoPago: PaymentMethod;
  referencia?: string;
  observaciones?: string;
  comprobante?: UploadedFile;
}

export interface TerceroContacto extends BaseEntity {
  terceroId: string;
  nombre: string;
  cargo?: string;
  email?: string;
  telefono?: string;
  principal: boolean;
  activo: boolean;
}

export interface TerceroDocumento extends BaseEntity {
  terceroId: string;
  nombre: string;
  tipo: 'contrato' | 'certificado' | 'seguro' | 'licencia' | 'otro';
  archivo: UploadedFile;
  fechaVencimiento?: string;
  observaciones?: string;
}

// Tipos para creación/edición
export interface CreateTerceroData {
  nombre: string;
  apellido?: string;
  razonSocial?: string;
  tipoDocumento: 'DNI' | 'CUIT' | 'CUIL' | 'PASAPORTE';
  numeroDocumento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  tipo: TerceroTipo[];
  contactoPrincipal?: string;
  sitioWeb?: string;
  condicionIva?: CondicionIva;
  observaciones?: string;
}

export interface UpdateTerceroData extends Partial<CreateTerceroData> {
  activo?: boolean;
}

export interface CreateTerceroContactoData {
  nombre: string;
  cargo?: string;
  email?: string;
  telefono?: string;
  principal?: boolean;
}

export interface CreateTerceroFacturaData {
  obraId?: string;
  numero: string;
  fecha: string;
  fechaVencimiento?: string;
  tipo: 'factura_a' | 'factura_b' | 'factura_c' | 'nota_credito' | 'nota_debito';
  subtotal: number;
  iva: number;
  observaciones?: string;
}

export interface CreateTerceroPagoData {
  facturaId?: string;
  fecha: string;
  monto: number;
  metodoPago: PaymentMethod;
  referencia?: string;
  observaciones?: string;
}

// Filtros y búsquedas
export interface TerceroFilters {
  tipo?: TerceroTipo[];
  activo?: boolean;
  tipoDocumento?: ('DNI' | 'CUIT' | 'CUIL' | 'PASAPORTE')[];
  condicionIva?: CondicionIva[];
  ciudad?: string[];
  provincia?: string[];
  montoOperacionesMin?: number;
  montoOperacionesMax?: number;
  fechaUltimaOperacionDesde?: string;
  fechaUltimaOperacionHasta?: string;
}

export interface TerceroFacturaFilters {
  tipo?: ('factura_a' | 'factura_b' | 'factura_c' | 'nota_credito' | 'nota_debito')[];
  estado?: ('pendiente' | 'pagada' | 'vencida' | 'cancelada')[];
  fechaDesde?: string;
  fechaHasta?: string;
  montoMin?: number;
  montoMax?: number;
  obraId?: string;
}

// Estadísticas y reportes
export interface TerceroStats {
  totalTerceros: number;
  tercerosPorTipo: Record<TerceroTipo, number>;
  terceroActivos: number;
  totalFacturasPendientes: number;
  montoFacturasPendientes: number;
  facturasVencidas: number;
  montoFacturasVencidas: number;
  pagosUltimoMes: number;
  tendenciaPagos: 'up' | 'down' | 'stable';
}

export interface TerceroResumen {
  tercero: Tercero;
  facturasPendientes: TerceroFactura[];
  facturasVencidas: TerceroFactura[];
  ultimosPagos: TerceroPago[];
  obrasActivas: TerceroObra[];
  alertas: TerceroAlerta[];
}

export interface TerceroAlerta {
  tipo: 'factura_vencida' | 'documento_vencimiento' | 'inactividad' | 'monto_alto';
  nivel: 'info' | 'warning' | 'error';
  mensaje: string;
  fecha: string;
}