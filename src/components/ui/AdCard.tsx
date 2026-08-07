import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import type { Ad } from '../../types';
import { Card } from './Card';
import { AdMobService, ADMOB_TEST_IDS } from '../../services/admob';
import { Capacitor } from '@capacitor/core';
import { useAppStore } from '../../stores/appStore';

interface AdCardProps {
  ad?: Ad;
  adUnitId?: string;
}

/**
 * Componente de Anúncio Híbrido:
 * 1. No APK Nativo (Android): Chama o SDK nativo do Google AdMob em tempo real.
 * 2. No PWA / Web Browser: Renderiza o anúncio gerenciável do Painel Admin ou bloco do Google AdSense.
 */
export const AdCard: React.FC<AdCardProps> = ({ adUnitId = ADMOB_TEST_IDS.BANNER }) => {
  const isNative = Capacitor.isNativePlatform();
  const { ads } = useAppStore();

  // Busca se existe um banner ativo configurado pelo Admin no painel
  const customAd = ads.find((a) => a.active && (a.location === 'HOME' || !a.location));

  useEffect(() => {
    if (isNative) {
      AdMobService.initialize();
      AdMobService.showBottomBanner(adUnitId);
    }
  }, [isNative, adUnitId]);

  return (
    <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-4 shadow-sm">
      {/* Cabeçalho Oficial de Identificação do Anúncio */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800/70">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          {isNative ? 'Google AdMob Nativo' : 'Rede de Anúncios Google / PWA'}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Parceiro Verificado
        </span>
      </div>

      {/* Conteúdo do Anúncio */}
      {customAd ? (
        <a
          href={customAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block space-y-2"
        >
          {customAd.imageUrl && (
            <img
              src={customAd.imageUrl}
              alt={customAd.title}
              className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:opacity-95 transition-opacity"
            />
          )}
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {customAd.title}
            </h4>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
          </div>
        </a>
      ) : (
        <div className="flex items-center justify-between py-1 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
              {isNative ? 'Espaço de Anúncio Google AdMob' : 'Google AdSense / Anúncio Web PWA'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isNative
                ? 'Anúncio veiculado em tempo real pelo SDK Nativo Android AdMob.'
                : 'Anúncios PWA ativos. Gerencie mídias no Painel Admin ou ative o Google AdSense.'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
