import React from 'react';
import clsx from 'clsx';
import type { CardProps } from '../../types/ui';

const Card: React.FC<CardProps> = ({
  title,
  extra,
  children,
  loading = false,
  bordered = true,
  hoverable = false,
  actions,
  cover,
  className
}) => {
  return (
    <div
      className={clsx(
        'bg-[var(--bg-primary)] rounded-lg overflow-hidden',
        bordered && 'border border-[var(--border-color)]',
        hoverable && 'hover:shadow-md hover:shadow-[var(--shadow-color)] transition-shadow cursor-pointer',
        !bordered && 'shadow-sm shadow-[var(--shadow-color)]',
        className
      )}
    >
      {/* Cover */}
      {cover && (
        <div className="w-full">
          {cover}
        </div>
      )}

      {/* Header */}
      {(title || extra) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          {title && (
            <div className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </div>
          )}
          {extra && (
            <div className="flex-shrink-0">
              {extra}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {/* Skeleton loader */}
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"></div>
              <div className="space-y-2 mt-3">
                <div className="h-4 bg-[var(--bg-secondary)] rounded"></div>
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6"></div>
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex border-t border-[var(--border-color)]">
          {actions.map((action, index) => (
            <div
              key={index}
              className={clsx(
                'flex-1 px-4 py-3 text-center',
                index > 0 && 'border-l border-[var(--border-color)]'
              )}
            >
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;