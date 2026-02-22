import { useState, useMemo } from 'react';
import type { ProductosPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatNumber, cn } from '@/utils';

export default function ProductosApp(props: ProductosPageData) {
  const { productos, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredProductos = useMemo(() => {
    if (!searchTerm) return productos;
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const filteredByCategoria = useMemo(() => {
    if (!filters.categoria) return filteredProductos;
    return filteredProductos.filter(p => p.categoria === filters.categoria);
  }, [filteredProductos, filters.categoria]);

  const filteredByEstado = useMemo(() => {
    if (!filters.estado) return filteredByCategoria;
    return filteredByCategoria.filter(p => p.estado === filters.estado);
  }, [filteredByCategoria, filters.estado]);

  const totalPages = Math.ceil(total / per_page);

  const toggleRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getCategoriaStyle = (categoria: string) => {
    switch (categoria) {
      case 'alimentos': return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Alimentos', icon: '🍞' };
      case 'higiene': return { bg: 'var(--sky-light)', color: 'var(--sky)', label: 'Higiene', icon: '🧼' };
      case 'medicamentos': return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Medicamentos', icon: '💊' };
      case 'utiles': return { bg: 'var(--sun-light)', color: '#D97706', label: 'Útiles', icon: '📚' };
      default: return { bg: 'var(--wheat)', color: 'var(--earth)', label: 'Otro', icon: '📦' };
    }
  };

  const getStockStyle = (actual: number, minimo: number) => {
    if (actual <= 0) return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Sin Stock' };
    if (actual <= minimo) return { bg: 'var(--sun-light)', color: '#D97706', label: 'Stock Bajo' };
    return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Stock OK' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Productos</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona el inventario de productos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Reportes
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <span className="text-lg">+</span> Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--leaf)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Productos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Stock Bajo</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {productos.filter(p => p.stock_actual <= p.stock_minimo && p.stock_actual > 0).length}
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
              <p className="text-sm text-[var(--earth)]">Sin Stock</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {productos.filter(p => p.stock_actual <= 0).length}
              </p>
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
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                S/ {formatNumber(productos.reduce((acc, p) => acc + (p.stock_actual * p.precio_unitario), 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium" defaultValue={filters.categoria || ''}>
            <option value="">Todas las categorías</option>
            <option value="alimentos">Alimentos</option>
            <option value="higiene">Higiene</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="utiles">Útiles</option>
            <option value="otro">Otro</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium" defaultValue={filters.estado || ''}>
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--wheat)]">
                <th className="p-4 text-left"><input type="checkbox" className="w-5 h-5 rounded border-2 border-[var(--wheat)]" /></th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Producto</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Categoría</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Unidad</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Stock</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Precio</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByEstado.map((p) => {
                const cat = getCategoriaStyle(p.categoria);
                const stock = getStockStyle(p.stock_actual, p.stock_minimo);
                return (
                  <tr key={p.id} className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50">
                    <td className="p-4"><input type="checkbox" checked={selectedRows.includes(p.id)} onChange={() => toggleRow(p.id)} className="w-5 h-5 rounded border-2 border-[var(--wheat)]" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--cream)] flex items-center justify-center text-xl">{cat.icon}</div>
                        <div>
                          <p className="font-bold text-[var(--charcoal)]">{p.nombre}</p>
                          <p className="text-xs text-[var(--earth)]">{p.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: cat.bg, color: cat.color }}>{cat.icon} {cat.label}</span></td>
                    <td className="p-4 text-[var(--charcoal)]">{p.unidad_medida}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-[var(--wheat)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (p.stock_actual / p.stock_minimo) * 50)}%`, background: stock.color }} />
                        </div>
                        <span className="text-sm font-bold" style={{ color: stock.color }}>{p.stock_actual}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[var(--charcoal)]">S/ {formatNumber(p.precio_unitario)}</td>
                    <td className="p-4">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase', p.estado === 'activo' ? 'bg-[var(--leaf-light)] text-[var(--leaf)]' : 'bg-[var(--clay-light)] text-[var(--clay)]')}>
                        {p.estado}
                      </span>
                    </td>
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
          <p className="text-sm text-[var(--earth)]">Mostrando <span className="font-bold">{filteredByEstado.length}</span> de <span className="font-bold">{formatNumber(total)}</span> productos</p>
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
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nuevo Producto</h2>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-2">Nombre</label><Input placeholder="Nombre del producto" /></div>
              <div><label className="block text-sm font-semibold mb-2">Descripción</label><Input placeholder="Descripción" /></div>
              <div><label className="block text-sm font-semibold mb-2">Categoría</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option>Alimentos</option><option>Higiene</option><option>Medicamentos</option><option>Útiles</option><option>Otro</option></select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-2">Unidad</label><Input placeholder="kg, lt, und" /></div>
                <div><label className="block text-sm font-semibold mb-2">Precio</label><Input type="number" placeholder="0.00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-2">Stock Actual</label><Input type="number" placeholder="0" /></div>
                <div><label className="block text-sm font-semibold mb-2">Stock Mínimo</label><Input type="number" placeholder="0" /></div>
              </div>
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
            <div className="p-6 border-b-2 border-[var(--wheat)]"><h2 className="text-xl font-bold">Reportes de Productos</h2></div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg><p className="font-bold">Inventario General</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><p className="font-bold">Por Categoría</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg><p className="font-bold">Stock Bajo</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><svg className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg><p className="font-bold">Valoración</p></div></Card>
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
