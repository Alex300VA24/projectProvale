import type { KPICard, Activity, Club, User, AlertItem } from '@/types';

interface DashboardProps {
  user: User;
  alerts: AlertItem[];
  kpis: KPICard[];
  activities: Activity[];
  clubs: Club[];
  chart_data: number[];
}

export default function DashboardApp(props: DashboardProps) {
  const { user, kpis, activities, clubs, chart_data } = props;

  const variantStyles = {
    leaf: { bg: 'var(--leaf-light)', color: 'var(--leaf)', gradient: 'linear-gradient(to right, var(--leaf), #2D5A3D)' },
    sky: { bg: 'var(--sky-light)', color: '#0284C7', gradient: 'linear-gradient(to right, #0284C7, #0369A1)' },
    sun: { bg: 'var(--sun-light)', color: '#D97706', gradient: 'linear-gradient(to right, var(--sun), #D97706)' },
    clay: { bg: 'var(--clay-light)', color: 'var(--clay)', gradient: 'linear-gradient(to right, var(--clay), #C55A3E)' },
  };

  const today = new Date();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="relative">
        <div 
          className="relative overflow-hidden rounded-[20px] p-8 flex justify-between items-center"
          style={{ 
            background: 'linear-gradient(135deg, white 0%, var(--cream) 100%)',
            border: '2px solid var(--wheat)',
            boxShadow: 'var(--shadow-soft)'
          }}
        >
          <div className="relative z-10 max-w-xl">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest mb-4"
              style={{ background: 'var(--leaf-light)', color: 'var(--leaf)', border: '1px solid rgba(74, 124, 89, 0.2)' }}
            >
              <span>👋</span> ¡Hola de nuevo!
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--charcoal)] mb-3 leading-tight">
              Bienvenido(a), <span className="relative text-[var(--leaf)]">{user.username}</span>
            </h1>
            <p className="text-base text-[var(--earth)] max-w-md mb-6">
              Gestiona beneficiarios, clubes de madres y realiza seguimiento de entregas del programa social.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--leaf-light)' }}>📊</div>
                <div>
                  <span className="text-xl font-extrabold text-[var(--charcoal)]">98%</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--earth)]">Cobertura</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--sun-light)' }}>⚡</div>
                <div>
                  <span className="text-xl font-extrabold text-[var(--charcoal)]">12</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--earth)]">Pendientes</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-end gap-4">
            <div 
              className="text-center rounded-2xl p-4 min-w-[180px]"
              style={{ background: 'white', border: '2px solid var(--wheat)', boxShadow: 'var(--shadow-soft)' }}
            >
              <div className="text-3xl font-extrabold text-[var(--leaf)]">{today.getDate()}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-[var(--charcoal)]">{months[today.getMonth()]}</div>
              <div className="text-sm text-[var(--earth)]">{weekdays[today.getDay()]}, {today.getFullYear()}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: 'var(--leaf)' }}>
                + Nuevo Beneficiario
              </button>
              <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--earth)] border-2 transition-all hover:-translate-y-0.5" style={{ borderColor: 'var(--wheat)', background: 'white' }}>
                📋 Reportes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="relative overflow-hidden rounded-[20px] p-7 border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-warm)] hover:border-transparent"
            style={{ background: 'white', borderColor: 'var(--wheat)' }}
          >
            <div 
              className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-10"
              style={{ background: variantStyles[kpi.variant].color }}
            />
            <div className="flex justify-between items-center mb-6">
              <div 
                className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ background: variantStyles[kpi.variant].bg, color: variantStyles[kpi.variant].color }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {kpi.variant === 'leaf' && (
                    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>
                  )}
                  {kpi.variant === 'sky' && (
                    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>
                  )}
                  {kpi.variant === 'sun' && (
                    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/></>
                  )}
                  {kpi.variant === 'clay' && (
                    <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>
                  )}
                </svg>
              </div>
              {kpi.trend && (
                <span 
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ 
                    color: kpi.trend.direction === 'up' ? 'var(--leaf)' : kpi.trend.direction === 'down' ? 'var(--clay)' : '#D97706',
                    background: kpi.trend.direction === 'up' ? 'var(--leaf-light)' : kpi.trend.direction === 'down' ? 'var(--clay-light)' : 'var(--sun-light)'
                  }}
                >
                  {kpi.trend.direction === 'up' ? '↑' : kpi.trend.direction === 'down' ? '↓' : '→'} {kpi.trend.percentage}%
                </span>
              )}
            </div>
            <div className="text-[40px] font-extrabold text-[var(--charcoal)] leading-none mb-2 tracking-tight">{kpi.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--earth)]">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          {/* Chart Card */}
          <div className="rounded-[20px] border-2 overflow-hidden" style={{ background: 'white', borderColor: 'var(--wheat)' }}>
            <div className="px-6 py-5 border-b-2 flex justify-between items-center" style={{ background: 'linear-gradient(to right, white, var(--cream))', borderColor: 'var(--wheat)' }}>
              <h3 className="font-extrabold text-base text-[var(--charcoal)] flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Actividad de Movimientos
              </h3>
            </div>
            <div className="p-7">
              <div className="flex items-end gap-4 h-[200px] pb-5 relative">
                {chart_data.map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-lg transition-all duration-300 cursor-pointer border-2 border-b-0 hover:scale-y-105"
                    style={{
                      height: `${height}%`,
                      background: idx % 2 === 0 ? 'linear-gradient(to top, var(--wheat), var(--cream))' : 'linear-gradient(to top, var(--leaf), #2D5A3D)',
                      opacity: idx % 2 === 0 ? 0.7 : 0.9,
                      borderColor: idx % 2 === 0 ? 'var(--wheat)' : 'var(--leaf)'
                    }}
                  />
                ))}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded"
                  style={{ background: 'linear-gradient(to right, transparent, var(--wheat), transparent)' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-5">
            {[
              { icon: '🖥️', value: '156', label: 'Entregas este mes', color: '#0284C7', bg: 'var(--sky-light)' },
              { icon: '✓', value: '98%', label: 'Tasa de cobertura', color: 'var(--leaf)', bg: 'var(--leaf-light)' },
              { icon: '📦', value: '48', label: 'Productos en stock', color: '#D97706', bg: 'var(--sun-light)' },
            ].map((stat, i) => (
              <div 
                key={i}
                className="rounded-[20px] border-2 p-6 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] hover:border-[var(--leaf)]"
                style={{ background: 'white', borderColor: 'var(--wheat)' }}
              >
                <div 
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-xl transition-transform hover:rotate-[-5deg] hover:scale-110"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-[var(--charcoal)] leading-none">{stat.value}</div>
                  <div className="text-xs text-[var(--earth)] uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Card */}
          <div className="rounded-[20px] border-2 overflow-hidden" style={{ background: 'white', borderColor: 'var(--wheat)' }}>
            <div className="px-6 py-5 border-b-2" style={{ background: 'linear-gradient(to right, white, var(--cream))', borderColor: 'var(--wheat)' }}>
              <h3 className="font-extrabold text-base text-[var(--charcoal)] flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Actividad Reciente
              </h3>
            </div>
            <div className="p-7">
              <div className="relative space-y-0">
                <div 
                  className="absolute left-[22px] top-6 bottom-6 w-0.5 rounded"
                  style={{ background: 'var(--wheat)' }}
                />
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 relative">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 z-10 border-[3px] border-white shadow-sm transition-transform hover:scale-110"
                      style={{ 
                        background: variantStyles[activity.icon_variant].bg,
                        color: variantStyles[activity.icon_variant].color
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {activity.type === 'beneficiario' && (
                          <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>
                        )}
                        {activity.type === 'pecosa' && (
                          <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>
                        )}
                        {activity.type === 'entrega' && (
                          <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                        )}
                        {activity.type === 'producto' && (
                          <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-bold text-[var(--charcoal)]">{activity.title}</p>
                      <p className="text-xs text-[var(--earth)] font-semibold flex items-center gap-2">
                        <span className="text-[var(--wheat)]">•</span> {activity.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clubs Progress */}
          <div className="rounded-[20px] border-2 overflow-hidden" style={{ background: 'white', borderColor: 'var(--wheat)' }}>
            <div className="px-6 py-5 border-b-2" style={{ background: 'linear-gradient(to right, white, var(--cream))', borderColor: 'var(--wheat)' }}>
              <h3 className="font-extrabold text-base text-[var(--charcoal)] flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                Cobertura por Club
              </h3>
            </div>
            <div className="p-7">
              <div className="space-y-5">
                {clubs.map((club, i) => (
                  <div key={club.id}>
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="text-sm font-bold text-[var(--charcoal)] flex items-center gap-2">
                        <span className="text-xs">🏠</span> {club.nombre}
                      </div>
                      <span className="text-sm text-[var(--leaf)] font-extrabold bg-[var(--leaf-light)] px-2.5 py-1 rounded-full">{club.cobertura}%</span>
                    </div>
                    <div className="h-2.5 bg-[var(--cream)] rounded-full overflow-hidden border" style={{ borderColor: 'var(--wheat)' }}>
                      <div 
                        className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                        style={{ 
                          width: `${club.cobertura}%`,
                          background: i === 0 ? 'linear-gradient(to right, var(--leaf), #2D5A3D)' : i === 1 ? 'linear-gradient(to right, var(--sun), #D97706)' : 'linear-gradient(to right, #0284C7, #0369A1)'
                        }}
                      >
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shimmer 2s infinite'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
