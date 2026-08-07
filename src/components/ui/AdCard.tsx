import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import type { Ad } from '../../types';
import { Card } from './Card';
import { AdMobService, ADMOB_TEST_IDS } from '../../services/admob';
import { Capacitor } from '@capacitor/core';

interface AdCardProps {
  ad?: Ad;
  adUnitId?: string;
}

/**
 * Componente de Anúncio oficial Google AdMob (Nativo no Android/APK e com identificação oficial no Web)
 */
export const AdCard: React.FC<AdCardProps> = ({ adUnitId = ADMOB_TEST_IDS.BANNER }) => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      AdMobService.initialize();
    }
  }, [isNative, adUnitId]);

  return (
    <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-4 shadow-sm">
      {/* Cabeçalho Google AdMob Oficial */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800/70">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Google AdMob {isNative ? 'Nativo' : 'Configurado'}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Rede Oficial
        </span>
      </div>

      {/* Bloco de Anúncio AdMob */}
      <div className="flex items-center justify-between py-1 text-xs text-slate-600 dark:text-slate-300">
        <div>
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Espaço de Anúncio Google AdMob</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isNative
              ? 'Anúncio oficial renderizado em tempo real pelo SDK Android AdMob.'
              : `Bloco configurado • ID: ${adUnitId}`}
          </p>
        </div>
      </div>
    </Card>
  );
};

