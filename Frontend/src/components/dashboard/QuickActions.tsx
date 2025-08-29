import React from 'react';
import clsx from 'clsx';
import { 
  Plus, Building2, Users, Package, 
  FileText, Upload, Calculator, BarChart3 
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROLE } from '../../constants';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  roles?: string[];
}

interface QuickActionsProps {
  onActionClick?: (action: QuickAction) => void;
  className?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'nueva-obra',
    title: 'Nueva Obra',
    description: 'Crear una nueva obra',
    icon: <Building2 size={20} />,
    href: '/obras/nueva',
    color: 'blue',
    roles: [ROLE.Admin, ROLE.JefeObra]
  },
  {
    id: 'registrar-gasto',
    title: 'Registrar Gasto',
    description: 'Agregar nuevo gasto',
    icon: <Calculator size={20} />,
    href: '/gastos/nuevo',
    color: 'green',
    roles: [ROLE.Admin, ROLE.JefeObra]
  },
  {
    id: 'nuevo-tercero',
    title: 'Nuevo Tercero',
    description: 'Agregar cliente/proveedor',
    icon: <Users size={20} />,
    href: '/terceros/nuevo',
    color: 'purple',
    roles: [ROLE.Admin, ROLE.JefeObra]
  },
  {
    id: 'movimiento-material',
    title: 'Mover Material',
    description: 'Registrar movimiento',
    icon: <Package size={20} />,
    href: '/materiales/movimiento',
    color: 'orange',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Deposito]
  },
  {
    id: 'generar-reporte',
    title: 'Generar Reporte',
    description: 'Crear nuevo reporte',
    icon: <BarChart3 size={20} />,
    href: '/reportes/generar',
    color: 'indigo',
    roles: [ROLE.Admin, ROLE.JefeObra, ROLE.Lectura]
  },
  {
    id: 'subir-documento',
    title: 'Subir Documento',
    description: 'Adjuntar archivo',
    icon: <Upload size={20} />,
    href: '/documentos/subir',
    color: 'teal',
    roles: [ROLE.Admin, ROLE.JefeObra]
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
  className
}) => {
  const { hasRole } = useAuth();

  // Filter actions based on user roles
  const availableActions = QUICK_ACTIONS.filter(action => {
    if (!action.roles || action.roles.length === 0) return true;
    return action.roles.some(role => hasRole(role));
  });

  const handleActionClick = (action: QuickAction) => {
    onActionClick?.(action);
    
    // Default behavior: navigate to href
    if (typeof window !== 'undefined') {
      window.location.href = action.href;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30',
      teal: 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/30',
    };
    
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Card
      title="Acciones Rápidas"
      className={className}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableActions.map((action) => (
          <button
            key={action.id}
            className={clsx(
              'p-4 rounded-lg border-2 border-dashed border-transparent transition-all duration-200',
              'hover:border-current focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2',
              getColorClasses(action.color)
            )}
            onClick={() => handleActionClick(action)}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">
                  {action.title}
                </h4>
                <p className="text-xs opacity-80 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {availableActions.length === 0 && (
        <div className="text-center py-8">
          <Plus size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-[var(--text-muted)]">No hay acciones disponibles</p>
        </div>
      )}
    </Card>
  );
};

export default QuickActions;