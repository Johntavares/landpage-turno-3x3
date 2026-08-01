import React, { useState } from 'react';
import { Palmtree, Plus, Trash2, Calendar as CalendarIcon, Clock, Edit2 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import type { Vacation } from '../../types';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { differenceInDays, formatDateISO } from '../../services/schedule';

export const VacationView: React.FC = () => {
  const { vacations, addVacation, updateVacation, deleteVacation } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(formatDateISO(new Date()));
  const [endDate, setEndDate] = useState(formatDateISO(new Date()));
  const [note, setNote] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setStartDate(formatDateISO(new Date()));
    setEndDate(formatDateISO(new Date()));
    setNote('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vacation) => {
    setEditingId(v.id);
    setStartDate(v.startDate);
    setEndDate(v.endDate);
    setNote(v.note || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVacation(editingId, { startDate, endDate, note });
    } else {
      addVacation({ startDate, endDate, note });
    }
    setIsModalOpen(false);
  };

  const todayStr = formatDateISO(new Date());

  const calculateDaysCount = (start: string, end: string) => {
    const diff = differenceInDays(end, start);
    return Math.max(1, diff + 1);
  };

  const getVacationCountdown = (v: Vacation) => {
    if (todayStr < v.startDate) {
      const days = differenceInDays(v.startDate, todayStr);
      return { status: 'FUTURE', text: `Faltam ${days} ${days === 1 ? 'dia' : 'dias'} para iniciar` };
    } else if (todayStr >= v.startDate && todayStr <= v.endDate) {
      const remaining = differenceInDays(v.endDate, todayStr) + 1;
      return { status: 'ACTIVE', text: `Em férias! Faltam ${remaining} ${remaining === 1 ? 'dia' : 'dias'} para terminar` };
    } else {
      return { status: 'PAST', text: 'Férias concluídas' };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palmtree className="h-6 w-6 text-cyan-500" /> Minhas Férias
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cadastre e acompanhe seus períodos de descanso.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:bg-cyan-700 transition-colors active:scale-95"
        >
          <Plus className="h-4 w-4" /> Nova Férias
        </button>
      </div>

      {vacations.length === 0 ? (
        <Card className="text-center py-10 px-4">
          <Palmtree className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Nenhuma férias cadastrada</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
            Clique no botão acima para adicionar seu próximo período de férias.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {vacations.map((v) => {
            const daysCount = calculateDaysCount(v.startDate, v.endDate);
            const countdown = getVacationCountdown(v);

            return (
              <Card key={v.id} className="relative overflow-hidden border-l-4 border-l-cyan-500">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <CalendarIcon className="h-4 w-4 text-cyan-600" />
                      <span>
                        {v.startDate.split('-').reverse().join('/')} até {v.endDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {daysCount} {daysCount === 1 ? 'Dia de Férias' : 'Dias de Férias'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteVacation(v.id)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {v.note && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    {v.note}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{countdown.text}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Férias' : 'Cadastrar Férias'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Data de Início
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Data de Término
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Observação (Opcional)
            </label>
            <input
              type="text"
              placeholder="ex: Viagem em família"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-bold text-white shadow-md shadow-cyan-500/20 hover:bg-cyan-700 transition-colors"
          >
            Salvar Férias
          </button>
        </form>
      </Modal>
    </div>
  );
};
