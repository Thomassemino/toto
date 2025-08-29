import React, { forwardRef } from 'react';
import { Input, InputProps } from './Input';
import { formatDate, parseDate } from '../../utils/format';

interface DateFieldProps extends Omit<InputProps, 'value' | 'onChange' | 'type'> {
  value?: string | Date;
  onChange?: (value: string) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ value, onChange, minDate, maxDate, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      if (!value) return '';
      return typeof value === 'string' ? value : formatDate(value, 'DD/MM/YYYY');
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow partial input during typing
      setDisplayValue(inputValue);
      
      // Try to parse complete dates
      if (inputValue.length === 10) {
        const parsedDate = parseDate(inputValue, 'DD/MM/YYYY');
        if (parsedDate) {
          onChange?.(inputValue);
        }
      } else if (inputValue === '') {
        onChange?.('');
      }
    };

    const handleBlur = () => {
      if (displayValue && displayValue.length === 10) {
        const parsedDate = parseDate(displayValue, 'DD/MM/YYYY');
        if (parsedDate) {
          const formattedDate = formatDate(parsedDate, 'DD/MM/YYYY');
          setDisplayValue(formattedDate);
          onChange?.(formattedDate);
        }
      }
    };

    React.useEffect(() => {
      if (value) {
        const dateStr = typeof value === 'string' ? value : formatDate(value, 'DD/MM/YYYY');
        setDisplayValue(dateStr);
      } else {
        setDisplayValue('');
      }
    }, [value]);

    return (
      <Input
        ref={ref}
        {...props}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="DD/MM/AAAA"
        maxLength={10}
        className={`${props.className || ''}`}
      />
    );
  }
);

DateField.displayName = 'DateField';