import React from 'react';
import clsx from 'clsx';
import { 
  Building2, DollarSign, TrendingUp, Users, 
  Package, AlertTriangle, Clock, CheckCircle 
} from 'lucide-react';
import type { KPIData } from '../../types';
import KpiCard from './KpiCard';
import Spinner from '../ui/Spinner';

interface KpiGridProps {
  data?: KPIData[];
  loading?: boolean;
  onKpiClick?: (kpi: KPIData) => void;
  className?: string;
}

// Mock data for demonstration
const getMockKpiData = (): KPIData[] => [
  {
    title: 'Obras Activas',
    value: 24,
    change: 8.2,
    changeType: 'increase',
    icon: <Building2 size={24} />,
    color: 'blue',
    description: '3 obras nuevas este mes'
  },
  {
    title: 'Ingresos Totales',
    value: 2450000,
    change: 12.5,
    changeType: 'increase',
    icon: <DollarSign size={24} />,
    color: 'green',
    description: 'Incluye facturación pendiente'
  },
  {
    title: 'Gastos del Mes',
    value: 890000,
    change: -3.2,
    changeType: 'decrease',
    icon: <TrendingUp size={24} />,
    color: 'orange',
    description: 'Reducción vs mes anterior'
  },
  {
    title: 'Terceros Activos',
    value: 156,
    change: 2.1,
    changeType: 'increase',
    icon: <Users size={24} />,
    color: 'purple',
    description: '12 proveedores, 8 clientes nuevos'
  },
  {
    title: 'Materiales en Stock',
    value: 342,
    change: -5.8,
    changeType: 'decrease',
    icon: <Package size={24} />,
    color: 'indigo',
    description: '23 materiales bajo stock mínimo'
  },
  {
    title: 'Obras con Retraso',
    value: 3,
    change: 0,
    changeType: 'neutral',
    icon: <AlertTriangle size={24} />,
    color: 'red',
    description: 'Promedio de 5 días de retraso'
  },
  {
    title: 'Tiempo Promedio',
    value: '4.2 meses',
    change: -8.1,
    changeType: 'decrease',
    icon: <Clock size={24} />,
    color: 'teal',
    description: 'Duración promedio de obras'
  },
  {
    title: 'Completadas',
    value: 18,
    change: 15.7,
    changeType: 'increase',
    icon: <CheckCircle size={24} />,
    color: 'green',
    description: 'En los últimos 3 meses'
  }
];

const KpiGrid: React.FC<KpiGridProps> = ({
  data,
  loading = false,
  onKpiClick,
  className
}) => {
  const kpiData = data || getMockKpiData();

  if (loading) {
    return (
      <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="kpi-card">
            <Spinner spinning={true}>
              <div className="h-24"></div>
            </Spinner>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {kpiData.map((kpi, index) => (
        <KpiCard
          key={index}
          data={kpi}
          onClick={() => onKpiClick?.(kpi)}
        />
      ))}
    </div>
  );
};

export default KpiGrid;