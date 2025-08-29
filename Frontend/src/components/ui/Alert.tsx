import React from 'react';
import clsx from 'clsx';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import type { AlertProps } from '../../types/ui';
import Button from './Button';

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  description,
  showIcon = true,
  closable = false,
  onClose,
  className
}) => {
  const icons = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
    error: XCircle
  };

  const Icon = icons[type];

  const typeClasses = {
    success: 'alert-success',
    info: 'alert-info',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  return (
    <div className={clsx(typeClasses[type], className)}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <div className={clsx('flex-1', showIcon && 'ml-3')}>
          <h3 className="text-sm font-medium">{message}</h3>
          {description && (
            <div className="mt-2 text-sm opacity-90">
              {description}
            </div>
          )}
        </div>

        {closable && (
          <div className={clsx('flex-shrink-0', showIcon ? 'ml-3' : 'ml-auto')}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-black hover:bg-opacity-10"
              icon={<X size={16} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;