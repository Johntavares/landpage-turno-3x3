import React from 'react';
import { ExternalLink, Sparkles, MessageCircle } from 'lucide-react';
import type { Ad } from '../../types';
import { Card } from './Card';

interface CustomManagedBannerProps {
  ad?: Ad;
}

export const CustomManagedBanner: React.FC<CustomManagedBannerProps> = ({ ad }) => {
  const bannerAd: Ad = ad || {
    id: 'banner-daiana-timoteo',
    title: 'Daiana Timóteo - Agende sua Avaliação',
    imageUrl: '/banner-daiana-timoteo.png',
    link: 'https://wa.me/5594988026574?text=Ol%C3%A1!%20Vim%20pelo%20app%20Turno%203x3%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.',
    active: true,
    location: 'HOME',
    displayOrder: 1,
  };

  if (!bannerAd.active) {
    return null;
  }

  const { title, imageUrl, link } = bannerAd;
  const isWhatsApp = link?.includes('wa.me') || link?.includes('whatsapp.com');

  return (
    <Card className="relative overflow-hidden border border-purple-200/80 dark:border-purple-900/60 bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 p-2.5 sm:p-3.5 text-white shadow-xl group rounded-2xl">
      <a
        href={link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-xl group/link cursor-pointer"
      >
        {/* Banner principal enviado pelo cliente */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover rounded-xl shadow-md border border-white/10 transition-transform duration-300 group-hover/link:scale-[1.01]"
          />
        ) : (
          <div className="p-4 bg-purple-900/50 rounded-xl">
            <h4 className="font-extrabold text-sm text-white">{title}</h4>
          </div>
        )}

        {/* Rodapé interativo com chamada para o WhatsApp */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 text-purple-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="line-clamp-1">Daiana Timóteo • (94) 98802-6574</span>
          </div>

          <div className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer border border-emerald-400/30">
            {isWhatsApp ? (
              <>
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Agendar no WhatsApp</span>
              </>
            ) : (
              <>
                <span>Acessar Anúncio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </>
            )}
          </div>
        </div>
      </a>
    </Card>
  );
};
