import React from 'react';
import clsx from 'clsx';
import { 
  Building2, DollarSign, Package, Users, 
  Calendar, Clock, ArrowRight 
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatDateTime, formatCurrency } from '../../utils/format';

interface ActivityItem {
  id: string;
  type: 'obra' | 'gasto' | 'material' | 'tercero';
  title: string;
  description: string;
  amount?: number;
  time: string;
  href?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  loading?: boolean;
  onViewAll?: () => void;
  className?: string;
}

// Mock data
const getMockActivities = (): ActivityItem[] => [
  {
    id: '1',
    type: 'obra',
    title: 'Nueva obra creada',
    description: 'Construcción Plaza Central - Villa Norte',
    time: '2024-01-15T10:30:00Z',
    href: '/obras/plaza-central'
  },
  {
    id: '2',
    type: 'gasto',
    title: 'Gasto aprobado',
    description: 'Materiales para cimentación',
    amount: 45000,
    time: '2024-01-15T09:15:00Z',
    href: '/gastos/MAT-001'
  },
  {
    id: '3',
    type: 'material',
    title: 'Stock bajo detectado',
    description: 'Cemento Portland - Solo 15 bolsas restantes',
    time: '2024-01-15T08:45:00Z',
    href: '/materiales/cemento-portland'
  },
  {
    id: '4',
    type: 'tercero',
    title: 'Nuevo proveedor',
    description: 'Materiales del Norte S.A. agregado al sistema',
    time: '2024-01-14T16:20:00Z',
    href: '/terceros/materiales-norte'
  },
  {
    id: '5',
    type: 'obra',
    title: 'Milestone completado',
    description: 'Estructura terminada en Edificio Los Álamos',
    time: '2024-01-14T14:10:00Z',
    href: '/obras/edificio-alamos'
  }
];

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
  onViewAll,
  className
}) => {
  const activityData = activities || getMockActivities();

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'obra':
        return <Building2 size={16} className="text-blue-600" />;
      case 'gasto':
        return <DollarSign size={16} className="text-green-600" />;
      case 'material':
        return <Package size={16} className="text-orange-600" />;
      case 'tercero':
        return <Users size={16} className="text-purple-600" />;
      default:
        return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'obra':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'gasto':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'material':
        return 'bg-orange-100 dark:bg-orange-900/20';
      case 'tercero':
        return 'bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <Card
      title="Actividad Reciente"
      extra={
        onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Ver todo
          </Button>
        )
      }
      loading={loading}
      className={className}
    >
      {activityData.length > 0 ? (
        <div className="space-y-4">
          {activityData.map((activity) => (
            <div
              key={activity.id}
              className={clsx(
                'flex items-start gap-3 p-3 rounded-lg transition-colors',
                activity.href ? 'hover:bg-[var(--bg-secondary)] cursor-pointer' : ''
              )}
              onClick={() => {
                if (activity.href && typeof window !== 'undefined') {
                  window.location.href = activity.href;
                }
              }}
            >
              <div className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                getTypeColor(activity.type)
              )}>
                {getIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-[var(--text-muted)] truncate mt-1">
                      {activity.description}
                    </p>
                    {activity.amount && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {formatCurrency(activity.amount)}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <div className="flex items-center text-xs text-[var(--text-muted)]">
                      <Clock size={12} className="mr-1" />
                      {formatDateTime(activity.time, { relative: true })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)]">No hay actividad reciente</p>
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;