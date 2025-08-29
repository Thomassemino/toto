import React from 'react';
import { AppLayout } from '../layout';
import { KpiGrid, RecentActivity, QuickActions } from '../dashboard';
import { DashboardCharts } from '../charts';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { TrendingUp, Building2, Users, Package } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const breadcrumb = [
    { title: 'Inicio', href: '/' },
    { title: 'Dashboard' }
  ];

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Resumen general del sistema"
      breadcrumb={breadcrumb}
      headerExtra={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<TrendingUp size={16} />}
          >
            Exportar Datos
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Building2 size={16} />}
          >
            Nueva Obra
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <KpiGrid />

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Charts */}
        <DashboardCharts />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Obras Críticas"
            extra={<Button variant="ghost" size="sm">Ver todas</Button>}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Plaza Central</p>
                    <p className="text-xs text-[var(--text-muted)]">5 días de retraso</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  Crítico
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Villa Norte</p>
                    <p className="text-xs text-[var(--text-muted)]">Excedió presupuesto</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                  Urgente
                </span>
              </div>
            </div>
          </Card>

          <Card
            title="Terceros Destacados"
            extra={<Button variant="ghost" size="sm" icon={<Users size={14} />}>Ver todos</Button>}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Constructora ABC</p>
                  <p className="text-xs text-[var(--text-muted)]">Cliente principal</p>
                </div>
                <span className="text-xs text-green-600 font-medium">$2.4M</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Materiales del Sur</p>
                  <p className="text-xs text-[var(--text-muted)]">Proveedor confiable</p>
                </div>
                <span className="text-xs text-blue-600 font-medium">98% entrega</span>
              </div>
            </div>
          </Card>

          <Card
            title="Inventario Crítico"
            extra={<Button variant="ghost" size="sm" icon={<Package size={14} />}>Ver stock</Button>}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Cemento Portland</p>
                  <p className="text-xs text-[var(--text-muted)]">Stock bajo</p>
                </div>
                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full">
                  15 bolsas
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Hierro 12mm</p>
                  <p className="text-xs text-[var(--text-muted)]">Restock requerido</p>
                </div>
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                  5 barras
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;