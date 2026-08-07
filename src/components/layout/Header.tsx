import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useAppStore();

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-2">
      <div className="flex items-center gap-3">
        {/* Logo Oficial do Usuário */}
        <img
          src="/logo.png"
          alt="Turno 3x3 Logo Oficial"
          className="h-9 w-auto object-contain shrink-0"
        />


        <div>
          {/* Título sem o efeito de pílula/fundo no 3x3 */}
          <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
            TURNO 3x3
          </h1>

          {user && (
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Equipe {user.team} • {user.team === 'A' || user.team === 'C' ? 'Turno Dia' : 'Turno Noite'}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
      </button>
    </header>
  );
};
