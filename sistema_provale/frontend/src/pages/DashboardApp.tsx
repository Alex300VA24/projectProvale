import type { KPICard, Activity, Club, User, AlertItem } from '@/types';
import { Card, Icon } from '@/components/common';

interface DashboardProps {
  user: User;
  alerts: AlertItem[];
  kpis: KPICard[];
  activities: Activity[];
  clubs: Club[];
  chart_data: number[];
  chart_labels: string[];
  entregas_mes: number;
  productos_stock: number;
  valor_entregas: string;
}

export default function DashboardApp(props: DashboardProps) {
  const { user, kpis, activities, clubs, chart_data, chart_labels, entregas_mes, productos_stock, valor_entregas } = props;

  const variantStyles = {
    leaf: { bg: 'var(--leaf-light)', color: 'var(--leaf)', gradient: 'linear-gradient(135deg, var(--leaf) 0%, #2D5A3D 100%)' },
    sky: { bg: 'var(--sky-light)', color: '#0284C7', gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' },
    sun: { bg: 'var(--sun-light)', color: '#D97706', gradient: 'linear-gradient(135deg, var(--sun) 0%, #D97706 100%)' },
    clay: { bg: 'var(--clay-light)', color: 'var(--clay)', gradient: 'linear-gradient(135deg, var(--clay) 0%, #C55A3E 100%)' },
  };

  const today = new Date();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const maxValue = Math.max(...chart_data);

  const quickActions = [
    { icon: 'user-plus', label: 'Nuevo Beneficiario', color: 'var(--leaf)', href: '/beneficiarios/' },
    { icon: 'file-invoice', label: 'Nueva PECOSA', color: '#0284C7', href: '/distribucion/' },
    { icon: 'box', label: 'Ver Inventario', color: '#D97706', href: '/inventario/productos/' },
    { icon: 'chart-bar', label: 'Reportes', color: 'var(--clay)', href: '#' },
  ];

  const recentPecosas = [
    { id: 'PEC-2026-0001', club: 'Club San Luis', estado: 'entregada', items: 5 },
    { id: 'PEC-2026-0002', club: 'Club Primavera', estado: 'pendiente', items: 3 },
    { id: 'PEC-2026-0003', club: 'Club Esperanza', estado: 'aprobada', items: 8 },
    { id: 'PEC-2026-0004', club: 'Club San Luis', estado: 'entregada', items: 4 },
  ];

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'entregada': return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Entregada' };
      case 'pendiente': return { bg: 'var(--sun-light)', color: '#D97706', label: 'Pendiente' };
      case 'aprobada': return { bg: 'var(--sky-light)', color: '#0284C7', label: 'Aprobada' };
      default: return { bg: 'var(--wheat)', color: 'var(--earth)', label: estado };
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[20px] border-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)]">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[var(--leaf)]" />
          <div className="absolute top-32 right-32 w-32 h-32 rounded-full bg-[var(--sun)]" />
        </div>
        
        <div className="relative p-8 flex justify-between items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4 bg-[var(--leaf-light)] text-[var(--leaf)]">
              <Icon name="home" className="w-3 h-3" /> Panel de Control
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--charcoal)] mb-2">
              Bienvenido, <span className="text-[var(--leaf)]">{user.first_name || user.username}</span>
            </h1>
            <p className="text-[var(--earth)] mb-6">
              Gestiona beneficiarios, socios, clubes de madres y el inventario del programa social PROVALE.
            </p>
            
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[var(--charcoal)]">{entregas_mes.toLocaleString()}</div>
                <div className="text-xs font-bold uppercase text-[var(--earth)]">Entregas del Mes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[var(--charcoal)]">{productos_stock}</div>
                <div className="text-xs font-bold uppercase text-[var(--earth)]">Productos Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[var(--charcoal)]">{valor_entregas}</div>
                <div className="text-xs font-bold uppercase text-[var(--earth)]">Valor Entregado</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="text-center rounded-2xl p-4 min-w-[160px] bg-white border-2 border-[var(--wheat)] shadow-lg">
              <div className="text-4xl font-extrabold text-[var(--leaf)]">{today.getDate()}</div>
              <div className="text-sm font-bold uppercase text-[var(--charcoal)]">{months[today.getMonth()]}</div>
              <div className="text-sm text-[var(--earth)]">{weekdays[today.getDay()]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <a
            key={i}
            href={action.href}
            className="group flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--wheat)] bg-white hover:border-transparent transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ '--hover-color': action.color } as React.CSSProperties}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `${action.color}20`, color: action.color }}
            >
              <Icon name={action.icon} className="w-5 h-5" />
            </div>
            <span className="font-bold text-[var(--charcoal)]">{action.label}</span>
          </a>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="!p-6 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div 
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 transition-transform group-hover:scale-150"
              style={{ background: variantStyles[kpi.variant].color }}
            />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: variantStyles[kpi.variant].bg, color: variantStyles[kpi.variant].color }}
                >
                  <Icon name={kpi.icon === 'users' ? 'users' : kpi.icon === 'user' ? 'user' : kpi.icon === 'file' ? 'file-invoice' : 'users'} className="w-5 h-5" />
                </div>
                {kpi.trend && (
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                    style={{ 
                      color: kpi.trend.direction === 'up' ? 'var(--leaf)' : kpi.trend.direction === 'down' ? 'var(--clay)' : '#D97706',
                      background: kpi.trend.direction === 'up' ? 'var(--leaf-light)' : kpi.trend.direction === 'down' ? 'var(--clay-light)' : 'var(--sun-light)'
                    }}
                  >
                    <Icon name={kpi.trend.direction === 'up' ? 'trending-up' : kpi.trend.direction === 'down' ? 'trending-down' : 'trending-neutral'} className="w-3 h-3" />
                    {kpi.trend.percentage}%
                  </span>
                )}
              </div>
              <div className="text-3xl font-extrabold text-[var(--charcoal)] mb-1">{kpi.value}</div>
              <div className="text-sm font-medium text-[var(--earth)]">{kpi.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Chart Section */}
          <Card className="!p-0 overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--charcoal)] flex items-center gap-2">
                <Icon name="chart-line" className="w-5 h-5 text-[var(--leaf)]" />
                Entregas Mensuales - {today.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--leaf)] text-white">Mensual</button>
                <button className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--wheat)] text-[var(--earth)]">Anual</button>
              </div>
            </div>
            <div className="p-6">
              {/* Bar Chart */}
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-between gap-2 pb-8">
                  {chart_data.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                        style={{ 
                          height: `${(value / maxValue) * 100}%`,
                          background: `linear-gradient(to top, ${idx >= 10 ? 'var(--leaf)' : 'var(--wheat)'}, ${idx >= 10 ? '#2D5A3D' : '#D4C4A8'})`,
                          minHeight: '20px'
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--charcoal)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value} entregas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[var(--earth)]">
                  {chart_labels.map((label, idx) => (
                    <span key={idx} className="flex-1 text-center">{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Recent PECOSAS */}
          <Card className="!p-0">
            <div className="px-6 py-4 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--charcoal)] flex items-center gap-2">
                <Icon name="file-invoice" className="w-5 h-5 text-[var(--leaf)]" />
                PECOSAS Recientes
              </h3>
              <a href="/distribucion/" className="text-sm font-bold text-[var(--leaf)] hover:underline">Ver todas</a>
            </div>
            <div className="divide-y divide-[var(--wheat)]">
              {recentPecosas.map((pecosa, i) => {
                const estado = getEstadoStyle(pecosa.estado);
                return (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--cream)]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--leaf-light)] flex items-center justify-center">
                        <Icon name="file-text" className="w-5 h-5 text-[var(--leaf)]" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--charcoal)]">{pecosa.id}</p>
                        <p className="text-sm text-[var(--earth)]">{pecosa.club} • {pecosa.items} items</p>
                      </div>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: estado.bg, color: estado.color }}
                    >
                      {estado.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <Card className="!p-0">
            <div className="px-6 py-4 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)]">
              <h3 className="font-bold text-[var(--charcoal)] flex items-center gap-2">
                <Icon name="clock" className="w-5 h-5 text-[var(--leaf)]" />
                Actividad Reciente
              </h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-[var(--wheat)]" />
                {activities.map((activity, i) => (
                  <div key={activity.id} className={`flex gap-4 py-3 ${i === 0 ? 'pt-0' : ''} ${i === activities.length - 1 ? 'pb-0' : ''}`}>
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 z-10 border-2 border-white"
                      style={{ 
                        background: variantStyles[activity.icon_variant].bg,
                        color: variantStyles[activity.icon_variant].color
                      }}
                    >
                      <Icon name={activity.type === 'beneficiario' ? 'user' : activity.type === 'pecosa' ? 'file-invoice' : activity.type === 'entrega' ? 'check' : 'box'} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--charcoal)] truncate">{activity.title}</p>
                      <p className="text-xs text-[var(--earth)]">{activity.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Club Progress */}
          <Card className="!p-0">
            <div className="px-6 py-4 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)]">
              <h3 className="font-bold text-[var(--charcoal)] flex items-center gap-2">
                <Icon name="user-group" className="w-5 h-5 text-[var(--leaf)]" />
                Cobertura por Club
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {clubs.map((club, i) => (
                <div key={club.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name="home" className="w-4 h-4 text-[var(--earth)]" />
                      <span className="text-sm font-bold text-[var(--charcoal)]">{club.nombre}</span>
                    </div>
                    <span 
                      className="text-sm font-extrabold px-2 py-0.5 rounded-full"
                      style={{ 
                        background: i === 0 ? 'var(--leaf-light)' : i === 1 ? 'var(--sun-light)' : 'var(--sky-light)',
                        color: i === 0 ? 'var(--leaf)' : i === 1 ? '#D97706' : '#0284C7'
                      }}
                    >
                      {club.cobertura}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--cream)] rounded-full overflow-hidden border border-[var(--wheat)]">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                      style={{ 
                        width: `${club.cobertura}%`,
                        background: i === 0 ? 'linear-gradient(90deg, var(--leaf), #2D5A3D)' : i === 1 ? 'linear-gradient(90deg, var(--sun), #D97706)' : 'linear-gradient(90deg, #0284C7, #0369A1)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                  <div className="text-xs text-[var(--earth)] mt-1">{club.total_beneficiarios} beneficiarios</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="!p-0">
            <div className="px-6 py-4 border-b-2 border-[var(--wheat)] bg-gradient-to-r from-white to-[var(--cream)]">
              <h3 className="font-bold text-[var(--charcoal)] flex items-center gap-2">
                <Icon name="bell" className="w-5 h-5 text-[var(--leaf)]" />
                Alertas
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--sun-light)]">
                <Icon name="alert" className="w-5 h-5 text-[#D97706] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--charcoal)]">Stock bajo</p>
                  <p className="text-xs text-[var(--earth)]">3 productos requieren reposición</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--sky-light)]">
                <Icon name="file-invoice" className="w-5 h-5 text-[#0284C7] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--charcoal)]">PECOSAS pendientes</p>
                  <p className="text-xs text-[var(--earth)]">12 esperan aprobación</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
