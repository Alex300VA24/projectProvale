import { useState, useMemo } from 'react';
import type { BeneficiariosPageData } from '@/types';
import { Button, Input, Card } from '@/components/common';
import { formatDate, formatNumber, cn } from '@/utils';

export default function BeneficiariosApp(props: BeneficiariosPageData) {
  const { beneficiarios, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredBeneficiarios = useMemo(() => {
    if (!searchTerm) return beneficiarios;
    return beneficiarios.filter(b => 
      b.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.dni.includes(searchTerm)
    );
  }, [beneficiarios, searchTerm]);

  const totalPages = Math.ceil(total / per_page);

  const toggleRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredBeneficiarios.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredBeneficiarios.map(b => b.id));
    }
  };

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Activo' };
      case 'inactivo':
        return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Inactivo' };
      case 'pendiente':
        return { bg: 'var(--sun-light)', color: '#D97706', label: 'Pendiente' };
      default:
        return { bg: 'var(--wheat)', color: 'var(--earth)', label: estado };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Beneficiarios</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona los beneficiarios del programa social</p>
        </div>
        <Button>
          <span className="text-lg">+</span> Nuevo Beneficiario
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nombre o DNI..."
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
            <option value="pendiente">Pendientes</option>
          </select>
          <select 
            className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium focus:outline-none focus:border-[var(--leaf)]"
            defaultValue={filters.club_id || ''}
          >
            <option value="">Todos los clubs</option>
            <option value="1">Club San Luis</option>
            <option value="2">Club Primavera</option>
            <option value="3">Club Esperanza</option>
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
                    checked={selectedRows.length === filteredBeneficiarios.length && filteredBeneficiarios.length > 0}
                    onChange={toggleAll}
                    className="w-5 h-5 rounded border-2 border-[var(--wheat)] text-[var(--leaf)] focus:ring-[var(--leaf)]"
                  />
                </th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Beneficiario</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">DNI</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Club</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Registro</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeneficiarios.map((b) => {
                const status = getStatusStyle(b.estado);
                return (
                  <tr 
                    key={b.id} 
                    className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50 transition-colors"
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox"
                        checked={selectedRows.includes(b.id)}
                        onChange={() => toggleRow(b.id)}
                        className="w-5 h-5 rounded border-2 border-[var(--wheat)] text-[var(--leaf)] focus:ring-[var(--leaf)]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center font-bold">
                          {b.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--charcoal)]">{b.nombre_completo}</p>
                          <p className="text-sm text-[var(--earth)]">{b.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-[var(--charcoal)]">{b.dni}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-[var(--cream)] text-[var(--charcoal)]">
                        🏠 {b.club.nombre}
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
                    <td className="p-4 text-sm text-[var(--earth)]">{formatDate(b.fecha_registro)}</td>
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
            Mostrando <span className="font-bold text-[var(--charcoal)]">{filteredBeneficiarios.length}</span> de{' '}
            <span className="font-bold text-[var(--charcoal)]">{formatNumber(total)}</span> beneficiarios
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
    </div>
  );
}
