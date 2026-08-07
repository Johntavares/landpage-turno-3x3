import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Check, Sparkles, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import type { TeamType } from '../../types';
import { Card } from '../../components/ui/Card';
import { CustomManagedBanner } from '../../components/ui/CustomManagedBanner';

import {
  calculateBaseDateFromStatus,
  calculateScheduleDay,
  formatDateISO,
  getCycleStateFromDay,
} from '../../services/schedule';
import type { CycleState } from '../../services/schedule';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logout } = useAuthStore();

  const todayISO = formatDateISO(new Date());

  const [name, setName] = useState(user?.name || '');
  const [team, setTeam] = useState<TeamType>(user?.team || 'A');
  const [baseDate, setBaseDate] = useState(user?.baseDate || '2026-07-01');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const initialDayCalc = calculateScheduleDay(todayISO, team, baseDate);
  const [cycleState, setCycleState] = useState<CycleState>(getCycleStateFromDay(initialDayCalc));

  if (!user) return null;

  useEffect(() => {
    const computedBase = calculateBaseDateFromStatus(todayISO, team, cycleState);
    setBaseDate(computedBase);
  }, [team, cycleState, todayISO]);

  const previewToday = calculateScheduleDay(todayISO, team, baseDate);
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const previewTomorrow = calculateScheduleDay(formatDateISO(tomorrowObj), team, baseDate);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, team, baseDate });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" /> Meu Perfil e Escala
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gerencie suas informações e ajuste a posição da escala.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
          title="Sair da Conta"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>

      <Card className="flex items-center gap-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white font-black text-2xl border border-white/30 shadow-md">
          {user.name ? user.name.substring(0, 2).toUpperCase() : 'OP'}
        </div>
        <div>
          <h3 className="text-lg font-black">{user.name}</h3>
          <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
            <Mail className="h-3 w-3" /> {user.email}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
            <Shield className="h-3 w-3" /> Equipe {user.team}
          </div>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              1. Sua Equipe de Revezamento
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'A', label: 'Equipe A (Dia)' },
                { id: 'B', label: 'Equipe B (Noite)' },
                { id: 'C', label: 'Equipe C (Dia)' },
                { id: 'D', label: 'Equipe D (Noite)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTeam(item.id as TeamType)}
                  className={`rounded-xl p-2.5 border text-xs font-bold transition-all ${
                    team === item.id
                      ? 'border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" /> 2. O que você está fazendo HOJE ({todayISO.split('-').reverse().join('/')})?
              </label>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'WORK_1', label: '1º Dia Trabalho', icon: '🟢' },
                { id: 'WORK_2', label: '2º Dia Trabalho', icon: '🟢' },
                { id: 'WORK_3', label: '3º Dia Trabalho', icon: '🟢', highlight: 'Último dia de turno!' },
                { id: 'OFF_1', label: '1º Dia Folga', icon: '⚪', highlight: 'Início da folga!' },
                { id: 'OFF_2', label: '2º Dia Folga', icon: '⚪' },
                { id: 'OFF_3', label: '3º Dia Folga', icon: '⚪' },
              ].map((item) => {
                const isSelected = cycleState === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCycleState(item.id as CycleState)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white font-black shadow-md scale-102'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xs">{item.icon} {item.label}</span>
                    {item.highlight && (
                      <span className={`text-[9px] mt-0.5 font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.highlight}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
              <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <span>Resultado do Ajuste:</span>
                <span className="text-[10px] bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded-full font-extrabold text-blue-900 dark:text-blue-100">
                  Data-Base: {baseDate}
                </span>
              </div>
              <p className="text-blue-800 dark:text-blue-300">
                • <strong>Hoje ({todayISO.split('-').reverse().join('/')}):</strong> {previewToday.status === 'WORK' ? `🟢 ${previewToday.cycleDay}º Dia de Trabalho` : `⚪ ${previewToday.cycleDay}º Dia de Folga`}
              </p>
              <p className="text-blue-800 dark:text-blue-300">
                • <strong>Amanhã ({previewTomorrow.date.split('-').reverse().join('/')}):</strong> {previewTomorrow.status === 'WORK' ? `🟢 ${previewTomorrow.cycleDay}º Dia de Trabalho` : `⚪ ${previewTomorrow.cycleDay}º Dia de Folga`}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Membro desde:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '08/07/2026'}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-md active:scale-98 ${
              savedSuccess ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="h-5 w-5" /> Escala e Perfil Atualizados!
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Salvar Configuração da Escala
              </>
            )}
          </button>
        </form>
      </Card>

      {/* BANNER: GERENCIÁVEL PELO PAINEL ADMIN NO PERFIL */}
      <CustomManagedBanner
        ad={useAppStore.getState().ads.find((a) => a.active && a.location === 'PROFILE')}
      />

    </div>
  );
};

