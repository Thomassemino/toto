import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { 
  Upload, X, File, Image, FileText, 
  AlertCircle, CheckCircle, Loader2 
} from 'lucide-react';
import type { FileUploadProps, FileUpload } from '../../types/ui';
import Button from './Button';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../constants';

const FileUpload: React.FC<FileUploadProps> = ({
  accept = ALLOWED_FILE_TYPES,
  multiple = false,
  maxSize = MAX_FILE_SIZE_MB,
  maxCount,
  listType = 'text',
  showUploadList = true,
  beforeUpload,
  onChange,
  onRemove,
  onPreview,
  disabled = false,
  className
}) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Generate unique ID for file
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Validate file
  const validateFile = async (file: File): Promise<string | null> => {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (accept.length > 0 && fileExtension && !accept.includes(fileExtension)) {
      return `Tipo de archivo no permitido. Solo se permiten: ${accept.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `El archivo es demasiado grande. Máximo ${maxSize}MB permitido.`;
    }

    // Check max count
    if (maxCount && files.length >= maxCount) {
      return `Máximo ${maxCount} archivo(s) permitido(s).`;
    }

    // Custom validation
    if (beforeUpload) {
      try {
        const result = await beforeUpload(file);
        if (!result) {
          return 'Archivo no válido.';
        }
      } catch (error) {
        return error instanceof Error ? error.message : 'Error al validar archivo.';
      }
    }

    return null;
  };

  // Handle file selection
  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    const newFiles: FileUpload[] = [];

    for (const file of fileArray) {
      const error = await validateFile(file);
      const fileUpload: FileUpload = {
        id: generateId(),
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error
      };

      newFiles.push(fileUpload);
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onChange?.(updatedFiles);

    // Start upload simulation for valid files
    newFiles.forEach(fileUpload => {
      if (fileUpload.status === 'pending') {
        simulateUpload(fileUpload);
      }
    });
  }, [files, multiple, onChange]);

  // Simulate file upload
  const simulateUpload = (fileUpload: FileUpload) => {
    const updateProgress = (progress: number) => {
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === fileUpload.id 
            ? { ...f, progress, status: progress === 100 ? 'completed' : 'uploading' }
            : f
        )
      );

      onChange?.(files.map(f => 
        f.id === fileUpload.id 
          ? { ...f, progress, status: progress === 100 ? 'completed' : 'uploading' }
          : f
      ));
    };

    // Simulate progressive upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      updateProgress(progress);
    }, 200);
  };

  // Handle file removal
  const handleRemove = (fileUpload: FileUpload) => {
    const updatedFiles = files.filter(f => f.id !== fileUpload.id);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
    onRemove?.(fileUpload);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || !e.dataTransfer.files) return;

    handleFiles(e.dataTransfer.files);
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image size={20} className="text-blue-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText size={20} className="text-red-500" />;
    } else {
      return <File size={20} className="text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render file list
  const renderFileList = () => {
    if (!showUploadList || files.length === 0) return null;

    if (listType === 'picture' || listType === 'picture-card') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {files.map(fileUpload => (
            <div key={fileUpload.id} className="relative group">
              <div className="aspect-square border-2 border-dashed border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                {fileUpload.file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(fileUpload.file)}
                    alt={fileUpload.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(fileUpload.file)}
                  </div>
                )}
                
                {/* Status overlay */}
                {fileUpload.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                      <div className="text-sm">{fileUpload.progress}%</div>
                    </div>
                  </div>
                )}

                {fileUpload.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
                    <AlertCircle size={20} className="text-white" />
                  </div>
                )}

                {fileUpload.status === 'completed' && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}

                {/* Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white"
                      icon={<Eye size={16} />}
                      onClick={() => onPreview?.(fileUpload)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white"
                      icon={<X size={16} />}
                      onClick={() => handleRemove(fileUpload)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-sm text-[var(--text-primary)] truncate">
                  {fileUpload.file.name}
                </p>
                {fileUpload.error && (
                  <p className="text-xs text-red-500 mt-1">{fileUpload.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Text list type
    return (
      <div className="mt-4 space-y-2">
        {files.map(fileUpload => (
          <div
            key={fileUpload.id}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-lg border',
              fileUpload.status === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
              fileUpload.status === 'completed' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
              'border-[var(--border-color)] bg-[var(--bg-primary)]'
            )}
          >
            <div className="flex-shrink-0">
              {getFileIcon(fileUpload.file)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {fileUpload.file.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {formatFileSize(fileUpload.file.size)}
              </p>
              {fileUpload.error && (
                <p className="text-xs text-red-500 mt-1">{fileUpload.error}</p>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              {fileUpload.status === 'uploading' && (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-sm text-blue-500">{fileUpload.progress}%</span>
                </div>
              )}

              {fileUpload.status === 'completed' && (
                <CheckCircle size={16} className="text-green-500" />
              )}

              {fileUpload.status === 'error' && (
                <AlertCircle size={16} className="text-red-500" />
              )}

              <Button
                variant="ghost"
                size="sm"
                icon={<X size={16} />}
                onClick={() => handleRemove(fileUpload)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* Upload Area */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-lg transition-colors',
          dragActive 
            ? 'border-[var(--brand-primary)] bg-blue-50 dark:bg-blue-900/10' 
            : 'border-[var(--border-color)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-6 text-center">
          <Upload size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <div className="space-y-2">
            <p className="text-[var(--text-primary)] font-medium">
              Arrastra archivos aquí o{' '}
              <label className="text-[var(--brand-primary)] cursor-pointer hover:underline">
                selecciona archivos
                <input
                  type="file"
                  multiple={multiple}
                  accept={accept.map(ext => `.${ext}`).join(',')}
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  disabled={disabled}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Tipos permitidos: {accept.join(', ')} • Máximo {maxSize}MB
              {maxCount && ` • Hasta ${maxCount} archivo(s)`}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {renderFileList()}
    </div>
  );
};

export default FileUpload;