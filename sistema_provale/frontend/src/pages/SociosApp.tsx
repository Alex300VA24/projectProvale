import { useState, useMemo } from 'react';
import type { SociosPageData } from '@/types';
import { Button, Input, Card, Icon } from '@/components/common';
import { formatDate, formatNumber, cn } from '@/utils';

export default function SociosApp(props: SociosPageData) {
  const { socios, total, page, per_page, filters } = props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [currentPage, setCurrentPage] = useState(page);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredSocios = useMemo(() => {
    if (!searchTerm) return socios;
    return socios.filter(s => 
      s.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dni.includes(searchTerm)
    );
  }, [socios, searchTerm]);

  const filteredByEstado = useMemo(() => {
    if (!filters.estado) return filteredSocios;
    return filteredSocios.filter(s => s.estado === filters.estado);
  }, [filteredSocios, filters.estado]);

  const filteredByTipo = useMemo(() => {
    if (!filters.tipo_socio) return filteredByEstado;
    return filteredByEstado.filter(s => s.tipo_socio === filters.tipo_socio);
  }, [filteredByEstado, filters.tipo_socio]);

  const totalPages = Math.ceil(total / per_page);

  const toggleRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredByTipo.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredByTipo.map(s => s.id));
    }
  };

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Activo' };
      case 'inactivo':
        return { bg: 'var(--clay-light)', color: 'var(--clay)', label: 'Inactivo' };
      case 'suspendido':
        return { bg: 'var(--sun-light)', color: '#D97706', label: 'Suspendido' };
      default:
        return { bg: 'var(--wheat)', color: 'var(--earth)', label: estado };
    }
  };

  const getTipoStyle = (tipo: string) => {
    switch (tipo) {
      case 'ordinario': return { bg: 'var(--leaf-light)', color: 'var(--leaf)', label: 'Ordinario', icon: 'user' };
      case 'honorario': return { bg: 'var(--sun-light)', color: '#D97706', label: 'Honorario', icon: 'star' };
      case 'fundador': return { bg: 'var(--sky-light)', color: 'var(--sky)', label: 'Fundador', icon: 'crown' };
      default: return { bg: 'var(--wheat)', color: 'var(--earth)', label: tipo, icon: 'user-group' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Socios</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona los socios del programa</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReportModal(true)}>
            <Icon name="file-invoice" className="w-4 h-4" />
            Reportes
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Icon name="plus" className="w-4 h-4" /> Nuevo Socio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <Icon name="users" className="w-6 h-6 text-[var(--leaf)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Total Socios</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">{formatNumber(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--leaf-light)] flex items-center justify-center">
              <Icon name="active" className="w-6 h-6 text-[var(--leaf)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Activos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {socios.filter(s => s.estado === 'activo').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--sun-light)] flex items-center justify-center">
              <Icon name="star" className="w-6 h-6 text-[#D97706]" />
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Honorarios</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {socios.filter(s => s.tipo_socio === 'honorario').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--clay-light)] flex items-center justify-center">
              <Icon name="suspended" className="w-6 h-6 text-[var(--clay)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--earth)]">Suspendidos</p>
              <p className="text-2xl font-bold text-[var(--charcoal)]">
                {socios.filter(s => s.estado === 'suspendido').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input placeholder="Buscar por nombre o DNI..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium" defaultValue={filters.estado || ''}>
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="suspendido">Suspendidos</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)] bg-white text-[var(--charcoal)] font-medium" defaultValue={filters.tipo_socio || ''}>
            <option value="">Todos los tipos</option>
            <option value="ordinario">Ordinario</option>
            <option value="honorario">Honorario</option>
            <option value="fundador">Fundador</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[var(--wheat)]">
                <th className="p-4 text-left"><input type="checkbox" checked={selectedRows.length === filteredByTipo.length && filteredByTipo.length > 0} onChange={toggleAll} className="w-5 h-5 rounded border-2 border-[var(--wheat)]" /></th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Socio</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">DNI</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Tipo</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Teléfono</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Estado</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Registro</th>
                <th className="p-4 text-left text-sm font-bold uppercase text-[var(--earth)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredByTipo.map((s) => {
                const status = getStatusStyle(s.estado);
                const tipo = getTipoStyle(s.tipo_socio);
                return (
                  <tr key={s.id} className="border-b border-[var(--wheat)] hover:bg-[var(--cream)]/50">
                    <td className="p-4"><input type="checkbox" checked={selectedRows.includes(s.id)} onChange={() => toggleRow(s.id)} className="w-5 h-5 rounded border-2 border-[var(--wheat)]" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center font-bold">{s.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
                        <div><p className="font-bold text-[var(--charcoal)]">{s.nombre_completo}</p><p className="text-sm text-[var(--earth)]">{s.direccion}</p></div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-[var(--charcoal)]">{s.dni}</td>
                    <td className="p-4"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: tipo.bg, color: tipo.color }}><Icon name={tipo.icon} className="w-3 h-3" /> {tipo.label}</span></td>
                    <td className="p-4 text-[var(--charcoal)]">{s.telefono || '-'}</td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: status.bg, color: status.color }}>{status.label}</span></td>
                    <td className="p-4 text-sm text-[var(--earth)]">{formatDate(s.fecha_registro)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-[var(--leaf-light)] text-[var(--leaf)]" title="Ver"><Icon name="eye" className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--sun-light)] text-[#D97706]" title="Editar"><Icon name="edit" className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--clay-light)] text-[var(--clay)]" title="Inhabilitar"><Icon name="suspended" className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-[var(--clay-light)] text-[var(--clay)]" title="Eliminar"><Icon name="trash" className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-[var(--wheat)]">
          <p className="text-sm text-[var(--earth)]">Mostrando <span className="font-bold">{filteredByTipo.length}</span> de <span className="font-bold">{formatNumber(total)}</span> socios</p>
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
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Nuevo Socio</h2>
              <p className="text-sm text-[var(--earth)]">Completa los datos del nuevo socio</p>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-2">Nombre Completo</label><Input placeholder="Ej: Juan Pérez García" /></div>
              <div><label className="block text-sm font-semibold mb-2">DNI</label><Input placeholder="Ej: 12345678" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-2">Fecha de Nacimiento</label><Input type="date" /></div>
                <div><label className="block text-sm font-semibold mb-2">Sexo</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option value="">Seleccionar</option><option value="M">Masculino</option><option value="F">Femenino</option></select></div>
              </div>
              <div><label className="block text-sm font-semibold mb-2">Dirección</label><Input placeholder="Dirección completa" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-2">Teléfono</label><Input placeholder="987654321" /></div>
                <div><label className="block text-sm font-semibold mb-2">Email</label><Input type="email" placeholder="correo@ejemplo.com" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-2">Tipo de Socio</label><select className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--wheat)]"><option value="ordinario">Ordinario</option><option value="honorario">Honorario</option><option value="fundador">Fundador</option></select></div>
            </div>
            <div className="p-6 border-t-2 border-[var(--wheat)] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModal(false)}>Guardar Socio</Button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b-2 border-[var(--wheat)]">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">Reportes de Socios</h2>
              <p className="text-sm text-[var(--earth)]">Genera reportes y estadísticas</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><Icon name="file-pdf" className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" /><p className="font-bold text-[var(--charcoal)]">Lista de Socios</p><p className="text-xs text-[var(--earth)]">Exportar PDF</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><Icon name="user-group" className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" /><p className="font-bold text-[var(--charcoal)]">Por Tipo</p><p className="text-xs text-[var(--earth)]">Estadísticas</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><Icon name="chart-bar" className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" /><p className="font-bold text-[var(--charcoal)]">Estados</p><p className="text-xs text-[var(--earth)]">Gráficos</p></div></Card>
              <Card className="!p-4 cursor-pointer hover:border-[var(--leaf)]"><div className="text-center"><Icon name="calendar-days" className="w-12 h-12 mx-auto text-[var(--leaf)] mb-2" /><p className="font-bold text-[var(--charcoal)]">Por Fecha</p><p className="text-xs text-[var(--earth)]">Registros</p></div></Card>
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
