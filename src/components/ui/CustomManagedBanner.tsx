import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { Ad } from '../../types';
import { Card } from './Card';

interface CustomManagedBannerProps {
  ad?: Ad;
  fallbackTitle?: string;
  fallbackImage?: string;
  fallbackLink?: string;
}

export const CustomManagedBanner: React.FC<CustomManagedBannerProps> = ({
  ad,
  fallbackTitle = 'Banner Promocional Gerenciado',
  fallbackImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
  fallbackLink = 'https://turno3x3.app',
}) => {
  const title = ad?.title || fallbackTitle;
  const image = ad?.imageUrl || fallbackImage;
  const link = ad?.link || fallbackLink;

  return (
    <Card className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-900/90 via-slate-900 to-indigo-950 p-4 text-white shadow-xl group">
      {/* Imagem de Fundo com Blur sutil */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={image}
            alt={title}
            className="h-14 w-14 rounded-2xl object-cover shadow-lg border border-white/20 shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider mb-1 border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" /> Banner Oficial
            </div>
            <h4 className="font-extrabold text-sm text-white line-clamp-1">{title}</h4>
            <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
              Anúncio gerenciado pelo painel administrativo
            </p>
          </div>
        </div>

        {link && link !== '#' && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Acessar <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </Card>
  );
};
