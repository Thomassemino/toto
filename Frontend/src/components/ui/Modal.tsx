import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import type { ModalProps } from '../../types/ui';
import Button from './Button';

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'auto',
  closeOnEsc = true,
  closeOnOverlay = true,
  className
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEsc, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        className={clsx(
          'bg-[var(--bg-primary)] rounded-lg shadow-xl shadow-[var(--shadow-color)] max-h-[90vh] flex flex-col',
          className
        )}
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          maxWidth: '90vw'
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-[var(--bg-secondary)]"
              icon={<X size={20} />}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render in portal
  const portalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(modalContent, portalRoot);
};

export default Modal;