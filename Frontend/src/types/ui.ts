// UI Component types and interfaces

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  rowKey?: keyof T | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedKeys: string[], selectedRows: T[]) => void;
  selectable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  emptyText?: string;
  className?: string;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize?: number) => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  closeOnEsc?: boolean;
  closeOnOverlay?: boolean;
  className?: string;
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  height?: number | string;
  closeOnEsc?: boolean;
  closeOnOverlay?: boolean;
  className?: string;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoResize?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  onTabClose?: (key: string) => void;
  type?: 'line' | 'card';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export interface StepsProps {
  current?: number;
  items: StepItem[];
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
  onChange?: (current: number) => void;
  className?: string;
}

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
}

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  actions?: React.ReactNode[];
  cover?: React.ReactNode;
  className?: string;
}

export interface AlertProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface TooltipProps {
  title: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  arrow?: boolean;
  className?: string;
}

export interface PopoverProps {
  title?: string;
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrow?: boolean;
  className?: string;
}

export interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownProps {
  items: DropdownItem[];
  children: React.ReactElement;
  trigger?: 'hover' | 'click' | 'contextMenu';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  onSelect?: (key: string) => void;
  className?: string;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export interface ProgressProps {
  percent: number;
  type?: 'line' | 'circle' | 'dashboard';
  status?: 'normal' | 'success' | 'exception' | 'active';
  strokeColor?: string;
  trailColor?: string;
  strokeWidth?: number;
  size?: 'sm' | 'md' | 'lg' | number;
  format?: (percent: number) => React.ReactNode;
  showInfo?: boolean;
  className?: string;
}

export interface SkeletonProps {
  loading?: boolean;
  children?: React.ReactNode;
  rows?: number;
  avatar?: boolean;
  paragraph?: boolean;
  title?: boolean;
  round?: boolean;
  active?: boolean;
  className?: string;
}

export interface SpinProps {
  spinning?: boolean;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  tip?: string;
  delay?: number;
  className?: string;
}

export interface EmptyProps {
  image?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface ResultProps {
  status: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

// Layout components
export interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  showBreadcrumb?: boolean;
  className?: string;
}

export interface ContentProps {
  children: React.ReactNode;
  padding?: boolean;
  className?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

// Menu types
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  roles?: string[];
}

export interface MenuProps {
  items: MenuItem[];
  mode?: 'horizontal' | 'vertical' | 'inline';
  theme?: 'light' | 'dark';
  selectedKeys?: string[];
  openKeys?: string[];
  onSelect?: (keys: string[]) => void;
  onOpenChange?: (keys: string[]) => void;
  inlineCollapsed?: boolean;
  className?: string;
}

// File upload types
export interface FileUploadProps {
  accept?: string[];
  multiple?: boolean;
  maxSize?: number; // in MB
  maxCount?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (files: FileUpload[]) => void;
  onRemove?: (file: FileUpload) => void;
  onPreview?: (file: FileUpload) => void;
  disabled?: boolean;
  className?: string;
}

// Date picker types
export interface DatePickerProps {
  value?: string;
  defaultValue?: string;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  onChange?: (date: string) => void;
  disabledDate?: (date: Date) => boolean;
  showTime?: boolean;
  className?: string;
}

export interface DateRangePickerProps {
  value?: [string, string];
  defaultValue?: [string, string];
  format?: string;
  placeholder?: [string, string];
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  onChange?: (dates: [string, string]) => void;
  disabledDate?: (date: Date) => boolean;
  showTime?: boolean;
  className?: string;
}