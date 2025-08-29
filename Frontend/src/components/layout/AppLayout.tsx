import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { LayoutProps, BreadcrumbItem } from '../../types/ui';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';
import Spinner from '../ui/Spinner';

interface AppLayoutProps extends LayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  showBreadcrumb?: boolean;
  headerExtra?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarCollapse?: (collapsed: boolean) => void;
  loading?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumb = [],
  showBreadcrumb = true,
  headerExtra,
  sidebarCollapsed,
  onSidebarCollapse,
  loading = false,
  className
}) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [authLoading, isAuthenticated]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <Spinner size="lg" tip="Cargando..." />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSidebarCollapse = (collapsed: boolean) => {
    onSidebarCollapse?.(collapsed);
    if (isMobile) {
      setMobileSidebarOpen(!collapsed);
    }
  };

  return (
    <div className={clsx('min-h-screen bg-[var(--bg-secondary)] flex', className)}>
      {/* Sidebar */}
      <div className={clsx(
        'fixed left-0 top-0 h-full z-40 transition-transform duration-300',
        isMobile ? (
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ) : 'translate-x-0'
      )}>
        <Sidebar
          collapsed={!isMobile ? sidebarCollapsed : false}
          onCollapse={handleSidebarCollapse}
          theme="light"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={clsx(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        !isMobile && (sidebarCollapsed ? 'ml-20' : 'ml-70') // Adjust based on sidebar width
      )}>
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          breadcrumb={breadcrumb}
          showBreadcrumb={showBreadcrumb}
          extra={headerExtra}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" tip="Cargando contenido..." />
            </div>
          ) : (
            children
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-6 py-4">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
            <div>
              © 2025 MaestroObras. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span>v1.0.0</span>
              <a 
                href="/ayuda" 
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Ayuda
              </a>
              <a 
                href="/contacto" 
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;