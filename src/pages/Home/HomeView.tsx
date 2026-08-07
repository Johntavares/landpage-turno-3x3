import React, { useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { calculateScheduleDay, getNextShiftChangeInfo, calculateMonthSchedule, formatDateISO } from '../../services/schedule';
import { Card } from '../../components/ui/Card';
import { AdCard } from '../../components/ui/AdCard';
import { CustomManagedBanner } from '../../components/ui/CustomManagedBanner';


export const HomeView: React.FC = () => {
  const { user } = useAuthStore();
  const { vacations, allHolidays, ads, loadAds } = useAppStore();

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  if (!user) return null;

  const today = new Date();
  const todayISO = formatDateISO(today);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const todayCalc = calculateScheduleDay(todayISO, user.team, user.baseDate, vacations, allHolidays);
  const shiftInfo = getNextShiftChangeInfo(todayISO, user.team, user.baseDate, vacations, allHolidays);

  const monthDays = calculateMonthSchedule(currentYear, currentMonth, user.team, user.baseDate, vacations, allHolidays);
  const totalWorkDays = monthDays.filter((d) => d.status === 'WORK').length;
  const totalOffDays = monthDays.filter((d) => d.status === 'OFF').length;
  const workedHolidaysCount = monthDays.filter((d) => d.isHolidayWork).length;

  const formatDisplayDate = (isoStr: string) => {
    if (!isoStr) return '--/--';
    const [y, m, d] = isoStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const cardGradient =
    todayCalc.status === 'WORK'
      ? 'bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/40 text-white'
      : todayCalc.status === 'VACATION'
      ? 'bg-linear-to-br from-slate-900 via-cyan-950 to-slate-900 border-cyan-500/40 text-white'
      : 'bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/40 text-white';

  const statusDotColor =
    todayCalc.status === 'WORK'
      ? 'bg-emerald-400 shadow-emerald-500/50'
      : todayCalc.status === 'VACATION'
      ? 'bg-cyan-400 shadow-cyan-500/50'
      : 'bg-slate-300 shadow-slate-400/50';

  const badgeBg =
    todayCalc.status === 'WORK'
      ? 'bg-emerald-500 text-slate-950 font-black'
      : todayCalc.status === 'VACATION'
      ? 'bg-cyan-400 text-slate-950 font-black'
      : 'bg-white text-slate-900 font-black';

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* CARD PRINCIPAL HERO STATUS */}
      <div className={`relative overflow-hidden rounded-3xl p-5 border-2 shadow-2xl transition-all ${cardGradient}`}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-slate-400" />
            <span className="capitalize">
              {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </span>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white border border-white/15">
            Equipe {user.team} • {todayCalc.shift === 'DAY' ? 'Dia ☀️' : 'Noite 🌙'}
          </span>
        </div>

        <div className="mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Hoje você está:
          </span>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`h-4 w-4 rounded-full shadow-lg animate-pulse ${statusDotColor}`} />
              <h2 className="text-2xl font-black tracking-tight text-white">
                {todayCalc.status === 'WORK' && 'Trabalhando'}
                {todayCalc.status === 'OFF' && 'De Folga'}
                {todayCalc.status === 'VACATION' && 'Em Férias'}
              </h2>
            </div>

            <div className={`px-3.5 py-1.5 rounded-full text-xs shadow-md tracking-tight ${badgeBg}`}>
              {todayCalc.status === 'WORK' && `${todayCalc.cycleDay}º Dia de Trabalho`}
              {todayCalc.status === 'OFF' && `${todayCalc.cycleDay}º Dia de Folga`}
              {todayCalc.status === 'VACATION' && 'Férias Ativas'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
            <span className="text-slate-400 block font-semibold text-[11px]">Próxima Troca</span>
            <span className="text-base font-black text-white mt-0.5 block">
              em {shiftInfo.daysUntilChange} {shiftInfo.daysUntilChange === 1 ? 'dia' : 'dias'}
            </span>
          </div>

          <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
            <span className="text-slate-400 block font-semibold text-[11px]">Próxima Folga</span>
            <span className="text-base font-black text-white mt-0.5 block">
              {formatDisplayDate(shiftInfo.nextOffDate)}
            </span>
          </div>
        </div>
      </div>

      {/* FERIADO EM DIA DE TRABALHO ALERTA */}
      {todayCalc.isHolidayWork && todayCalc.holiday && (
        <Card className="border-2 border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                Feriado no seu Plantão! (100% Adicional)
              </h4>
              <p className="text-xs mt-1 opacity-90">
                Hoje é <strong>{todayCalc.holiday.name}</strong>. Você está escalado para trabalhar neste feriado.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* DASHBOARD DE RESUMOS MENSAIS */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Resumo de {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <Card className="text-center p-3 border border-slate-100 dark:border-slate-800">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalWorkDays}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Dias Trabalhados</div>
          </Card>
          <Card className="text-center p-3 border border-slate-100 dark:border-slate-800">
            <div className="text-xl font-black text-slate-700 dark:text-slate-300">{totalOffDays}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Dias de Folga</div>
          </Card>
          <Card className="text-center p-3 border border-slate-100 dark:border-slate-800">
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">{workedHolidaysCount}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Feriados 100%</div>
          </Card>
        </div>
      </div>

      {/* PRÓXIMOS EVENTOS DO CICLO */}
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> Próximos Eventos
          </span>
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Próxima Folga</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{formatDisplayDate(shiftInfo.nextOffDate)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Próximo Retorno ao Trabalho</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{formatDisplayDate(shiftInfo.nextWorkDate)}</span>
          </div>
        </div>
      </Card>

      {/* BANNER GERENCIÁVEL PELO PAINEL ADMIN (OCULTO SE NÃO HOUVER ANÚNCIO ATIVO) */}
      <CustomManagedBanner
        ad={ads.find((a) => a.active && (a.location === 'HOME' || !a.location))}
      />

      {/* BANNER GOOGLE ADMOB (OCULTO NA VERSÃO PWA, NATIVO APENAS NO APK ANDROID) */}
      <AdCard adUnitId="ca-app-pub-5140224476422289/9928490703" />

    </div>
  );
};

