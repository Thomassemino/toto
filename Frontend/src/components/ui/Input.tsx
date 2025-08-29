import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputProps } from '../../types/ui';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  error = false,
  prefix,
  suffix,
  loading = false,
  ...props
}, ref) => {
  const hasPrefix = prefix || loading;
  const hasSuffix = suffix;

  return (
    <div className="relative">
      {hasPrefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-[var(--text-muted)]"
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
          ) : (
            prefix
          )}
        </div>
      )}

      <input
        ref={ref}
        className={clsx(
          'input-field',
          error && 'border-[var(--brand-error)] focus:ring-[var(--brand-error)]',
          hasPrefix && 'pl-10',
          hasSuffix && 'pr-10',
          className
        )}
        {...props}
      />

      {hasSuffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;