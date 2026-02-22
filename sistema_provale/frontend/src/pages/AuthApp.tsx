import { useState } from 'react';
import { Icon } from '@/components/common';

interface AuthProps {
  errors?: Record<string, string[]>;
  next?: string;
}

interface FormData {
  username: string;
  password: string;
  password1: string;
  password2: string;
  error?: string;
}

export default function AuthApp({ errors = {}, next = '/' }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>(errors);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    password1: '',
    password2: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormData(prev => ({ ...prev, error: '' }));
    setServerErrors({});
    
    const form = new FormData();
    form.append('username', formData.username);
    form.append('password', formData.password);
    
    if (!isLogin) {
      form.append('password1', formData.password1);
      form.append('password2', formData.password2);
    }

    try {
      const url = isLogin ? '/login/' : '/register/';
      const response = await fetch(url, {
        method: 'POST',
        body: form,
        headers: {
          'X-CSRFToken': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
        },
      });

      if (response.ok) {
        window.location.href = next;
      } else {
        const data = await response.json();
        if (data.errors) {
          setServerErrors(data.errors);
        } else {
          setFormData(prev => ({ ...prev, error: data.message || 'Error en la autenticación' }));
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setFormData(prev => ({ ...prev, error: 'Error de conexión. Intenta nuevamente.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setServerErrors({});
    setFormData({ username: '', password: '', password1: '', password2: '' });
  };

  return (
    <div className="bg-white rounded-[28px] shadow-2xl border-2 border-[var(--wheat)] overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[var(--leaf)] to-[#2D5A3D] px-6 py-8 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 mb-3 shadow-lg">
            <Icon name="users" className="text-3xl text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">PROVALE</h1>
          <p className="text-white/80 text-xs font-medium">Programa Social de Gestión</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6">
        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-[var(--cream)] rounded-xl mb-5">
          <button
            type="button"
            onClick={() => isLogin || switchMode()}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              isLogin
                ? 'bg-white text-[var(--leaf)] shadow-md'
                : 'text-[var(--earth)] hover:text-[var(--charcoal)]'
            }`}
          >
            <Icon name="user" className="mr-1" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => !isLogin || switchMode()}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              !isLogin
                ? 'bg-white text-[var(--leaf)] shadow-md'
                : 'text-[var(--earth)] hover:text-[var(--charcoal)]'
            }`}
          >
            <Icon name="user-plus" className="mr-1" />
            Registrarse
          </button>
        </div>

        {/* Welcome Message */}
        <div className="mb-4">
          <h2 className="text-xl font-black text-[var(--charcoal)] mb-1">
            {isLogin ? '¡Bienvenido de nuevo!' : '¡Crear cuenta!'}
          </h2>
          <p className="text-xs text-[var(--earth)]">
            {isLogin 
              ? 'Ingresa tus credenciales para continuar'
              : 'Completa el formulario para registrarte'
            }
          </p>
        </div>

        {/* Error Messages */}
        {(formData.error || Object.keys(serverErrors).length > 0) && (
          <div className="mb-6 p-4 bg-[var(--clay-light)] border-2 border-[var(--clay)] rounded-xl">
            <div className="flex items-start gap-3">
              <Icon name="alert" className="text-[var(--clay)] text-xl mt-0.5" />
              <div className="flex-1">
                {formData.error && (
                  <p className="text-sm font-semibold text-[var(--clay)]">{formData.error}</p>
                )}
                {Object.entries(serverErrors).map(([field, msgs]) => (
                  <p key={field} className="text-sm font-semibold text-[var(--clay)]">
                    {msgs.join(', ')}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-xs font-bold text-[var(--charcoal)] mb-1.5">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="user" className="text-sm text-[var(--earth)]" />
              </div>
              <input
                type="text"
                id="username"
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--cream)] border-2 border-[var(--wheat)] rounded-lg text-[var(--charcoal)] placeholder-[var(--earth)] focus:outline-none focus:border-[var(--leaf)] focus:bg-white transition-all font-medium text-sm"
                placeholder="Ingresa tu usuario"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[var(--charcoal)] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="shield" className="text-sm text-[var(--earth)]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 pr-10 py-2.5 bg-[var(--cream)] border-2 border-[var(--wheat)] rounded-lg text-[var(--charcoal)] placeholder-[var(--earth)] focus:outline-none focus:border-[var(--leaf)] focus:bg-white transition-all font-medium text-sm"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--earth)] hover:text-[var(--charcoal)] transition-colors"
              >
                <Icon name={showPassword ? "inactive" : "eye"} className="text-sm" />
              </button>
            </div>
          </div>

          {/* Register Additional Fields */}
          {!isLogin && (
            <>
              <div>
                <label htmlFor="password1" className="block text-xs font-bold text-[var(--charcoal)] mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="shield" className="text-sm text-[var(--earth)]" />
                  </div>
                  <input
                    type="password"
                    id="password1"
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--cream)] border-2 border-[var(--wheat)] rounded-lg text-[var(--charcoal)] placeholder-[var(--earth)] focus:outline-none focus:border-[var(--leaf)] focus:bg-white transition-all font-medium text-sm"
                    placeholder="Confirma tu contraseña"
                    value={formData.password1}
                    onChange={e => setFormData({ ...formData, password1: e.target.value })}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-5 bg-gradient-to-r from-[var(--leaf)] to-[#2D5A3D] hover:from-[#3D6B4A] hover:to-[var(--leaf)] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                <Icon name="arrow-right" className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password */}
        {isLogin && (
          <div className="mt-3 text-center">
            <button type="button" className="text-xs font-semibold text-[var(--leaf)] hover:text-[#3D6B4A] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <div className="pt-4 border-t-2 border-[var(--wheat)]">
          <p className="text-center text-xs text-[var(--earth)]">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-bold text-[var(--leaf)] hover:text-[#3D6B4A] transition-colors"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-bold text-[var(--leaf)] hover:text-[#3D6B4A] transition-colors"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-3 bg-[var(--cream)] border-t-2 border-[var(--wheat)]">
        <p className="text-xs text-[var(--earth)]">
          © 2026 <span className="font-bold text-[var(--leaf)]">PROVALE</span> - Sistema de Gestión Social
        </p>
      </div>
    </div>
  );
}
