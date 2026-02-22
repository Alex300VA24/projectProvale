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

export interface Socio {
  id: number;
  dni: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  sexo: 'M' | 'F';
  direccion: string;
  telefono?: string;
  email?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fecha_registro: string;
  tipo_socio: 'ordinario' | 'honorario' | 'fundador';
}

export interface ClubMadre {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  presidente: string;
  total_integrantes: number;
  fecha_constitucion: string;
  estado: 'activo' | 'inactivo';
}

export interface Reconocimiento {
  id: number;
  beneficiario: {
    id: number;
    nombre_completo: string;
    dni: string;
  };
  tipo_reconocimiento: 'asistencia' | 'destacado' | 'aniversario' | 'voluntario';
  motivo: string;
  fecha_emision: string;
  entregado: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: 'alimentos' | 'higiene' | 'medicamentos' | 'utiles' | 'otro';
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
  estado: 'activo' | 'inactivo';
}

export interface Movimiento {
  id: number;
  tipo_movimiento: 'entrada' | 'salida' | 'transferencia';
  producto: {
    id: number;
    nombre: string;
  };
  cantidad: number;
  fecha_movimiento: string;
  motivo: string;
  responsable: string;
}

export interface Pecosa {
  id: number;
  numero_pecosa: string;
  beneficiario: {
    id: number;
    nombre_completo: string;
    dni: string;
  };
  club: {
    id: number;
    nombre: string;
  };
  fecha_emision: string;
  items: {
    producto: string;
    cantidad: number;
    precio_unitario: number;
  }[];
  estado: 'pendiente' | 'aprobada' | 'entregada' | 'cancelada';
  total: number;
}

export interface SociosPageData {
  user: User;
  socios: Socio[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    estado?: string;
    tipo_socio?: string;
  };
}

export interface ClubMadresPageData {
  user: User;
  clubes: ClubMadre[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    estado?: string;
  };
}

export interface ReconocimientosPageData {
  user: User;
  reconocimientos: Reconocimiento[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    tipo_reconocimiento?: string;
    entregado?: string;
  };
}

export interface ProductosPageData {
  user: User;
  productos: Producto[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    categoria?: string;
    estado?: string;
  };
}

export interface MovimientosPageData {
  user: User;
  movimientos: Movimiento[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    tipo_movimiento?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  };
}

export interface PecosasPageData {
  user: User;
  pecosas: Pecosa[];
  total: number;
  page: number;
  per_page: number;
  filters: {
    search?: string;
    estado?: string;
    club_id?: number;
  };
}

export interface PerfilPageData {
  user: User;
}
