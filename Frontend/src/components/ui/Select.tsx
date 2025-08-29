import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown, X, Search } from 'lucide-react';
import type { SelectProps, SelectOption } from '../../types/ui';

const Select: React.FC<SelectProps> = ({
  options = [],
  value,
  defaultValue,
  placeholder = 'Seleccionar...',
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  disabled = false,
  error = false,
  onChange,
  onSearch,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [internalValue, setInternalValue] = useState(value || defaultValue || (multiple ? [] : ''));
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Update internal value when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search
  const filteredOptions = searchValue && searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  // Get selected option(s) for display
  const getSelectedOptions = () => {
    if (multiple && Array.isArray(internalValue)) {
      return options.filter(option => internalValue.includes(option.value));
    } else if (!multiple && internalValue) {
      return options.find(option => option.value === internalValue);
    }
    return multiple ? [] : null;
  };

  const selectedOptions = getSelectedOptions();

  // Handle option selection
  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    let newValue;

    if (multiple) {
      const currentValue = Array.isArray(internalValue) ? internalValue : [];
      if (currentValue.includes(option.value)) {
        newValue = currentValue.filter(v => v !== option.value);
      } else {
        newValue = [...currentValue, option.value];
      }
    } else {
      newValue = option.value;
      setIsOpen(false);
    }

    setInternalValue(newValue);
    onChange?.(newValue);
    setSearchValue('');
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = multiple ? [] : '';
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  // Remove selected option (multiple mode)
  const removeOption = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Array.isArray(internalValue)) {
      const newValue = internalValue.filter(v => v !== optionValue);
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const hasValue = multiple
    ? Array.isArray(internalValue) && internalValue.length > 0
    : internalValue !== '' && internalValue !== null && internalValue !== undefined;

  return (
    <div ref={selectRef} className={clsx('relative', className)}>
      <div
        className={clsx(
          'input-field cursor-pointer flex items-center justify-between min-h-[2.5rem]',
          error && 'border-[var(--brand-error)] focus:ring-[var(--brand-error)]',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'ring-2 ring-[var(--brand-primary)] border-transparent'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex items-center gap-1 min-w-0">
          {multiple && Array.isArray(selectedOptions) ? (
            selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded text-sm"
                  >
                    <span className="truncate">{option.label}</span>
                    <X
                      size={14}
                      className="cursor-pointer hover:text-[var(--brand-error)] flex-shrink-0"
                      onClick={(e) => removeOption(option.value, e)}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[var(--text-muted)] truncate">{placeholder}</span>
            )
          ) : (
            <span className={clsx(
              'truncate',
              selectedOptions ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
            )}>
              {selectedOptions ? (selectedOptions as SelectOption).label : placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {loading && (
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
          )}

          {clearable && hasValue && !loading && (
            <X
              size={16}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              onClick={handleClear}
            />
          )}

          <ChevronDown
            size={16}
            className={clsx(
              'text-[var(--text-muted)] transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg shadow-[var(--shadow-color)] max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-[var(--border-color)]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  ref={searchRef}
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="Buscar..."
                  value={searchValue}
                  onChange={handleSearch}
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = multiple
                  ? Array.isArray(internalValue) && internalValue.includes(option.value)
                  : internalValue === option.value;

                return (
                  <div
                    key={option.value}
                    className={clsx(
                      'px-3 py-2 cursor-pointer flex items-center justify-between',
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[var(--bg-secondary)]',
                      isSelected && 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary)]'
                    )}
                    onClick={() => handleOptionClick(option)}
                  >
                    <span className="truncate">{option.label}</span>
                    {multiple && isSelected && (
                      <svg
                        className="w-4 h-4 flex-shrink-0 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-[var(--text-muted)] text-center">
                No hay opciones disponibles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;