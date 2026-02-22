import { useState, useMemo } from 'react';
import type { ClubMadresPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatNumber, cn } from '@/utils';

export default function ClubMadresApp(props: ClubMadresPageData) {
  const { clubes, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredClubes = useMemo(() => {
    if (!searchTerm) return clubes;
    return clubes.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.presidente.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubes, searchTerm]);

  const filteredByEstado = useMemo(() => {
    if (!filters.estado) return filteredClubes;
    return filteredClubes.filter(c => c.estado === filters.estado);
  }, [filteredClubes, filters.estado]);

  const totalPages = Math.ceil(total / per_page);

  const toggleRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredByEstado.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredByEstado.map(c => c.id));
    }
  };

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Activo' };
      case 'inactivo':
        return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Inactivo' };
      default:
        return { bg: 'var(--wheat)', color: 'var(--earth)', label: estado };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Club de Madres</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona los clubs de madres del programa social</p>
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
            <span className="text-lg">+</span> Nuevo Club
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Clubs</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Activos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {clubes.filter(c => c.estado === 'activo').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Integrantes</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {formatNumber(clubes.reduce((acc, c) => acc + c.total_integrantes, 0))}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--clay-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--clay)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Inactivos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {clubes.filter(c => c.estado === 'inactivo').length}
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
              placeholder="Buscar por nombre, código o presidente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium focus:outline-none focus:border-[var(--leaf)]"
            defaultValue={filters.estado || ''}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
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
                  <input 
                    type="checkbox"
                    checked={selectedRows.length === filteredByEstado.length && filteredByEstado.length > 0}
                    onChange={toggleAll}
                    className="w-5 h-5 rounded border-2 border-[var(--wheat)] text-[var(--leaf)] focus:ring-[var(--leaf)]"
                  />
                </th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Código</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Nombre</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Presidente</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Dirección</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Integrantes</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByEstado.map((c) => {
                const status = getStatusStyle(c.estado);
                return (
                  <tr 
                    key={c.id} 
                    className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50 transition-colors"
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox"
                        checked={selectedRows.includes(c.id)}
                        onChange={() => toggleRow(c.id)}
                        className="w-5 h-5 rounded border-2 border-[var(--wheat)] text-[var(--leaf)] focus:ring-[var(--leaf)]"
                      />
                    </td>
                    <td className="p-4 font-mono text-sm text-[var(--charcoal)]">{c.codigo}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center font-bold">
                          {c.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <p className="font-bold text-[var(--charcoal)]">{c.nombre}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--charcoal)]">{c.presidente}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{c.direccion}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-[var(--cream)] text-[var(--charcoal)]">
                        👥 {c.total_integrantes}
                      </span>
                    </td>
                    <td className="p-4">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
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
            Mostrando <span className="font-bold text-[var(--charcoal)]">{filteredByEstado.length}</span> de{' '}
            <span className="font-bold text-[var(--charcoal)]">{formatNumber(total)}</span> clubs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'w-10 h-10 rounded-xl font-bold transition-colors',
                    currentPage === pageNum
                      ? 'bg-[var(--leaf)] text-white'
                      : 'bg-white border-2 border-[var(--wheat)] text-[var(--charcoal)] hover:border-[var(--leaf)]'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
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
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nuevo Club de Madres</h2>
              <p className="text-sm text-[var(--earth)]">Completa los datos del nuevo club</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Nombre del Club</label>
                <Input placeholder="Ej: Club de Madres San Luis" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Código</label>
                <Input placeholder="Ej: CM-001" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Presidente</label>
                <Input placeholder="Nombre del presidente" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Dirección</label>
                <Input placeholder="Dirección del club" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Fecha de Constitución</label>
                <Input type="date" />
              </div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Guardar Club</Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Reportes de Club de Madres</h2>
              <p className="text-sm text-[var(--earth)]">Genera reportes y estadísticas</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Lista de Clubs</p>
                    <p className="text-xs text-[var(--earth)]">Exportar PDF</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Integrantes por Club</p>
                    <p className="text-xs text-[var(--earth)]">Ver detalle</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Estadísticas</p>
                    <p className="text-xs text-[var(--earth)]">Gráficos</p>
                  </div>
                </Card>
                <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <p className="font-bold text-[var(--charcoal)]">Cronograma</p>
                    <p className="text-xs text-[var(--earth)]">Fechas</p>
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
