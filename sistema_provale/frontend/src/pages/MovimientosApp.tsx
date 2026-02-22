import { useState, useMemo } from 'react';
import type { MovimientosPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatDate, formatNumber, cn } from '@/utils';

export default function MovimientosApp(props: MovimientosPageData) {
  const { movimientos, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredMovimientos = useMemo(() => {
    if (!searchTerm) return movimientos;
    return movimientos.filter(m => 
      m.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.motivo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movimientos, searchTerm]);

  const filteredByTipo = useMemo(() => {
    if (!filters.tipo_movimiento) return filteredMovimientos;
    return filteredMovimientos.filter(m => m.tipo_movimiento === filters.tipo_movimiento);
  }, [filteredMovimientos, filters.tipo_movimiento]);

  const totalPages = Math.ceil(total / per_page);

  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Entrada', icon: '↓' };
      case 'salida': return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Salida', icon: '↑' };
      case 'transferencia': return { bg: 'var(--sky-light)', color: 'var(--sky)', label: 'Transferencia', icon: '⇄' };
      default: return { bg: 'var(--wheat)', color: 'var(--earth)', label: tipo, icon: '•' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Movimientos</h1>
          <p className="text-[var(--earth)] mt-1">Historial de movimientos de inventario</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Reportes
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <span className="text-lg">+</span> Nuevo Movimiento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <span className="text-xl font-bold text-[var(--leaf)]">↓</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Entradas</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{movimientos.filter(m => m.tipo_movimiento === 'entrada').length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--clay-light)] flex items-center justify-center">
              <span className="text-xl font-bold text-[var(--clay)]">↑</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Salidas</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{movimientos.filter(m => m.tipo_movimiento === 'salida').length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sky-light)] flex items-center justify-center">
              <span className="text-xl font-bold text-[var(--sky)]">⇄</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Transferencias</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{movimientos.filter(m => m.tipo_movimiento === 'transferencia').length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <span className="text-xl font-bold text-[#D97706]">📦</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Movimiento</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(movimientos.reduce((acc, m) => acc + m.cantidad, 0))}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input placeholder="Buscar por producto, responsable o motivo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white" defaultValue={filters.tipo_movimiento || ''}>
            <option value="">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="transferencia">Transferencia</option>
          </select>
          <Input type="date" className="w-40" placeholder="Desde" />
          <Input type="date" className="w-40" placeholder="Hasta" />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--wheat)]">
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Tipo</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Producto</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Cantidad</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Motivo</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Responsable</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Fecha</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByTipo.map((m) => {
                const tipo = getTipoStyle(m.tipo_movimiento);
                return (
                  <tr key={m.id} className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold" style={{ background: tipo.bg, color: tipo.color }}>
                        {tipo.icon} {tipo.label}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[var(--charcoal)]">{m.producto.nombre}</td>
                    <td className="p-4 font-mono text-[var(--charcoal)]">{m.cantidad}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{m.motivo}</td>
                    <td className="p-4 text-[var(--charcoal)]">{m.responsable}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{formatDate(m.fecha_movimiento)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)]" title="Ver"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--sun-light)] text-[#D97706]" title="Editar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--clay-light)] text-[var(--clay)]" title="Eliminar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-[var(--wheat)]">
          <p className="text-sm text-[var(--earth)]">Mostrando <span className="font-bold">{filteredByTipo.length}</span> de <span className="font-bold">{formatNumber(total)}</span> movimientos</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Anterior</Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={cn('w-10 h-10 rounded-xl font-bold', currentPage === i + 1 ? 'bg-[var(--leaf)] text-white' : 'bg-white border-2 border-[var(--wheat)]')}>{i + 1}</button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Siguiente</Button>
          </div>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nuevo Movimiento</h2>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-2">Tipo de Movimiento</label>
                <select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option value="entrada">Entrada</option><option value="salida">Salida</option><option value="transferencia">Transferencia</option></select>
              </div>
              <div><label className="block text-sm font-semibold mb-2">Producto</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option>Seleccionar producto</option><option>Arroz - 50 kg</option><option>Azúcar - 30 kg</option></select></div>
              <div><label className="block text-sm font-semibold mb-2">Cantidad</label><Input type="number" placeholder="0" /></div>
              <div><label className="block text-sm font-semibold mb-2">Motivo</label><Input placeholder="Motivo del movimiento" /></div>
              <div><label className="block text-sm font-semibold mb-2">Responsable</label><Input placeholder="Nombre del responsable" /></div>
              <div><label className="block text-sm font-semibold mb-2">Fecha</label><Input type="date" /></div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Guardar</Button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b-2 border-[var(--wheat)]"><h2 className="text-xl font-bold">Reportes de Movimientos</h2></div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg><p className="font-bold">Historial General</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><p className="font-bold">Por Tipo</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg><p className="font-bold">Por Fecha</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p className="font-bold">Por Responsable</p></div></Card>
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
