import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">PROVALE</h1>
              <p className="text-emerald-100 text-sm font-medium">
                Sistema de Gestión Social
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
              <button
                type="button"
                onClick={() => isLogin || switchMode()}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isLogin
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => !isLogin || switchMode()}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                  !isLogin
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {isLogin ? '¡Bienvenido de nuevo!' : '¡Crear cuenta!'}
              </h2>
              <p className="text-sm text-slate-600">
                {isLogin 
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Completa el formulario para registrarte'
                }
              </p>
            </div>

            {/* Error Messages */}
            {(formData.error || Object.keys(serverErrors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div className="flex-1">
                    {formData.error && (
                      <p className="text-sm font-semibold text-red-800">{formData.error}</p>
                    )}
                    {Object.entries(serverErrors).map(([field, msgs]) => (
                      <p key={field} className="text-sm font-semibold text-red-800">
                        {msgs.join(', ')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
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
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Register Additional Fields */}
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="password1" className="block text-sm font-bold text-slate-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password1"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        placeholder="Confirma tu contraseña"
                        value={formData.password1}
                        onChange={e => setFormData({ ...formData, password1: e.target.value })}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password2" className="block text-sm font-bold text-slate-700 mb-2">
                      Verificar Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password2"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                        placeholder="Verifica tu contraseña"
                        value={formData.password2}
                        onChange={e => setFormData({ ...formData, password2: e.target.value })}
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
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
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
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Additional Options */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button type="button" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="pt-6 border-t-2 border-slate-100">
              <p className="text-center text-sm text-slate-600">
                {isLogin ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
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
                      className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Inicia sesión
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-slate-600 mt-6">
          © 2026 PROVALE - Sistema de Gestión Social
        </p>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}