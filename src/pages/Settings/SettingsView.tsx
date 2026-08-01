import React from 'react';
import { Settings, Moon, Sun, Monitor, Bell, Info, Smartphone } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const { user } = useAuthStore();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-700 dark:text-slate-300" /> Configurações
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize temas, notificações e preferências do aplicativo.
        </p>
      </div>

      <Card className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Aparência / Tema
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Claro', icon: <Sun className="h-4 w-4 text-amber-500" /> },
            { id: 'dark', label: 'Escuro', icon: <Moon className="h-4 w-4 text-indigo-400" /> },
            { id: 'system', label: 'Sistema', icon: <Monitor className="h-4 w-4 text-slate-500" /> },
          ].map((item) => {
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notificações Locais</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Avisos de primeiro e último dia de turno/folga
              </p>
            </div>
          </div>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {notificationsEnabled && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Primeiro dia de trabalho
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Último dia de trabalho
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Início da folga
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Início e término de férias
            </div>
          </div>
        )}
      </Card>

      {user && (
        <Card className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Sua Escala Ativa
          </h3>
          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="font-medium text-slate-600 dark:text-slate-400">Equipe</span>
            <span className="font-bold text-slate-900 dark:text-white">Equipe {user.team}</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="font-medium text-slate-600 dark:text-slate-400">Data Base</span>
            <span className="font-bold text-slate-900 dark:text-white">{user.baseDate}</span>
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sobre o Turno 3x3</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          O Turno 3x3 é um aplicativo mobile desenvolvido para otimizar a rotina e planejamento de profissionais em escalas de revezamento contínuo na mineração e indústria.
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Smartphone className="h-3.5 w-3.5" /> Versão
          </span>
          <span className="font-bold text-slate-900 dark:text-white">2.4.0 (Build APK)</span>
        </div>
      </Card>
    </div>
  );
};
