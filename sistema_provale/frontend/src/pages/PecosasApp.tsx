import { useState, useMemo } from 'react';
import type { PecosasPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatDate, formatNumber, cn } from '@/utils';

export default function PecosasApp(props: PecosasPageData) {
  const { pecosas, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredPecosas = useMemo(() => {
    if (!searchTerm) return pecosas;
    return pecosas.filter(p => 
      p.numero_pecosa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.beneficiario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.beneficiario.dni.includes(searchTerm)
    );
  }, [pecosas, searchTerm]);

  const filteredByEstado = useMemo(() => {
    if (!filters.estado) return filteredPecosas;
    return filteredPecosas.filter(p => p.estado === filters.estado);
  }, [filteredPecosas, filters.estado]);

  const totalPages = Math.ceil(total / per_page);

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'pendiente': return { bg: 'var(--sun-light)', color: '#D97706', label: 'Pendiente' };
      case 'aprobada': return { bg: 'var(--sky-light)', color: 'var(--sky)', label: 'Aprobada' };
      case 'entregada': return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Entregada' };
      case 'cancelada': return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Cancelada' };
      default: return { bg: 'var(--wheat)', color: 'var(--earth)', label: estado };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">PECOSAS</h1>
          <p className="text-[var(--earth)] mt-1">Pedidos de Consumo de Salud</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Reportes
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <span className="text-lg">+</span> Nueva PECOSA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total PECOSAS</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Pendientes</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{pecosas.filter(p => p.estado === 'pendiente').length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Entregadas</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{pecosas.filter(p => p.estado === 'entregada').length}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sky-light)] flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Valor Total</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">S/ {formatNumber(pecosas.reduce((acc, p) => acc + p.total, 0))}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input placeholder="Buscar por número, beneficiario o DNI..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white" defaultValue={filters.estado || ''}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="entregada">Entregada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white" defaultValue={filters.club_id || ''}>
            <option value="">Todos los clubs</option>
            <option value="1">Club San Luis</option>
            <option value="2">Club Primavera</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--wheat)]">
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">N° PECOSA</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Beneficiario</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Club</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Fecha</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Items</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Total</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByEstado.map((p) => {
                const estado = getEstadoStyle(p.estado);
                return (
                  <tr key={p.id} className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50">
                    <td className="p-4 font-mono font-bold text-[var(--charcoal)]">{p.numero_pecosa}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-[var(--charcoal)]">{p.beneficiario.nombre_completo}</p>
                        <p className="text-xs text-[var(--earth)]">{p.beneficiario.dni}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--charcoal)]">{p.club.nombre}</td>
                    <td className="p-4 text-sm text-[var(--earth)]">{formatDate(p.fecha_emision)}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-[var(--cream)] text-[var(--charcoal)]">
                        {p.items.length} items
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[var(--charcoal)]">S/ {formatNumber(p.total)}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: estado.bg, color: estado.color }}>
                        {estado.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)]" title="Ver"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--sun-light)] text-[#D97706]" title="Editar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        {p.estado === 'pendiente' && (
                          <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)]" title="Aprobar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></button>
                        )}
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
          <p className="text-sm text-[var(--earth)]">Mostrando <span className="font-bold">{filteredByEstado.length}</span> de <span className="font-bold">{formatNumber(total)}</span> PECOSAS</p>
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
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nueva PECOSA</h2>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-2">Beneficiario</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option>Seleccionar beneficiario</option><option>Juan Pérez - 12345678</option><option>María García - 87654321</option></select></div>
              <div><label className="block text-sm font-semibold mb-2">Club</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option>Seleccionar club</option><option>Club San Luis</option><option>Club Primavera</option></select></div>
              <div><label className="block text-sm font-semibold mb-2">Fecha de Emisión</label><Input type="date" /></div>
              <div className="border-t-2 border-[var(--wheat)] pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold">Items</label>
                  <Button size="sm" variant="outline">+ Agregar Item</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2"><select className="flex-1 px-3 py-2 rounded-xl border-2 border-[var(--wheat)]"><option>Producto 1</option></select><Input type="number" className="w-20" placeholder="Cant"/><Input type="number" className="w-24" placeholder="Precio"/><button className="p-2 text-[var(--clay)]">✕</button></div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Crear PECOSA</Button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b-2 border-[var(--wheat)]"><h2 className="text-xl font-bold">Reportes de PECOSAS</h2></div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg><p className="font-bold">Lista General</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><p className="font-bold">Por Estado</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg><p className="font-bold">Por Fecha</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg><p className="font-bold">Valor Total</p></div></Card>
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
