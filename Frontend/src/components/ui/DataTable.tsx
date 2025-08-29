import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { 
  ChevronUp, ChevronDown, ChevronsUpDown, 
  Search, Filter, MoreVertical, Eye, Edit, Trash2 
} from 'lucide-react';
import type { TableProps, TableColumn, PaginationConfig } from '../../types/ui';
import Button from './Button';
import Input from './Input';
import Spinner from './Spinner';
import Select from './Select';

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  rowKey = 'id',
  onRowClick,
  onSelectionChange,
  selectable = false,
  sortBy,
  sortOrder,
  onSortChange,
  filters,
  onFilterChange,
  emptyText = 'No hay datos disponibles',
  className
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Generate row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(record => {
      return columns.some(column => {
        const value = column.dataIndex ? record[column.dataIndex] : '';
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Handle row selection
  const handleRowSelection = (rowKey: string, checked: boolean) => {
    const newSelectedRows = checked
      ? [...selectedRows, rowKey]
      : selectedRows.filter(key => key !== rowKey);

    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows, data.filter((record, index) => 
      newSelectedRows.includes(getRowKey(record, index))
    ));
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    const allKeys = checked ? filteredData.map((record, index) => getRowKey(record, index)) : [];
    setSelectedRows(allKeys);
    onSelectionChange?.(allKeys, checked ? filteredData : []);
  };

  // Handle sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const newSortBy = column.key;
    let newSortOrder: 'asc' | 'desc' = 'asc';

    if (sortBy === newSortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    onSortChange?.(newSortBy, newSortOrder);
  };

  // Render sort icon
  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const isActive = sortBy === column.key;
    
    if (!isActive) {
      return <ChevronsUpDown size={14} className="text-[var(--text-muted)]" />;
    }

    return sortOrder === 'asc' 
      ? <ChevronUp size={14} className="text-[var(--brand-primary)]" />
      : <ChevronDown size={14} className="text-[var(--brand-primary)]" />;
  };

  // Render cell content
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : undefined;

    if (column.render) {
      return column.render(value, record, index);
    }

    return value;
  };

  const isAllSelected = filteredData.length > 0 && selectedRows.length === filteredData.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < filteredData.length;

  return (
    <div className={clsx('w-full', className)}>
      {/* Table Header */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Buscar..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>

          {selectedRows.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<MoreVertical size={16} />}
            >
              Acciones ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add filter controls here based on columns */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Estado
              </label>
              <Select
                options={[
                  { label: 'Todos', value: 'all' },
                  { label: 'Activo', value: 'active' },
                  { label: 'Inactivo', value: 'inactive' }
                ]}
                placeholder="Seleccionar estado"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="primary" size="sm">Aplicar</Button>
            <Button variant="secondary" size="sm">Limpiar</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              {selectable && (
                <th className="table-header w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-[var(--brand-primary)] bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-[var(--brand-primary)] focus:ring-2"
                  />
                </th>
              )}
              
              {columns.map(column => (
                <th
                  key={column.key}
                  className={clsx(
                    'table-header',
                    column.sortable && 'cursor-pointer hover:bg-[var(--bg-tertiary)]',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span className={clsx(column.ellipsis && 'truncate')}>
                      {column.title}
                    </span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="table-cell text-center py-8">
                  <Spinner size="lg" tip="Cargando datos..." />
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.includes(key);
                
                return (
                  <tr
                    key={key}
                    className={clsx(
                      'border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/10',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {selectable && (
                      <td className="table-cell">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelection(key, e.target.checked);
                          }}
                          className="w-4 h-4 text-[var(--brand-primary)] bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-[var(--brand-primary)] focus:ring-2"
                        />
                      </td>
                    )}
                    
                    {columns.map(column => (
                      <td
                        key={column.key}
                        className={clsx(
                          'table-cell',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.ellipsis && 'truncate max-w-0'
                        )}
                      >
                        {renderCell(column, record, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="table-cell text-center py-8">
                  <div className="text-[var(--text-muted)]">
                    {searchTerm ? 'No se encontraron resultados' : emptyText}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-[var(--text-muted)]">
            Mostrando {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} - {Math.min(pagination.current * pagination.pageSize, pagination.total)} de {pagination.total} resultados
          </div>
          
          <div className="flex items-center gap-2">
            {pagination.showSizeChanger && (
              <Select
                options={[
                  { label: '10 / página', value: 10 },
                  { label: '20 / página', value: 20 },
                  { label: '50 / página', value: 50 },
                  { label: '100 / página', value: 100 }
                ]}
                value={pagination.pageSize}
                onChange={(value) => pagination.onChange?.(1, value as number)}
                className="w-32"
              />
            )}
            
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.current <= 1}
                onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
              >
                Anterior
              </Button>
              
              <span className="px-3 py-1 text-sm">
                {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;