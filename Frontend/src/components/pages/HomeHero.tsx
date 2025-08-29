import React from 'react';
import { Building2, ArrowRight, CheckCircle } from 'lucide-react';

const HomeHero = () => {
  const checkAuth = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      window.location.href = '/dashboard';
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">MaestroObras</h1>
          </div>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Sistema integral de gestión para obras de construcción. 
            Controla proyectos, gastos, materiales y terceros desde una sola plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/login'}
              className="btn-primary text-lg px-8 py-3"
            >
              Iniciar Sesión
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="btn-secondary text-lg px-8 py-3"
            >
              Crear Cuenta
            </button>
          </div>
        </header>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Gestión de Obras
            </h3>
            <p className="text-[var(--text-muted)]">
              Control completo del cronograma, presupuesto y progreso de cada obra.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Control de Gastos
            </h3>
            <p className="text-[var(--text-muted)]">
              Registra y categoriza gastos con aprobaciones y seguimiento detallado.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Inventario de Materiales
            </h3>
            <p className="text-[var(--text-muted)]">
              Gestiona stock, movimientos y proveedores de materiales de construcción.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Gestión de Terceros
            </h3>
            <p className="text-[var(--text-muted)]">
              Administra clientes, proveedores y subcontratistas con facturación integrada.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Reportes y Analytics
            </h3>
            <p className="text-[var(--text-muted)]">
              Genera reportes detallados y visualiza métricas clave del negocio.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <CheckCircle size={24} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              Control de Acceso
            </h3>
            <p className="text-[var(--text-muted)]">
              Roles y permisos granulares para diferentes tipos de usuarios.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            ¿Listo para optimizar tu gestión de obras?
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Únete a cientos de empresas que ya confían en MaestroObras
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            className="btn-primary text-lg px-8 py-3"
          >
            Comenzar ahora
            <ArrowRight size={20} className="ml-2" />
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--text-muted)]">
            © 2025 MaestroObras. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeHero;