import React from 'react';
import clsx from 'clsx';
import type { FormFieldProps } from '../../types/ui';

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  required = false,
  error,
  help,
  children,
  className
}) => {
  const hasError = Boolean(error);

  return (
    <div className={clsx('space-y-1', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
          {required && (
            <span className="text-[var(--brand-error)] ml-1" aria-label="Required">*</span>
          )}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id: name,
          name,
          'aria-invalid': hasError,
          'aria-describedby': hasError ? `${name}-error` : help ? `${name}-help` : undefined,
        })}
      </div>

      {/* Error message */}
      {hasError && (
        <p
          id={`${name}-error`}
          className="text-sm text-[var(--brand-error)]"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Help text */}
      {help && !hasError && (
        <p
          id={`${name}-help`}
          className="text-sm text-[var(--text-muted)]"
        >
          {help}
        </p>
      )}
    </div>
  );
};

export default FormField;