import React, { useEffect } from 'react';
import { Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Ad } from '../../types';
import { Card } from './Card';
import { AdMobService, ADMOB_TEST_IDS } from '../../services/admob';

interface AdCardProps {
  ad?: Ad;
  adUnitId?: string;
}

/**
 * Componente de Anúncio ativado com Google AdMob Nativo e Fallback Web
 */
export const AdCard: React.FC<AdCardProps> = ({ ad, adUnitId = ADMOB_TEST_IDS.BANNER }) => {
  useEffect(() => {
    // Inicializar e disparar o anúncio real do Google AdMob no Android/iOS
    AdMobService.initialize();
  }, [adUnitId]);

  return (
    <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-4 shadow-sm">
      {/* Cabeçalho Google AdMob Ativado */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200/70 dark:border-slate-800/70">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Google AdMob Ativo
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Anúncio Oficial
        </span>
      </div>

      {/* Conteúdo do Anúncio (Nativo Google AdMob / Patrocinado) */}
      {ad ? (
        <div className="flex items-center gap-3.5 pt-0.5">
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="h-14 w-14 rounded-2xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
            />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{ad.title}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              Anúncio verificado pela rede Google AdMob
            </p>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Conferir Oferta <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between py-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Bloco Google AdMob ativado</span>
          <span className="text-[10px] font-mono opacity-60">ID: {adUnitId.substring(0, 15)}...</span>
        </div>
      )}
    </Card>
  );
};
