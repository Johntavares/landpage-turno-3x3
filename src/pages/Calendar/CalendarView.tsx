import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Palmtree, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/appStore';
import { calculateScheduleDay, formatDateISO } from '../../services/schedule';
import type { CalculatedDay } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BottomSheet } from '../../components/ui/BottomSheet';

export const CalendarView: React.FC = () => {
  const { user } = useAuthStore();
  const { vacations, allHolidays } = useAppStore();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<CalculatedDay | null>(null);

  if (!user) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (CalculatedDay | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const calculated = calculateScheduleDay(dateStr, user.team, user.baseDate, vacations, allHolidays);
    calendarCells.push(calculated);
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const todayStr = formatDateISO(new Date());

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Card className="flex items-center justify-between p-3.5">
        <button
          onClick={handlePrevMonth}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
            {monthNames[month]} {year}
          </h2>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Escala Equipe {user.team}
          </p>
        </div>
        <button
          onClick={handleNextMonth}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </Card>

      <div className="flex items-center justify-around px-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Trabalho</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Folga</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" /> Feriado</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500 inline-block" /> Férias</span>
      </div>

      <Card className="p-3">
        <div className="grid grid-cols-7 text-center mb-2">
          {weekDays.map((wd) => (
            <div key={wd} className="text-xs font-bold text-slate-400 dark:text-slate-500 py-1">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-13 rounded-xl" />;
            }

            const isToday = cell.date === todayStr;
            const dayNum = parseInt(cell.date.split('-')[2], 10);

            let bgClass = 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-transparent';
            let badgeDot = null;

            if (cell.status === 'WORK') {
              bgClass = 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border-emerald-500/20';
              badgeDot = <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />;
            } else if (cell.status === 'VACATION') {
              bgClass = 'bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 border-cyan-500/30';
              badgeDot = <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />;
            } else {
              badgeDot = <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />;
            }

            return (
              <button
                key={cell.date}
                onClick={() => setSelectedDay(cell)}
                className={`relative flex flex-col items-center justify-between h-13 p-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 hover:shadow-xs ${bgClass} ${
                  isToday ? 'ring-2 ring-blue-600 font-extrabold shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={isToday ? 'text-blue-600 dark:text-blue-400' : ''}>{dayNum}</span>
                  {cell.holiday && (
                    <span className="h-2 w-2 rounded-full bg-amber-500" title={cell.holiday.name} />
                  )}
                </div>

                <div className="flex items-center gap-1 mb-0.5">
                  {badgeDot}
                  <span className="text-[10px] opacity-75">
                    {cell.status === 'WORK' ? `T${cell.cycleDay}` : cell.status === 'OFF' ? `F${cell.cycleDay}` : 'Férias'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <BottomSheet
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? `Detalhes de ${selectedDay.date.split('-').reverse().join('/')}` : ''}
      >
        {selectedDay && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Situação</span>
              <Badge
                variant={
                  selectedDay.status === 'WORK'
                    ? 'work'
                    : selectedDay.status === 'VACATION'
                    ? 'vacation'
                    : 'off'
                }
              >
                {selectedDay.status === 'WORK' && `🟢 ${selectedDay.cycleDay}º Dia de Trabalho`}
                {selectedDay.status === 'OFF' && `⚪ ${selectedDay.cycleDay}º Dia de Folga`}
                {selectedDay.status === 'VACATION' && '🏖️ Período de Férias'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Equipe</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Equipe {selectedDay.team}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Turno</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedDay.shift === 'DAY' ? 'Dia (07h às 19h)' : 'Noite (19h às 07h)'}
                </span>
              </div>
            </div>

            {selectedDay.holiday && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Feriado: {selectedDay.holiday.name}</span>
                </div>
                {selectedDay.isHolidayWork ? (
                  <p className="font-bold text-amber-700 dark:text-amber-300">
                    ⚡ Este feriado cai no seu dia de trabalho! Pagamento com 100% de adicional.
                  </p>
                ) : (
                  <p className="opacity-80">Você estará de folga neste feriado.</p>
                )}
              </div>
            )}

            {selectedDay.isVacation && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 text-xs flex items-center gap-2">
                <Palmtree className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Dia de folga remunerada/férias ativas programadas.</span>
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
