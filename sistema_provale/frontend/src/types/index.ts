export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
}

export interface AlertItem {
  id: number;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface KPICard {
  id: string;
  value: number | string;
  label: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  variant: 'leaf' | 'sky' | 'sun' | 'clay';
  icon: string;
}

export interface Beneficiario {
  id: number;
  dni: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F';
  direccion: string;
  telefono?: string;
  club: {
    id: number;
    nombre: string;
  };
  estado: 'activo' | 'inactivo' | 'pendiente';
  fecha_registro: string;
}

export interface Club {
  id: number;
  nombre: string;
  total_beneficiarios: number;
  cobertura: number;
}

export interface Activity {
  id: number;
  type: 'beneficiario' | 'pecosa' | 'entrega' | 'producto';
  title: string;
  meta: string;
  icon_variant: 'leaf' | 'sun' | 'sky' | 'clay';
  timestamp: string;
}

export interface DashboardData {
  user: User;
  alerts: AlertItem[];
  kpis: KPICard[];
  activities: Activity[];
  clubs: Club[];
  chart_data: number[];
}

export interface BeneficiariosPageData {
  user: User;
  beneficiarios: Beneficiario[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    club_id?: number;
    estado?: string;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'email' | 'tel';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  user: User;
  fields: FormField[];
  initial_data?: Record<string, unknown>;
  action_url: string;
  csrf_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
