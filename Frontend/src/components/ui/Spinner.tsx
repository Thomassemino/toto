import React from 'react';
import clsx from 'clsx';
import type { SpinProps } from '../../types/ui';

const Spinner: React.FC<SpinProps> = ({
  spinning = true,
  children,
  size = 'md',
  tip,
  delay = 0,
  className
}) => {
  const [showSpinner, setShowSpinner] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowSpinner(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={clsx(
          'animate-spin text-[var(--brand-primary)]',
          sizeClasses[size]
        )}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {tip && (
        <div className="mt-2 text-sm text-[var(--text-muted)]">
          {tip}
        </div>
      )}
    </div>
  );

  if (children) {
    return (
      <div className={clsx('relative', className)}>
        <div className={clsx(spinning && showSpinner && 'opacity-50 pointer-events-none')}>
          {children}
        </div>
        {spinning && showSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80">
            {spinnerElement}
          </div>
        )}
      </div>
    );
  }

  if (!spinning || !showSpinner) {
    return null;
  }

  return (
    <div className={clsx('flex items-center justify-center p-4', className)}>
      {spinnerElement}
    </div>
  );
};

export default Spinner;