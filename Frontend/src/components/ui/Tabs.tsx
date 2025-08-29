import React, { useState } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import type { TabsProps, TabItem } from '../../types/ui';

const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  onTabClose,
  type = 'line',
  position = 'top',
  className
}) => {
  const [internalActiveKey, setInternalActiveKey] = useState(
    activeKey || defaultActiveKey || (items.length > 0 ? items[0].key : '')
  );

  const currentActiveKey = activeKey !== undefined ? activeKey : internalActiveKey;
  const activeItem = items.find(item => item.key === currentActiveKey);

  const handleTabClick = (key: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const handleTabClose = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose?.(key);
  };

  const isHorizontal = position === 'top' || position === 'bottom';

  const tabListClasses = clsx(
    'flex',
    {
      'border-b border-[var(--border-color)]': type === 'line' && position === 'top',
      'border-t border-[var(--border-color)]': type === 'line' && position === 'bottom',
      'border-r border-[var(--border-color)]': type === 'line' && position === 'left',
      'border-l border-[var(--border-color)]': type === 'line' && position === 'right',
      'flex-row': isHorizontal,
      'flex-col': !isHorizontal,
      'bg-[var(--bg-secondary)] rounded-lg p-1': type === 'card'
    }
  );

  const tabClasses = (item: TabItem, isActive: boolean) => clsx(
    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
    {
      // Line type styles
      'text-[var(--text-primary)] border-b-2 border-[var(--brand-primary)]': 
        type === 'line' && isActive && position === 'top',
      'text-[var(--text-primary)] border-t-2 border-[var(--brand-primary)]': 
        type === 'line' && isActive && position === 'bottom',
      'text-[var(--text-primary)] border-r-2 border-[var(--brand-primary)]': 
        type === 'line' && isActive && position === 'left',
      'text-[var(--text-primary)] border-l-2 border-[var(--brand-primary)]': 
        type === 'line' && isActive && position === 'right',
      'text-[var(--text-secondary)] border-b-2 border-transparent hover:text-[var(--text-primary)]': 
        type === 'line' && !isActive && position === 'top',
      'text-[var(--text-secondary)] border-t-2 border-transparent hover:text-[var(--text-primary)]': 
        type === 'line' && !isActive && position === 'bottom',
      'text-[var(--text-secondary)] border-r-2 border-transparent hover:text-[var(--text-primary)]': 
        type === 'line' && !isActive && position === 'left',
      'text-[var(--text-secondary)] border-l-2 border-transparent hover:text-[var(--text-primary)]': 
        type === 'line' && !isActive && position === 'right',
      
      // Card type styles
      'bg-[var(--bg-primary)] text-[var(--text-primary)] rounded shadow-sm': 
        type === 'card' && isActive,
      'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:bg-opacity-50 rounded': 
        type === 'card' && !isActive,
      
      // Disabled state
      'opacity-50 cursor-not-allowed': item.disabled,
      'hover:text-[var(--text-secondary)] hover:bg-transparent': item.disabled
    }
  );

  const containerClasses = clsx(
    'w-full',
    {
      'flex flex-row': position === 'left' || position === 'right',
      'flex flex-col': position === 'top' || position === 'bottom',
      'flex-col-reverse': position === 'bottom',
      'flex-row-reverse': position === 'right'
    },
    className
  );

  return (
    <div className={containerClasses}>
      {/* Tab List */}
      <div className={tabListClasses}>
        {items.map(item => (
          <div
            key={item.key}
            className={tabClasses(item, item.key === currentActiveKey)}
            onClick={() => !item.disabled && handleTabClick(item.key)}
          >
            <span className="truncate">{item.label}</span>
            {item.closable && onTabClose && (
              <X
                size={14}
                className="flex-shrink-0 hover:text-[var(--brand-error)]"
                onClick={(e) => handleTabClose(item.key, e)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className={clsx(
        'flex-1',
        isHorizontal ? 'mt-4' : 'ml-4'
      )}>
        {activeItem?.children}
      </div>
    </div>
  );
};

export default Tabs;