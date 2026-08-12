import React from 'react';
import { MessageCircle, MapPin, Phone, Sparkles } from 'lucide-react';
import type { Ad } from '../../types';

interface CustomManagedBannerProps {
  ad?: Ad;
}

export const CustomManagedBanner: React.FC<CustomManagedBannerProps> = ({ ad }) => {
  const rawImage = ad?.imageUrl;
  const imageUrl =
    rawImage && !rawImage.includes('github') && !rawImage.includes('unsplash')
      ? rawImage
      : '/banner-daiana-timoteo.png';

  const whatsappLink = 'https://wa.me/5594988026574';

  return (
    <div className="w-full my-4">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.99] border-2 border-purple-400/50 dark:border-purple-600/60 cursor-pointer group bg-slate-900 p-1"
        title="Daiana Timóteo - Estética Facial (WhatsApp)"
      >
        {/* Banner com a imagem enviada pelo cliente (sem letterbox escuro) */}
        <div className="relative w-full overflow-hidden rounded-xl bg-purple-100">
          <img
            src={imageUrl}
            alt="Daiana Timóteo - Estética Facial"
            className="w-full h-auto object-cover rounded-xl block group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>

        {/* Informações em Alta Resolução Legíveis para Celulares */}
        <div className="p-3 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 rounded-xl mt-1 border border-purple-500/30 text-white flex flex-col gap-2.5">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-black tracking-wide text-purple-200 uppercase">
                Daiana Timóteo • Estética Facial
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
              AGENDE SUA AVALIAÇÃO
            </span>
          </div>

          {/* Serviços Principais */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-200">
            <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg border border-purple-400/30">
              ✨ Limpeza de Pele
            </span>
            <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg border border-purple-400/30">
              💆 Microagulhamento
            </span>
            <span className="bg-purple-900/60 px-2 py-0.5 rounded-lg border border-purple-400/30">
              🌸 Melasma
            </span>
          </div>

          {/* Rodapé: Contato + Localização + Botão WhatsApp */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-500/20">
            <div className="flex flex-col text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 font-black text-white text-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> (94) 98802-6574
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <MapPin className="w-3 h-3 text-purple-400" /> Parauapebas - PA
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all border border-emerald-400/40">
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Falar no Whats</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
