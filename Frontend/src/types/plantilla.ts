import { BaseEntity } from './index';
import { PresupuestoItem } from './obra';

export interface Plantilla extends BaseEntity {
  nombre: string;
  descripcion?: string;
  categoria: string;
  activa: boolean;
  items: PlantillaItem[];
  usuarioCreador: string;
  vecesUsada: number;
  tags?: string[];
}

export interface PlantillaItem {
  codigo?: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
  categoria: string;
  orden?: number;
  notas?: string;
}

export interface CreatePlantillaData {
  nombre: string;
  descripcion?: string;
  categoria: string;
  items: Omit<PlantillaItem, 'id'>[];
  tags?: string[];
}

export interface UpdatePlantillaData extends Partial<CreatePlantillaData> {
  activa?: boolean;
}

export interface PlantillaFilters {
  categoria?: string[];
  activa?: boolean;
  usuarioCreador?: string[];
  tags?: string[];
}

// Para aplicar plantilla a presupuesto
export interface AplicarPlantillaData {
  plantillaId: string;
  obraId: string;
  version?: number;
  ajustePorcentaje?: number; // Para ajustar precios
}