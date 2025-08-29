import React, { useState } from 'react';
import clsx from 'clsx';
import { 
  Search, Bell, User, Settings, LogOut, Menu, 
  Sun, Moon, Monitor, ChevronDown
} from 'lucide-react';
import type { HeaderProps, BreadcrumbItem } from '../../types/ui';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { formatDateTime } from '../../utils/format';

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  extra,
  breadcrumb = [],
  showBreadcrumb = true,
  className
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'Nueva obra asignada',
      message: 'Se ha asignado la obra "Construcción Plaza Central"',
      time: '2 min',
      read: false
    },
    {
      id: '2',
      title: 'Gasto aprobado',
      message: 'Gasto de $15.000 para materiales aprobado',
      time: '1 hora',
      read: false
    },
    {
      id: '3',
      title: 'Milestone completado',
      message: 'Cimentación completada en obra Villa Norte',
      time: '3 horas',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
    if (!items || items.length === 0) return null;

    return (
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-[var(--text-muted)] mx-2">/</span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:opacity-80"
                >
                  {item.title}
                </a>
              ) : (
                <span className="text-sm text-[var(--text-muted)]">
                  {item.title}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  return (
    <header className={clsx(
      'bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-6 py-4',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left section - Title and Breadcrumb */}
        <div className="flex-1 min-w-0">
          {showBreadcrumb && breadcrumb.length > 0 && (
            <div className="mb-1">
              <Breadcrumb items={breadcrumb} />
            </div>
          )}
          
          {title && (
            <div className="flex items-center gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-[var(--text-muted)] mt-1 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
              {extra && (
                <div className="flex-shrink-0">
                  {extra}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar obras, terceros..."
              className="pl-10 pr-4 py-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            />
          </div>

          {/* Theme Toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                handleThemeChange(newTheme);
              }}
              icon={theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              icon={<Bell size={20} />}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--brand-error)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg shadow-[var(--shadow-color)] z-50">
                <div className="p-4 border-b border-[var(--border-color)]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--text-primary)]">Notificaciones</h3>
                    <span className="text-sm text-[var(--text-muted)]">{unreadCount} nuevas</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] cursor-pointer',
                        !notification.read && 'bg-blue-50 dark:bg-blue-900/10'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {notification.title}
                          </p>
                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-[var(--text-muted)] ml-2">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-[var(--border-color)]">
                  <Button variant="ghost" size="sm" fullWidth>
                    Ver todas las notificaciones
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">
                  {user.nombre}
                </span>
                <ChevronDown size={16} className="text-[var(--text-muted)]" />
              </Button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg shadow-[var(--shadow-color)] z-50">
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--text-primary)] truncate">
                          {user.nombre} {user.apellido}
                        </p>
                        <p className="text-sm text-[var(--text-muted)] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      icon={<User size={16} />}
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to profile
                      }}
                    >
                      <span className="ml-2">Mi Perfil</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start"
                      icon={<Settings size={16} />}
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to settings
                      }}
                    >
                      <span className="ml-2">Configuración</span>
                    </Button>
                  </div>

                  <div className="p-2 border-t border-[var(--border-color)]">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start text-[var(--brand-error)] hover:text-[var(--brand-error)] hover:bg-red-50 dark:hover:bg-red-900/20"
                      icon={<LogOut size={16} />}
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                    >
                      <span className="ml-2">Cerrar Sesión</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            icon={<Menu size={20} />}
            onClick={() => {
              // Toggle mobile sidebar
              console.log('Toggle mobile sidebar');
            }}
          />
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;