import React, { forwardRef, useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { TextAreaProps } from '../../types/ui';

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  className,
  error = false,
  resize = 'vertical',
  autoResize = false,
  ...props
}, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = ref || internalRef;

  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y'
  };

  // Auto resize functionality
  useEffect(() => {
    if (autoResize && textAreaRef && typeof textAreaRef !== 'function') {
      const textArea = textAreaRef.current;
      if (textArea) {
        const adjustHeight = () => {
          textArea.style.height = 'auto';
          textArea.style.height = textArea.scrollHeight + 'px';
        };

        textArea.addEventListener('input', adjustHeight);
        adjustHeight(); // Initial adjustment

        return () => {
          textArea.removeEventListener('input', adjustHeight);
        };
      }
    }
  }, [autoResize, textAreaRef]);

  return (
    <textarea
      ref={textAreaRef}
      className={clsx(
        'input-field',
        error && 'border-[var(--brand-error)] focus:ring-[var(--brand-error)]',
        !autoResize && resizeClasses[resize],
        autoResize && 'resize-none overflow-hidden',
        className
      )}
      rows={autoResize ? 1 : 4}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;