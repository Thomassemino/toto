import React, { useState } from 'react';
import clsx from 'clsx';
import { 
  Home, Building2, Users, BarChart3, FileTemplate, UserCog, 
  Menu, X, ChevronLeft, ChevronRight, LogOut, Settings,
  User, Bell
} from 'lucide-react';
import { NAVIGATION_ITEMS, ROLE } from '../../constants';
import type { SidebarProps } from '../../types/ui';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const Sidebar: React.FC<SidebarProps> = ({
  collapsed: controlledCollapsed,
  onCollapse,
  width = 280,
  collapsedWidth = 80,
  theme = 'light',
  className
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const { user, logout, hasRole } = useAuth();
  
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapse?.(newCollapsed);
  };

  const iconMap = {
    Home,
    Building2,
    Users,
    BarChart3,
    Template: FileTemplate,
    UserCog
  };

  // Filter navigation items based on user roles
  const visibleItems = NAVIGATION_ITEMS.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some(role => hasRole(role));
  });

  const sidebarWidth = collapsed ? collapsedWidth : width;

  return (
    <div
      className={clsx(
        'flex flex-col h-full transition-all duration-300 ease-in-out',
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[var(--bg-primary)] border-r border-[var(--border-color)]',
        className
      )}
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">MaestroObras</h1>
              <p className="text-xs text-[var(--text-muted)]">Gestión integral</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapse}
          className="p-2"
          icon={collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        />
      </div>

      {/* User Info */}
      {user && (
        <div className={clsx(
          'p-4 border-b border-[var(--border-color)]',
          collapsed && 'px-2'
        )}>
          <div className={clsx('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user.roles.map(role => {
                    switch(role) {
                      case ROLE.Admin: return 'Administrador';
                      case ROLE.JefeObra: return 'Jefe de Obra';
                      case ROLE.Deposito: return 'Depósito';
                      case ROLE.Lectura: return 'Lectura';
                      default: return role;
                    }
                  }).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || Home;
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
            
            return (
              <li key={item.key}>
                <a
                  href={item.href}
                  className={clsx(
                    'sidebar-nav-item',
                    'w-full justify-start',
                    collapsed && 'justify-center px-2',
                    isActive && 'active'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 text-sm">{item.name}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-2 border-t border-[var(--border-color)] space-y-1">
        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className={clsx(
            'w-full justify-start',
            collapsed && 'justify-center px-2'
          )}
          icon={<Settings size={20} />}
          onClick={() => {
            // Navigate to settings
            if (typeof window !== 'undefined') {
              window.location.href = '/configuracion';
            }
          }}
        >
          {!collapsed && <span className="ml-3 text-sm">Configuración</span>}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className={clsx(
            'w-full justify-start relative',
            collapsed && 'justify-center px-2'
          )}
          icon={<Bell size={20} />}
          onClick={() => {
            // Open notifications panel
            console.log('Open notifications');
          }}
        >
          {!collapsed && <span className="ml-3 text-sm">Notificaciones</span>}
          {/* Badge for unread notifications */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-[var(--brand-error)] rounded-full"></div>
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          className={clsx(
            'w-full justify-start text-[var(--brand-error)] hover:text-[var(--brand-error)] hover:bg-red-50 dark:hover:bg-red-900/20',
            collapsed && 'justify-center px-2'
          )}
          icon={<LogOut size={20} />}
          onClick={() => logout()}
        >
          {!collapsed && <span className="ml-3 text-sm">Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;