require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../src/models/user');
const Obra = require('../src/models/obra');
const PresupuestoVersion = require('../src/models/presupuestoVersion');
const Pago = require('../src/models/pago');
const Gasto = require('../src/models/gasto');
const Tercero = require('../src/models/tercero');
const InventarioItem = require('../src/models/inventarioItem');
const MovimientoStock = require('../src/models/movimientoStock');
const Hito = require('../src/models/hito');
const Adjunto = require('../src/models/adjunto');

const limpiarBD = async () => {
  try {
    await User.deleteMany({});
    await Obra.deleteMany({});
    await PresupuestoVersion.deleteMany({});
    await Pago.deleteMany({});
    await Gasto.deleteMany({});
    await Tercero.deleteMany({});
    await InventarioItem.deleteMany({});
    await MovimientoStock.deleteMany({});
    await Hito.deleteMany({});
    await Adjunto.deleteMany({});
    console.log('✅ Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando BD:', error);
  }
};

const crearUsuarios = async () => {
  const usuarios = [
    {
      email: 'admin@maestroobras.com',
      password: 'admin123',
      nombre: 'Administrador Sistema',
      rol: 'admin',
      obrasAsignadas: []
    },
    {
      email: 'jefe1@maestroobras.com',
      password: 'jefe123',
      nombre: 'Carlos Rodríguez',
      rol: 'jefe_obra',
      obrasAsignadas: []
    },
    {
      email: 'jefe2@maestroobras.com',
      password: 'jefe123',
      nombre: 'Ana Martínez',
      rol: 'jefe_obra',
      obrasAsignadas: []
    },
    {
      email: 'deposito@maestroobras.com',
      password: 'deposito123',
      nombre: 'Miguel Fernández',
      rol: 'deposito',
      obrasAsignadas: []
    },
    {
      email: 'lectura@maestroobras.com',
      password: 'lectura123',
      nombre: 'Sofia López',
      rol: 'lectura',
      obrasAsignadas: []
    }
  ];

  const usuariosCreados = [];
  for (const userData of usuarios) {
    const usuario = new User(userData);
    await usuario.save();
    usuariosCreados.push(usuario);
  }

  console.log('✅ Usuarios creados');
  return usuariosCreados;
};

const crearTerceros = async (adminUser) => {
  const terceros = [
    {
      nombre: 'Materiales San Martín S.A.',
      cuit: '30-12345678-9',
      email: 'ventas@sanmartin.com.ar',
      telefono: '+54 11 4567-8901',
      tipo: 'proveedor',
      creadoPor: adminUser._id
    },
    {
      nombre: 'Hierros del Norte',
      cuit: '33-87654321-0',
      email: 'info@hierrosnorte.com.ar',
      telefono: '+54 11 4567-8902',
      tipo: 'proveedor',
      creadoPor: adminUser._id
    },
    {
      nombre: 'Construcciones Pérez',
      cuit: '20-11223344-5',
      email: 'perez@construcciones.com.ar',
      telefono: '+54 11 4567-8903',
      tipo: 'contratista',
      creadoPor: adminUser._id
    },
    {
      nombre: 'Cuadrilla Los Álamos',
      telefono: '+54 11 4567-8904',
      tipo: 'cuadrilla',
      creadoPor: adminUser._id
    }
  ];

  const tercerosCreados = [];
  for (const terceroData of terceros) {
    const tercero = new Tercero(terceroData);
    await tercero.save();
    tercerosCreados.push(tercero);
  }

  console.log('✅ Terceros creados');
  return tercerosCreados;
};

const crearObras = async (usuarios) => {
  const [admin, jefe1, jefe2] = usuarios;

  const obras = [
    {
      nombre: 'Edificio Río de la Plata',
      estado: 'activa',
      fechaInicio: new Date('2024-01-15'),
      moneda: 'ARS',
      etiquetas: ['torre', 'premium', 'centro'],
      cliente: {
        nombre: 'Inmobiliaria ACME S.A.',
        contacto: '+54 11 5555-5555'
      },
      ubicacion: {
        ciudad: 'La Plata',
        provincia: 'Buenos Aires',
        direccion: 'Av. 7 N° 1234'
      },
      superficie_m2: 3200,
      presupuestoVigente: 120000000,
      avancePct: 35,
      config: { avancePorHitos: true },
      creadaPor: admin._id
    },
    {
      nombre: 'Casa Country Los Sauces',
      estado: 'activa',
      fechaInicio: new Date('2024-02-01'),
      moneda: 'ARS',
      etiquetas: ['casa', 'country'],
      cliente: {
        nombre: 'Familia González',
        contacto: '+54 11 6666-6666'
      },
      ubicacion: {
        ciudad: 'Tigre',
        provincia: 'Buenos Aires',
        direccion: 'Los Sauces Lote 45'
      },
      superficie_m2: 450,
      presupuestoVigente: 25000000,
      avancePct: 60,
      config: { avancePorHitos: false },
      creadaPor: admin._id
    },
    {
      nombre: 'Complejo Industrial Norte',
      estado: 'finalizada',
      fechaInicio: new Date('2023-08-01'),
      fechaFin: new Date('2024-01-15'),
      moneda: 'ARS',
      etiquetas: ['industrial', 'galpón'],
      cliente: {
        nombre: 'Metalúrgica Industrial Ltda.',
        contacto: '+54 11 7777-7777'
      },
      ubicacion: {
        ciudad: 'San Fernando',
        provincia: 'Buenos Aires'
      },
      superficie_m2: 8000,
      presupuestoVigente: 180000000,
      avancePct: 100,
      config: { avancePorHitos: true },
      creadaPor: admin._id
    }
  ];

  const obrasCreadas = [];
  for (const obraData of obras) {
    const obra = new Obra(obraData);
    await obra.save();
    obrasCreadas.push(obra);
  }

  jefe1.obrasAsignadas = [obrasCreadas[0]._id, obrasCreadas[2]._id];
  jefe2.obrasAsignadas = [obrasCreadas[1]._id];
  await jefe1.save();
  await jefe2.save();

  console.log('✅ Obras creadas');
  return obrasCreadas;
};

const crearPresupuestos = async (obras, usuarios) => {
  const [admin] = usuarios;

  for (const obra of obras) {
    if (obra.nombre === 'Edificio Río de la Plata') {
      const presupuestos = [
        {
          obraId: obra._id,
          version: 'v1',
          monto: 100000000,
          vigente: false,
          descripcion: 'Presupuesto inicial',
          creadoPor: admin._id
        },
        {
          obraId: obra._id,
          version: 'v2',
          monto: 120000000,
          vigente: true,
          descripcion: 'Ajuste por incremento materiales',
          creadoPor: admin._id
        }
      ];

      for (const presupuestoData of presupuestos) {
        const presupuesto = new PresupuestoVersion(presupuestoData);
        await presupuesto.save();
      }
    } else {
      const presupuesto = new PresupuestoVersion({
        obraId: obra._id,
        version: 'v1',
        monto: obra.presupuestoVigente,
        vigente: true,
        descripcion: 'Presupuesto inicial',
        creadoPor: admin._id
      });
      await presupuesto.save();
    }
  }

  console.log('✅ Presupuestos creados');
};

const crearPagos = async (obras, usuarios) => {
  const [admin] = usuarios;

  const pagosData = [
    {
      obraId: obras[0]._id,
      monto: 30000000,
      fechaRecepcion: new Date('2024-01-20'),
      metodo: 'Transferencia bancaria',
      observaciones: 'Anticipo 25%',
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      monto: 24000000,
      fechaRecepcion: new Date('2024-02-15'),
      metodo: 'Cheque',
      observaciones: 'Pago certificado febrero',
      creadoPor: admin._id
    },
    {
      obraId: obras[1]._id,
      monto: 10000000,
      fechaRecepcion: new Date('2024-02-05'),
      metodo: 'Efectivo',
      observaciones: 'Anticipo obra',
      creadoPor: admin._id
    }
  ];

  for (const pagoData of pagosData) {
    const pago = new Pago(pagoData);
    await pago.save();
  }

  console.log('✅ Pagos creados');
};

const crearGastos = async (obras, terceros, usuarios) => {
  const [admin] = usuarios;
  const [proveedor1, proveedor2, contratista] = terceros;

  const gastosData = [
    {
      obraId: obras[0]._id,
      tipo: 'materiales',
      descripcion: 'Cemento Portland x50 bolsas',
      monto: 850000,
      fecha: new Date('2024-01-25'),
      proveedorId: proveedor1._id,
      etiquetas: ['cemento', 'estructura'],
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      tipo: 'materiales',
      descripcion: 'Hierro del 8 - 2 toneladas',
      monto: 1200000,
      fecha: new Date('2024-01-28'),
      proveedorId: proveedor2._id,
      etiquetas: ['hierro', 'estructura'],
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      tipo: 'mano_obra',
      descripcion: 'Armado columnas planta baja',
      monto: 2500000,
      fecha: new Date('2024-02-05'),
      contratistaId: contratista._id,
      etiquetas: ['estructura', 'armado'],
      creadoPor: admin._id
    },
    {
      obraId: obras[1]._id,
      tipo: 'materiales',
      descripcion: 'Ladrillo común x5000 unidades',
      monto: 450000,
      fecha: new Date('2024-02-08'),
      proveedorId: proveedor1._id,
      etiquetas: ['mampostería'],
      creadoPor: admin._id
    }
  ];

  for (const gastoData of gastosData) {
    const gasto = new Gasto(gastoData);
    await gasto.save();
  }

  console.log('✅ Gastos creados');
};

const crearInventario = async (obras, usuarios) => {
  const [admin] = usuarios;

  const itemsData = [
    {
      obraId: obras[0]._id,
      nombreItem: 'Bolsas de cemento Portland 50kg',
      cantidadActual: 25,
      stockMinimo: 50,
      unidadMedida: 'bolsas',
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      nombreItem: 'Varillas hierro del 8mm',
      cantidadActual: 120,
      stockMinimo: 100,
      unidadMedida: 'unidades',
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      nombreItem: 'Arena gruesa',
      cantidadActual: 8,
      stockMinimo: 15,
      unidadMedida: 'm3',
      creadoPor: admin._id
    },
    {
      obraId: obras[1]._id,
      nombreItem: 'Ladrillos comunes',
      cantidadActual: 2500,
      stockMinimo: 1000,
      unidadMedida: 'unidades',
      creadoPor: admin._id
    }
  ];

  const itemsCreados = [];
  for (const itemData of itemsData) {
    const item = new InventarioItem(itemData);
    await item.save();
    itemsCreados.push(item);
  }

  const movimientos = [
    {
      obraId: obras[0]._id,
      itemId: itemsCreados[0]._id,
      tipo: 'ingreso',
      cantidad: 100,
      fecha: new Date('2024-01-25'),
      motivo: 'Compra inicial',
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      itemId: itemsCreados[0]._id,
      tipo: 'egreso',
      cantidad: -75,
      fecha: new Date('2024-02-01'),
      motivo: 'Consumo fundación',
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      itemId: itemsCreados[1]._id,
      tipo: 'ingreso',
      cantidad: 200,
      fecha: new Date('2024-01-28'),
      motivo: 'Compra hierros',
      creadoPor: admin._id
    }
  ];

  for (const movimientoData of movimientos) {
    const movimiento = new MovimientoStock(movimientoData);
    await movimiento.save();
  }

  console.log('✅ Inventario y movimientos creados');
};

const crearHitos = async (obras, usuarios) => {
  const [admin] = usuarios;

  const hitosData = [
    {
      obraId: obras[0]._id,
      titulo: 'Excavación y fundación',
      descripcion: 'Excavación del terreno y construcción de fundación',
      pesoPct: 15,
      estado: 'completado',
      fechaVencimiento: new Date('2024-02-15'),
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      titulo: 'Estructura hasta planta baja',
      descripcion: 'Columnas, vigas y losa de planta baja',
      pesoPct: 20,
      estado: 'completado',
      fechaVencimiento: new Date('2024-03-15'),
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      titulo: 'Estructura primer piso',
      descripcion: 'Columnas, vigas y losa del primer piso',
      pesoPct: 20,
      estado: 'en_proceso',
      fechaVencimiento: new Date('2024-04-15'),
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      titulo: 'Mampostería',
      descripcion: 'Levantamiento de paredes interiores y exteriores',
      pesoPct: 25,
      estado: 'pendiente',
      fechaVencimiento: new Date('2024-05-30'),
      creadoPor: admin._id
    },
    {
      obraId: obras[0]._id,
      titulo: 'Terminaciones',
      descripcion: 'Revoques, pisos, sanitarios y terminaciones',
      pesoPct: 20,
      estado: 'pendiente',
      fechaVencimiento: new Date('2024-07-31'),
      creadoPor: admin._id
    }
  ];

  for (const hitoData of hitosData) {
    const hito = new Hito(hitoData);
    await hito.save();
  }

  console.log('✅ Hitos creados');
};

const ejecutarSeed = async () => {
  try {
    console.log('🚀 Iniciando seed de datos...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado a MongoDB');

    await limpiarBD();
    
    const usuarios = await crearUsuarios();
    const terceros = await crearTerceros(usuarios[0]);
    const obras = await crearObras(usuarios);
    
    await crearPresupuestos(obras, usuarios);
    await crearPagos(obras, usuarios);
    await crearGastos(obras, terceros, usuarios);
    await crearInventario(obras, usuarios);
    await crearHitos(obras, usuarios);

    console.log('');
    console.log('🎉 Seed completado exitosamente!');
    console.log('');
    console.log('📋 Usuarios creados:');
    console.log('   Admin: admin@maestroobras.com / admin123');
    console.log('   Jefe 1: jefe1@maestroobras.com / jefe123');
    console.log('   Jefe 2: jefe2@maestroobras.com / jefe123');
    console.log('   Depósito: deposito@maestroobras.com / deposito123');
    console.log('   Lectura: lectura@maestroobras.com / lectura123');
    console.log('');

  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

if (require.main === module) {
  ejecutarSeed();
}

module.exports = ejecutarSeed;