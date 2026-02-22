import { useState, useMemo } from 'react';
import type { ReconocimientosPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatDate, formatNumber, cn } from '@/utils';

export default function ReconocimientosApp(props: ReconocimientosPageData) {
  const { reconocimientos, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredReconocimientos = useMemo(() => {
    if (!searchTerm) return reconocimientos;
    return reconocimientos.filter(r => 
      r.beneficiario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.beneficiario.dni.includes(searchTerm) ||
      r.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reconocimientos, searchTerm]);

  const filteredByTipo = useMemo(() => {
    if (!filters.tipo_reconocimiento) return filteredReconocimientos;
    return filteredReconocimientos.filter(r => r.tipo_reconocimiento === filters.tipo_reconocimiento);
  }, [filteredReconocimientos, filters.tipo_reconocimiento]);

  const filteredByEntregado = useMemo(() => {
    if (!filters.entregado) return filteredByTipo;
    const isDelivered = filters.entregado === 'true';
    return filteredByTipo.filter(r => r.entregado === isDelivered);
  }, [filteredByTipo, filters.entregado]);

  const totalPages = Math.ceil(total / per_page);

  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'asistencia':
        return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Asistencia', icon: '✓' };
      case 'destacado':
        return { bg: 'var(--sun-light)', color: '#D97706', label: 'Destacado', icon: '⭐' };
      case 'aniversario':
        return { bg: 'var(--sky-light)', color: 'var(--sky)', label: 'Aniversario', icon: '🎂' };
      case 'voluntario':
        return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Voluntario', icon: '🤝' };
      default:
        return { bg: 'var(--wheat)', color: 'var(--earth)', label: tipo, icon: '🏅' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Reconocimientos</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona los reconocimientos a beneficiarios</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Reportes
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <span className="text-lg">+</span> Nuevo Reconocimiento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Reconocimientos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Destacados</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {reconocimientos.filter(r => r.tipo_reconocimiento === 'destacado').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Entregados</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {reconocimientos.filter(r => r.entregado).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--clay-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--clay)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Pendientes</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {reconocimientos.filter(r => !r.entregado).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nombre, DNI o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium focus:outline-none focus:border-[var(--leaf)]"
            defaultValue={filters.tipo_reconocimiento || ''}
          >
            <option value="">Todos los tipos</option>
            <option value="asistencia">Asistencia</option>
            <option value="destacado">Destacado</option>
            <option value="aniversario">Aniversario</option>
            <option value="voluntario">Voluntario</option>
          </select>
          <select 
            className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium focus:outline-none focus:border-[var(--leaf)]"
            defaultValue={filters.entregado || ''}
          >
            <option value="">Todos</option>
            <option value="true">Entregados</option>
            <option value="false">Pendientes</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--wheat)]">
                <th className="p-4 text-left">
                  <input type="checkbox" className="w-5 h-5 rounded border-2 border-[var(--wheat)]" />
                </th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Tipo</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Beneficiario</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">DNI</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Motivo</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Fecha</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByEntregado.map((r) => {
                const tipo = getTipoStyle(r.tipo_reconocimiento);
                return (
                  <tr 
                    key={r.id} 
                    className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50 transition-colors"
                  >
                    <td className="p-4">
                      <input type="checkbox" className="w-5 h-5 rounded border-2 border-[var(--wheat)]" />
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ background: tipo.bg, color: tipo.color }}
                      >
                        {tipo.icon} {tipo.label}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[var(--charcoal)]">{r.beneficiario.nombre_completo}</td>
                    <td className="p-4 font-mono text-sm text-[var(--charcoal)]">{r.beneficiario.dni}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{r.motivo}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{formatDate(r.fecha_emision)}</td>
                    <td className="p-4">
                      <span 
                        className={cn(
                          'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase',
                          r.entregado 
                            ? 'bg-[var(--leaf-light)] text-[var(--leaf)]' 
                            : 'bg-[var(--sun-light)] text-[#D97706]'
                        )}
                      >
                        {r.entregado ? 'Entregado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)] transition-colors" title="Ver">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-[var(--sun-light)] text-[#D97706] transition-colors" title="Editar">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        {!r.entregado && (
                          <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)] transition-colors" title="Marcar Entregado">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        )}
                        <button className="p-2 rounded-lg hover:bg-[var(--clay-light)] text-[var(--clay)] transition-colors" title="Eliminar">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-[var(--wheat)]">
          <p className="text-sm text-[var(--earth)]">
            Mostrando <span className="font-bold text-[var(--charcoal)]">{filteredByEntregado.length}</span> de{' '}
            <span className="font-bold text-[var(--charcoal)]">{formatNumber(total)}</span> reconocimientos
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
              Anterior
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={cn('w-10 h-10 rounded-xl font-bold', currentPage === i + 1 ? 'bg-[var(--leaf)] text-white' : 'bg-white border-2 border-[var(--wheat)]')}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nuevo Reconocimiento</h2>
              <p className="text-sm text-[var(--earth)]">Registra un nuevo reconocimiento</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Beneficiario</label>
                <select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] focus:border-[var(--leaf)]">
                  <option value="">Seleccionar beneficiario</option>
                  <option value="1">Juan Pérez - 12345678</option>
                  <option value="2">María García - 87654321</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Tipo de Reconocimiento</label>
                <select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] focus:border-[var(--leaf)]">
                  <option value="">Seleccionar tipo</option>
                  <option value="asistencia">Asistencia</option>
                  <option value="destacado">Destacado</option>
                  <option value="aniversario">Aniversario</option>
                  <option value="voluntario">Voluntario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Motivo</label>
                <Input placeholder="Descripción del motivo" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Fecha de Emisión</label>
                <Input type="date" />
              </div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Guardar Reconocimiento</Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Reportes de Reconocimientos</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Lista General</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Por Tipo</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Entregados</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Por Fecha</p>
                  </div>
                </Card>
              </div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end">
              <Button variant="outline" onClick={() => setShowReportModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
