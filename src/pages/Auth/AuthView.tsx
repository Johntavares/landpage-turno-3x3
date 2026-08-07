import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthViewProps {
  onAdminLogin?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAdminLogin }) => {
  const { isAuthenticated, login, register, resetPassword, isLoading, authError, clearError } = useAuthStore();

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

    // Verificar se são credenciais de administrador
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const isAdminEmail = cleanEmail.includes('admin') || cleanEmail.includes('silva');
    const isAdminPass = cleanPass === 'admin3x3' || cleanPass === 'silva123' || cleanPass === 'admin';

    if (mode === 'login' && isAdminEmail && isAdminPass) {
      await login(email, password);
      onAdminLogin?.();
      return;
    }

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
            src="/logo.png"
            alt="Turno 3x3 Logo Oficial"
            className="mx-auto mb-3 h-20 w-auto object-contain"
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
        </div>

        {/* RODAPÉ: ACESSO COMO CONVIDADO */}


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
