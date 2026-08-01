import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthView: React.FC = () => {
  const { isAuthenticated, login, loginWithProvider, register, resetPassword, isLoading, authError, clearError } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setResetSent(false);

    if (mode === 'login') {
      await login(email, password);
    } else if (mode === 'register') {
      if (!name.trim()) return;
      await register(name, email, password);
    } else if (mode === 'forgot') {
      const ok = await resetPassword(email);
      if (ok) setResetSent(true);
    }
  };

  const handleGuestAccess = async () => {
    await login('operador@turno3x3.com');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between p-6 shadow-xl border-x border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-slate-950">
        
        {/* CABEÇALHO DA TELA DE LOGIN NATIVA */}
        <div className="pt-4 pb-2 text-center">
          <img
            src="/icons/logo.png"
            alt="Turno 3x3 Logo Oficial"
            className="mx-auto mb-3 h-20 w-20 rounded-3xl object-cover shadow-2xl border border-slate-700/40 ring-4 ring-amber-500/20"
          />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            TURNO 3x3
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gestão inteligente de escala e revezamento
          </p>
        </div>

        {/* CONTEÚDO PRINCIPAL DO LOGIN */}
        <div className="my-auto space-y-4">
          
          {/* TABS DE NAVEGAÇÃO: ENTRAR / CRIAR CONTA */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
                setResetSent(false);
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                clearError();
                setResetSent(false);
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* MENSAGEM DE ERRO OU SUCESSO */}
          {authError && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Link de recuperação enviado para seu e-mail!</span>
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN / CADASTRO */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Carlos Eduardo"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        clearError();
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* BOTÃO PRINCIPAL DE LOGIN */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-3.5 font-extrabold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="text-xs">Aguarde...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="h-4 w-4" /> Entrar no aplicativo
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="h-4 w-4" /> Criar Minha Conta
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" /> Enviar Link de Recuperação
                </>
              )}
            </button>
          </form>

          {/* DIVISOR MÉTODOS SOCIAIS */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-950 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              ou acesse com
            </span>
          </div>

          {/* BOTÕES SOCIAIS GOOGLE & APPLE */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => loginWithProvider('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => loginWithProvider('apple')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-900 dark:border-slate-700 bg-slate-900 dark:bg-slate-900 py-2.5 px-3 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.88.13-9.75-1.93-14.61-6.19-3.26-2.76-7.14-7.46-11.66-14.12-6.53-9.61-11.65-20.2-15.37-31.78-3.72-11.58-5.58-22.37-5.58-32.37 0-14.77 3.75-27.13 11.25-37.08 7.5-9.95 17.07-15.02 28.71-15.22 4.63 0 9.77 1.15 15.42 3.44 5.65 2.29 9.53 3.44 11.63 3.44 1.85 0 5.86-1.22 12.03-3.66 6.17-2.44 11.45-3.53 15.83-3.26 12.2.65 22.09 5.3 29.67 13.93-10.86 6.55-16.14 15.77-15.84 27.67.28 9.39 3.96 17.2 11.04 23.42 7.08 6.22 15.67 9.8 25.77 10.74-2.58 7.64-6.07 15.44-10.49 23.4zM119.22 31.81c0-7.39 2.65-14.52 7.95-21.39 5.3-6.87 12.01-11.16 20.13-12.87.28 1.08.42 2.12.42 3.12 0 7.35-2.73 14.5-8.19 21.46-5.46 6.96-12.21 11.23-20.25 12.81-.06-1.08-.06-2.12-.06-3.13z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* RODAPÉ: ACESSO COMO CONVIDADO */}
        <div className="pb-4 pt-2 text-center border-t border-slate-100 dark:border-slate-900">
          <button
            type="button"
            onClick={handleGuestAccess}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span>Usar sem conta (Modo Offline)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
