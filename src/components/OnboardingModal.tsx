import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Sparkles } from 'lucide-react';
import type { TeamType } from '../types';
import { useAuthStore } from '../stores/authStore';
import {
  calculateBaseDateFromStatus,
  calculateScheduleDay,
  formatDateISO,
} from '../services/schedule';
import type { CycleState } from '../services/schedule';

export const OnboardingModal: React.FC = () => {
  const { user, completeOnboarding, isOnboarded } = useAuthStore();

  const todayISO = formatDateISO(new Date());

  const [name, setName] = useState(user?.name || '');
  const [team, setTeam] = useState<TeamType>(user?.team || 'A');
  const [cycleState, setCycleState] = useState<CycleState>('WORK_1');
  const [baseDate, setBaseDate] = useState('2026-07-01');

  useEffect(() => {
    const computedBase = calculateBaseDateFromStatus(todayISO, team, cycleState);
    setBaseDate(computedBase);
  }, [team, cycleState, todayISO]);

  if (isOnboarded) return null;

  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const previewTomorrow = calculateScheduleDay(formatDateISO(tomorrowObj), team, baseDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    completeOnboarding(name, team, baseDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-5">
          <img
            src="/logo.png"
            alt="Turno 3x3 Logo Oficial"
            className="mx-auto mb-3 h-16 w-auto object-contain"
          />

          <h2 className="text-xl font-black text-slate-900 dark:text-white">Bem-vindo ao Turno 3x3</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure seu perfil e escala em segundos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Seu Nome
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: João Silva"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Sua Equipe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'A', name: 'Equipe A', shift: 'Turno Dia' },
                { id: 'B', name: 'Equipe B', shift: 'Turno Noite' },
                { id: 'C', name: 'Equipe C', shift: 'Turno Dia (Folga de A)' },
                { id: 'D', name: 'Equipe D', shift: 'Turno Noite (Folga de B)' },
              ].map((item) => {
                const isSelected = team === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTeam(item.id as TeamType)}
                    className={`rounded-xl p-2.5 border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{item.shift}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> O que você está fazendo HOJE ({todayISO.split('-').reverse().join('/')})?
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'WORK_1', label: '1º Dia Trabalho', icon: '🟢' },
                { id: 'WORK_2', label: '2º Dia Trabalho', icon: '🟢' },
                { id: 'WORK_3', label: '3º Dia Trabalho', icon: '🟢' },
                { id: 'OFF_1', label: '1º Dia Folga', icon: '⚪' },
                { id: 'OFF_2', label: '2º Dia Folga', icon: '⚪' },
                { id: 'OFF_3', label: '3º Dia Folga', icon: '⚪' },
              ].map((item) => {
                const isSelected = cycleState === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCycleState(item.id as CycleState)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[11px] text-blue-900 dark:text-blue-200">
              Amanhã ({previewTomorrow.date.split('-').reverse().join('/')}) você estará: <strong>{previewTomorrow.status === 'WORK' ? `🟢 ${previewTomorrow.cycleDay}º Dia de Trabalho` : `⚪ ${previewTomorrow.cycleDay}º Dia de Folga`}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors mt-2 active:scale-[0.98]"
          >
            Confirmar Escala <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
