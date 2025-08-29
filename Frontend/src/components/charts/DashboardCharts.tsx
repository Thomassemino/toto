import React from 'react';
import BaseChart from './BaseChart';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/format';

interface DashboardChartsProps {
  className?: string;
}

// Mock data for demonstration
const getMockChartData = () => {
  const monthlyRevenue = [
    { name: 'Ene', value: 450000, gastos: 320000 },
    { name: 'Feb', value: 520000, gastos: 380000 },
    { name: 'Mar', value: 480000, gastos: 410000 },
    { name: 'Abr', value: 610000, gastos: 350000 },
    { name: 'May', value: 580000, gastos: 420000 },
    { name: 'Jun', value: 690000, gastos: 480000 },
  ];

  const obrasPorEstado = [
    { name: 'En Proceso', value: 12 },
    { name: 'Planificadas', value: 8 },
    { name: 'Completadas', value: 18 },
    { name: 'Pausadas', value: 3 },
  ];

  const gastosPorCategoria = [
    { name: 'Materiales', value: 450000 },
    { name: 'Mano de Obra', value: 320000 },
    { name: 'Equipos', value: 180000 },
    { name: 'Servicios', value: 95000 },
    { name: 'Otros', value: 55000 },
  ];

  const progresoObras = [
    { name: 'Semana 1', completadas: 2, iniciadas: 3 },
    { name: 'Semana 2', completadas: 4, iniciadas: 2 },
    { name: 'Semana 3', completadas: 1, iniciadas: 4 },
    { name: 'Semana 4', completadas: 3, iniciadas: 1 },
  ];

  return {
    monthlyRevenue,
    obrasPorEstado,
    gastosPorCategoria,
    progresoObras
  };
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ className }) => {
  const { monthlyRevenue, obrasPorEstado, gastosPorCategoria, progresoObras } = getMockChartData();

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos vs Gastos */}
        <Card title="Ingresos vs Gastos Mensuales">
          <BaseChart
            type="area"
            data={monthlyRevenue}
            xAxis="name"
            yAxis="value"
            height={300}
            colors={['#10b981', '#ef4444']}
          />
        </Card>

        {/* Obras por Estado */}
        <Card title="Distribución de Obras por Estado">
          <BaseChart
            type="pie"
            data={obrasPorEstado}
            xAxis="name"
            yAxis="value"
            height={300}
            colors={['#3b82f6', '#f59e0b', '#10b981', '#ef4444']}
          />
        </Card>

        {/* Gastos por Categoría */}
        <Card title="Gastos por Categoría">
          <BaseChart
            type="bar"
            data={gastosPorCategoria}
            xAxis="name"
            yAxis="value"
            height={300}
            colors={['#8b5cf6']}
          />
        </Card>

        {/* Progreso de Obras */}
        <Card title="Progreso de Obras (Últimas 4 Semanas)">
          <BaseChart
            type="line"
            data={progresoObras}
            xAxis="name"
            yAxis="completadas"
            height={300}
            colors={['#06b6d4', '#f97316']}
            legend={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;