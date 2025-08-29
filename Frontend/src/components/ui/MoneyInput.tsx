import React, { forwardRef } from 'react';
import { Input, InputProps } from './Input';
import { formatCurrency, parseCurrency } from '../../utils/format';

interface MoneyInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number | null) => void;
  currency?: string;
  allowNegative?: boolean;
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, currency = 'ARS', allowNegative = false, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => 
      value ? formatCurrency(value, currency) : ''
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove currency symbol and spaces for parsing
      const cleanValue = inputValue.replace(/[^\d,.-]/g, '');
      
      // Parse the value
      const numericValue = parseCurrency(cleanValue);
      
      // Check negative constraint
      if (!allowNegative && numericValue < 0) {
        return;
      }

      // Update display value
      if (numericValue === null || isNaN(numericValue)) {
        setDisplayValue('');
        onChange?.(null);
      } else {
        setDisplayValue(formatCurrency(numericValue, currency));
        onChange?.(numericValue);
      }
    };

    const handleBlur = () => {
      // Reformat on blur to ensure proper formatting
      if (value !== null && value !== undefined) {
        setDisplayValue(formatCurrency(value, currency));
      }
    };

    React.useEffect(() => {
      if (value !== null && value !== undefined) {
        setDisplayValue(formatCurrency(value, currency));
      } else {
        setDisplayValue('');
      }
    }, [value, currency]);

    return (
      <Input
        ref={ref}
        {...props}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className={`text-right ${props.className || ''}`}
        placeholder={currency === 'ARS' ? '$0,00' : '0.00'}
      />
    );
  }
);

MoneyInput.displayName = 'MoneyInput';