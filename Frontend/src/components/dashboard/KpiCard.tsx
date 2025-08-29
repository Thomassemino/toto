import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPIData } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/format';

interface KpiCardProps {
  data: KPIData;
  onClick?: () => void;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  data,
  onClick,
  className
}) => {
  const { title, value, change, changeType, icon, color, description } = data;

  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'decrease':
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (title.toLowerCase().includes('costo') || 
          title.toLowerCase().includes('precio') ||
          title.toLowerCase().includes('gasto') ||
          title.toLowerCase().includes('presupuesto')) {
        return formatCurrency(val);
      }
      return formatNumber(val);
    }
    return val;
  };

  return (
    <div
      className={clsx(
        'kpi-card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] truncate">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center mt-2 text-sm">
                {getTrendIcon()}
                <span className={clsx('ml-1', getTrendColor())}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-[var(--text-muted)] ml-1">
                  vs mes anterior
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div className={clsx(
            'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
            color ? `bg-${color}-100 text-${color}-600` : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
          )}>
            {typeof icon === 'string' ? (
              <span className="text-xl">{icon}</span>
            ) : (
              icon
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-muted)]">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default KpiCard;