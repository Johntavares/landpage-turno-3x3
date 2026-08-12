import React from 'react';
import { Settings, Moon, Sun, Monitor, Bell, Info, Smartphone, Share2 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { shareApp } from '../../utils/share';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const { user } = useAuthStore();





  const handleToggleNotifications = async () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);

    if (nextState && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Turno 3x3 🔔', {
            body: 'Notificações ativadas! Você receberá avisos sobre seus plantões, trocas e folgas.',
            icon: '/logo.jpg',
          });
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão de notificação:', err);
      }
    }
  };

  const handleSendTestNotification = () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta Notificações Web.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Turno 3x3 - Alerta de Teste ⏰', {
        body: 'O seu sistema de notificações de turno e folgas está funcionando perfeitamente!',
        icon: '/logo.jpg',
      });
    } else {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification('Turno 3x3 - Alerta de Teste ⏰', {
            body: 'O seu sistema de notificações de turno e folgas está funcionando perfeitamente!',
            icon: '/logo.jpg',
          });
        } else {
          alert('Por favor, permita as notificações nas configurações do seu navegador ou dispositivo.');
        }
      });
    }
  };

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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notificações do App</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Avisos de plantões, trocas de turno e folgas
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleNotifications}
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
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Primeiro dia de trabalho (Início de ciclo)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Trocas entre Dia ☀️ e Noite 🌙
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Início da Folga
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Lembrete de Férias ativas
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSendTestNotification}
                className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
              >
                <Bell className="h-3.5 w-3.5" /> Testar Notificação Agora
              </button>
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

      <Card className="space-y-3 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-slate-900/10 border-blue-200/60 dark:border-blue-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Indique o Turno 3x3</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compartilhe com seus colegas de equipe e trabalho!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => shareApp()}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="h-4 w-4" /> Compartilhar com Colegas
          </button>
        </div>
      </Card>

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

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Um produto VERTEX
          </span>
        </div>
      </Card>
    </div>
  );
};



