interface IconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, string> = {
  // Navigation & Menu
  'users': 'fa-users',
  'user': 'fa-user',
  'user-plus': 'fa-user-plus',
  'user-group': 'fa-people-roof',
  'users-group': 'fa-users-gear',
  
  // Home
  'home': 'fa-house',
  'building': 'fa-building',
  
  // Actions
  'eye': 'fa-eye',
  'edit': 'fa-pen-to-square',
  'trash': 'fa-trash',
  'plus': 'fa-plus',
  'plus-circle': 'fa-circle-plus',
  'search': 'fa-magnifying-glass',
  'filter': 'fa-filter',
  'download': 'fa-download',
  'print': 'fa-print',
  'file': 'fa-file',
  'file-export': 'fa-file-export',
  'file-pdf': 'fa-file-pdf',
  'check': 'fa-check',
  'times': 'fa-xmark',
  
  // Status
  'active': 'fa-circle-check',
  'inactive': 'fa-eye-slash',
  'warning': 'fa-triangle-exclamation',
  'suspended': 'fa-ban',
  
  // Products & Inventory
  'box': 'fa-box',
  'boxes': 'fa-boxes-stacked',
  'shopping-cart': 'fa-cart-shopping',
  'warehouse': 'fa-warehouse',
  'chart': 'fa-chart-simple',
  'chart-line': 'fa-chart-line',
  'chart-bar': 'fa-chart-column',
  'chart-pie': 'fa-chart-pie',
  
  // Documents
  'file-invoice': 'fa-file-invoice',
  'file-text': 'fa-file-lines',
  'clipboard': 'fa-clipboard-list',
  
  // Social & Awards
  'award': 'fa-award',
  'trophy': 'fa-trophy',
  'medal': 'fa-medal',
  'star': 'fa-star',
  'crown': 'fa-crown',
  'heart': 'fa-heart',
  'handshake': 'fa-handshake',
  
  // Movement
  'arrow-up': 'fa-arrow-up',
  'arrow-down': 'fa-arrow-down',
  'arrow-right': 'fa-arrow-right',
  'arrows-left-right': 'fa-left-right',
  'exchange': 'fa-right-left',
  
  // Time & Calendar
  'clock': 'fa-clock',
  'calendar': 'fa-calendar',
  'calendar-days': 'fa-calendar-days',
  
  // Settings
  'shield': 'fa-shield-halved',
  'settings': 'fa-gear',
  'laptop': 'fa-laptop',
  'mobile': 'fa-mobile-screen',
  
  // Money
  'money-bill': 'fa-sack-dollar',
  'dollar': 'fa-dollar-sign',
  
  // Alert
  'alert': 'fa-circle-exclamation',
  'bell': 'fa-bell',
  
  // Stats
  'trending-up': 'fa-arrow-trend-up',
  'trending-down': 'fa-arrow-trend-down',
  'trending-neutral': 'fa-minus',
  
  // Tables
  'table': 'fa-table',
  
  // Gender
  'male': 'fa-person',
  'female': 'fa-person-dress',
};

export function Icon({ name, className = '' }: IconProps) {
  const iconClass = iconMap[name] || 'fa-circle';
  return <i className={`fa-solid ${iconClass} ${className}`}></i>;
}
