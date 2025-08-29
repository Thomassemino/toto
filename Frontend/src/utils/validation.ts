import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string()
  .min(1, 'El email es requerido')
  .email('Formato de email inválido');

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

export const phoneSchema = z.string()
  .optional()
  .refine((val) => !val || /^[+]?[\d\s\-\(\)]{7,15}$/.test(val), {
    message: 'Formato de teléfono inválido'
  });

export const currencySchema = z.number()
  .min(0, 'El monto debe ser mayor o igual a 0')
  .max(999999999, 'El monto es demasiado alto');

export const percentageSchema = z.number()
  .min(0, 'El porcentaje debe ser mayor o igual a 0')
  .max(100, 'El porcentaje debe ser menor o igual a 100');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
  remember: z.boolean().optional()
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Obra schemas
export const obraSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  cliente: z.string().min(1, 'El cliente es requerido'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFinPrevista: z.string().optional(),
  presupuestoTotal: currencySchema,
  jefeObra: z.string().optional(),
  observaciones: z.string().optional(),
  coordenadas: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

export const gastoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  descripcion: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  categoria: z.enum(['materiales', 'mano_obra', 'equipos', 'servicios', 'otros']),
  monto: currencySchema,
  proveedor: z.string().optional(),
  metodoPago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta']),
  numeroFactura: z.string().optional(),
  observaciones: z.string().optional()
});

// Tercero schemas
export const terceroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().optional(),
  razonSocial: z.string().optional(),
  tipoDocumento: z.enum(['DNI', 'CUIT', 'CUIL', 'PASAPORTE']),
  numeroDocumento: z.string().min(1, 'El número de documento es requerido'),
  email: emailSchema.optional().or(z.literal('')),
  telefono: phoneSchema,
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigoPostal: z.string().optional(),
  tipo: z.array(z.enum(['cliente', 'proveedor', 'subcontratista', 'empleado', 'consultor'])),
  contactoPrincipal: z.string().optional(),
  sitioWeb: z.string().url('URL inválida').optional().or(z.literal('')),
  condicionIva: z.enum(['inscripto', 'monotributo', 'exento', 'consumidor_final', 'responsable_no_inscripto']).optional(),
  observaciones: z.string().optional()
});

// Material schemas
export const materialSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  categoria: z.enum([
    'cemento_hormigon', 'ladrillos_bloques', 'hierros_aceros', 'maderas',
    'pinturas_revestimientos', 'instalaciones_electricas', 'instalaciones_sanitarias',
    'aislantes', 'herramientas', 'seguridad', 'otros'
  ]),
  subcategoria: z.string().optional(),
  unidad: z.enum(['kg', 'm', 'm2', 'm3', 'unidad', 'litro', 'tonelada', 'caja', 'bolsa', 'rollo', 'metro_lineal']),
  costoUnitario: currencySchema.optional(),
  stockMinimo: z.number().min(0, 'El stock mínimo debe ser mayor o igual a 0').optional(),
  ubicacion: z.string().optional(),
  proveedor: z.string().optional(),
  observaciones: z.string().optional()
});

export const movimientoMaterialSchema = z.object({
  tipo: z.enum(['ingreso', 'egreso', 'ajuste']),
  cantidad: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  descripcion: z.string().optional(),
  obraId: z.string().optional(),
  documentoReferencia: z.string().optional(),
  costoUnitario: currencySchema.optional()
});

// User schemas
export const updateProfileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: phoneSchema,
  timezone: z.string().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

// Report schemas
export const reporteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipo: z.enum([
    'obras_general', 'obras_detalle', 'gastos_por_obra', 'gastos_por_categoria',
    'terceros_general', 'facturas_pendientes', 'materiales_stock',
    'materiales_movimientos', 'rentabilidad', 'cronograma', 'personalizado'
  ]),
  descripcion: z.string().optional(),
  formato: z.enum(['pdf', 'excel', 'csv']),
  programado: z.boolean().optional(),
  frecuencia: z.enum(['diario', 'semanal', 'mensual', 'trimestral']).optional(),
  parametros: z.object({
    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional(),
    obras: z.array(z.string()).optional(),
    terceros: z.array(z.string()).optional(),
    materiales: z.array(z.string()).optional(),
    estados: z.array(z.string()).optional(),
    categorias: z.array(z.string()).optional(),
    incluirDetalle: z.boolean().optional(),
    incluirGraficos: z.boolean().optional(),
    filtrosAdicionales: z.record(z.any()).optional()
  })
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ObraFormData = z.infer<typeof obraSchema>;
export type GastoFormData = z.infer<typeof gastoSchema>;
export type TerceroFormData = z.infer<typeof terceroSchema>;
export type MaterialFormData = z.infer<typeof materialSchema>;
export type MovimientoMaterialFormData = z.infer<typeof movimientoMaterialSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ReporteFormData = z.infer<typeof reporteSchema>;