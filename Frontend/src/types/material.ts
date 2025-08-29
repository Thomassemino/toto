import { BaseEntity } from './index';
import { MovementType } from '../constants';

export interface Material extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: MaterialCategoria;
  subcategoria?: string;
  unidad: MaterialUnidad;
  costoUnitario?: number;
  stockMinimo?: number;
  stockActual: number;
  ubicacion?: string;
  proveedor?: string;
  observaciones?: string;
  activo: boolean;
  
  // Metadatos
  fechaUltimaCompra?: string;
  fechaUltimoMovimiento?: string;
  totalMovimientos: number;
  costoPromedio?: number;
}

export type MaterialCategoria = 
  | 'cemento_hormigon'
  | 'ladrillos_bloques'
  | 'hierros_aceros'
  | 'maderas'
  | 'pinturas_revestimientos'
  | 'instalaciones_electricas'
  | 'instalaciones_sanitarias'
  | 'aislantes'
  | 'herramientas'
  | 'seguridad'
  | 'otros';

export type MaterialUnidad = 
  | 'kg'
  | 'm'
  | 'm2'
  | 'm3'
  | 'unidad'
  | 'litro'
  | 'tonelada'
  | 'caja'
  | 'bolsa'
  | 'rollo'
  | 'metro_lineal';

export interface MaterialDetalle extends Material {
  movimientos: MaterialMovimiento[];
  obras: MaterialObra[];
  proveedores: MaterialProveedor[];
  precios: MaterialPrecio[];
}

export interface MaterialMovimiento extends BaseEntity {
  materialId: string;
  tipo: MovementType;
  cantidad: number;
  fecha: string;
  descripcion?: string;
  obraId?: string;
  responsable?: string;
  documentoReferencia?: string;
  costoUnitario?: number;
  
  // Información desnormalizada
  materialNombre: string;
  obraNombre?: string;
  stockAnterior: number;
  stockPosterior: number;
}

export interface MaterialObra extends BaseEntity {
  materialId: string;
  obraId: string;
  cantidadAsignada: number;
  cantidadConsumida: number;
  fechaAsignacion: string;
  observaciones?: string;
  
  // Información desnormalizada
  obraNombre: string;
  obraCodigo: string;
}

export interface MaterialProveedor extends BaseEntity {
  materialId: string;
  terceroId: string;
  precioActual: number;
  fechaUltimoPrecio: string;
  tiempoEntrega?: number; // en días
  cantidadMinimaPedido?: number;
  activo: boolean;
  
  // Información desnormalizada del tercero
  proveedorNombre: string;
  proveedorTelefono?: string;
  proveedorEmail?: string;
}

export interface MaterialPrecio extends BaseEntity {
  materialId: string;
  terceroId?: string;
  precio: number;
  fecha: string;
  observaciones?: string;
  
  // Información desnormalizada
  proveedorNombre?: string;
}

// Tipos para creación/edición
export interface CreateMaterialData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: MaterialCategoria;
  subcategoria?: string;
  unidad: MaterialUnidad;
  costoUnitario?: number;
  stockMinimo?: number;
  ubicacion?: string;
  proveedor?: string;
  observaciones?: string;
}

export interface UpdateMaterialData extends Partial<CreateMaterialData> {
  activo?: boolean;
  stockActual?: number;
}

export interface CreateMaterialMovimientoData {
  tipo: MovementType;
  cantidad: number;
  fecha: string;
  descripcion?: string;
  obraId?: string;
  documentoReferencia?: string;
  costoUnitario?: number;
}

export interface CreateMaterialProveedorData {
  terceroId: string;
  precioActual: number;
  tiempoEntrega?: number;
  cantidadMinimaPedido?: number;
}

// Filtros y búsquedas
export interface MaterialFilters {
  categoria?: MaterialCategoria[];
  unidad?: MaterialUnidad[];
  activo?: boolean;
  stockBajo?: boolean; // stock < stockMinimo
  sinMovimientos?: boolean; // sin movimientos en X días
  proveedor?: string[];
  ubicacion?: string[];
  costoMin?: number;
  costoMax?: number;
  fechaUltimoMovimientoDesde?: string;
  fechaUltimoMovimientoHasta?: string;
}

export interface MaterialMovimientoFilters {
  tipo?: MovementType[];
  fechaDesde?: string;
  fechaHasta?: string;
  obraId?: string[];
  responsable?: string[];
  cantidadMin?: number;
  cantidadMax?: number;
}

// Estadísticas y reportes
export interface MaterialStats {
  totalMateriales: number;
  materialesActivos: number;
  materialesBajoStock: number;
  materialesSinMovimiento: number;
  valorTotalStock: number;
  movimientosUltimoMes: number;
  tendenciaMovimientos: 'up' | 'down' | 'stable';
  categoriaMasUsada: MaterialCategoria;
  materialMasMovido: string;
}

export interface MaterialResumen {
  material: Material;
  ultimosMovimientos: MaterialMovimiento[];
  obrasActuales: MaterialObra[];
  proveedoresActivos: MaterialProveedor[];
  alertas: MaterialAlerta[];
}

export interface MaterialAlerta {
  tipo: 'stock_bajo' | 'sin_proveedor' | 'precio_alto' | 'sin_movimiento';
  nivel: 'info' | 'warning' | 'error';
  mensaje: string;
  fecha: string;
}

// Inventario
export interface InventarioItem {
  materialId: string;
  materialNombre: string;
  materialCodigo: string;
  categoria: MaterialCategoria;
  unidad: MaterialUnidad;
  stockActual: number;
  stockMinimo?: number;
  costoUnitario?: number;
  valorTotal: number;
  fechaUltimoMovimiento?: string;
  ubicacion?: string;
  estado: 'normal' | 'bajo_stock' | 'sin_stock' | 'exceso';
}

export interface InventarioResumen {
  totalItems: number;
  valorTotal: number;
  itemsBajoStock: number;
  itemsSinStock: number;
  itemsExceso: number;
  itemsPorCategoria: Record<MaterialCategoria, number>;
  valorPorCategoria: Record<MaterialCategoria, number>;
}