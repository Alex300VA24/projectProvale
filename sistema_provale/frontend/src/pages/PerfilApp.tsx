import { useState } from 'react';
import { Button, Input, Card, Icon } from '@/components/common';

interface PerfilPageData {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export default function PerfilApp(props: PerfilPageData) {
  const { user } = props;
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'preferencias'>('perfil');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'perfil', label: 'Información Personal', icon: 'user' },
    { id: 'seguridad', label: 'Seguridad', icon: 'shield' },
    { id: 'preferencias', label: 'Preferencias', icon: 'settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--charcoal)]">Mi Perfil</h1>
          <p className="text-[var(--earth)] mt-1">Gestiona tu información personal y preferencias</p>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card className="!p-0 overflow-hidden">
            <div className="h-32 relative" style={{ background: 'linear-gradient(135deg, var(--leaf) 0%, #2D5A3D 100%)' }}>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[var(--leaf)] flex items-center justify-center text-white text-3xl font-bold">
                    {user.first_name ? user.first_name[0] : user.username[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6 text-center">
              <h2 className="text-xl font-bold text-[var(--charcoal)]">
                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
              </h2>
              <p className="text-[var(--earth)]">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--leaf-light)] text-[var(--leaf)]">
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </Card>

          <Card className="!p-0">
            <div className="p-4 border-b border-[var(--wheat)]">
              <h3 className="font-bold text-[var(--charcoal)]">Estadísticas</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--earth)]">Miembro desde</span>
                <span className="text-sm font-bold text-[var(--charcoal)]">Enero 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--earth)]">Último acceso</span>
                <span className="text-sm font-bold text-[var(--charcoal)]">Hoy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--earth)]">Sesiones activas</span>
                <span className="text-sm font-bold text-[var(--leaf)]">1 dispositivo</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b-2 border-[var(--wheat)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-bold text-sm transition-colors relative ${
                  activeTab === tab.id ? 'text-[var(--leaf)]' : 'text-[var(--earth)] hover:text-[var(--charcoal)]'
                }`}
              >
                <Icon name={tab.icon} className="w-4 h-4 mr-2" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--leaf)]" />
                )}
              </button>
            ))}
          </div>

          {/* Perfil Tab */}
          {activeTab === 'perfil' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-[var(--charcoal)]">Información Personal</h3>
                <Button variant={isEditing ? 'primary' : 'outline'} onClick={() => setIsEditing(!isEditing)}>
                  <Icon name="edit" className="w-4 h-4 mr-2" />
                  {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Nombres</label>
                  <Input 
                    defaultValue={user.first_name} 
                    disabled={!isEditing}
                    placeholder="Tus nombres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Apellidos</label>
                  <Input 
                    defaultValue={user.last_name} 
                    disabled={!isEditing}
                    placeholder="Tus apellidos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Nombre de Usuario</label>
                  <Input 
                    defaultValue={user.username} 
                    disabled={!isEditing}
                    placeholder="Nombre de usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Correo Electrónico</label>
                  <Input 
                    type="email"
                    defaultValue={user.email} 
                    disabled={!isEditing}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Teléfono</label>
                  <Input 
                    defaultValue="987654321" 
                    disabled={!isEditing}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Cargo</label>
                  <Input 
                    defaultValue="Administrador del Sistema" 
                    disabled={true}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Seguridad Tab */}
          {activeTab === 'seguridad' && (
            <div className="space-y-6">
              <Card>
                <h3 className="font-bold text-lg text-[var(--charcoal)] mb-6">Cambiar Contraseña</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Contraseña Actual</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Nueva Contraseña</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--charcoal)] mb-2">Confirmar Nueva Contraseña</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button>Actualizar Contraseña</Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-lg text-[var(--charcoal)] mb-4">Sesiones Activas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--wheat)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--leaf-light)] flex items-center justify-center">
                        <Icon name="laptop" className="text-[var(--leaf)]" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--charcoal)]">Sesión Actual</p>
                        <p className="text-sm text-[var(--earth)]">Chrome en Windows • Activo ahora</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[var(--leaf)] bg-[var(--leaf-light)] px-2 py-1 rounded-full">Actual</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Preferencias Tab */}
          {activeTab === 'preferencias' && (
            <Card>
              <h3 className="font-bold text-lg text-[var(--charcoal)] mb-6">Preferencias del Sistema</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--wheat)]">
                  <div>
                    <p className="font-bold text-[var(--charcoal)]">Notificaciones por correo</p>
                    <p className="text-sm text-[var(--earth)]">Recibe alertas sobre actividades importantes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--leaf)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--wheat)]">
                  <div>
                    <p className="font-bold text-[var(--charcoal)]">Alertas de stock bajo</p>
                    <p className="text-sm text-[var(--earth)]">Notificaciones cuando el inventario está bajo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--leaf)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-[var(--wheat)]">
                  <div>
                    <p className="font-bold text-[var(--charcoal)]">Tema Oscuro</p>
                    <p className="text-sm text-[var(--earth)]">Activar modo oscuro de la interfaz</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--leaf)]"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
