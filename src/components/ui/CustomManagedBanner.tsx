import React from 'react';
import type { Ad } from '../../types';

interface CustomManagedBannerProps {
  ad?: Ad;
}

export const CustomManagedBanner: React.FC<CustomManagedBannerProps> = ({ ad }) => {
  // Imagem enviada pelo usuário e link oculto direto para o WhatsApp (94) 98802-6574
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
        className="block relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.99] border border-purple-200 dark:border-purple-900/60 cursor-pointer group bg-purple-50 dark:bg-slate-900"
        title="Daiana Timóteo - Estética Facial (WhatsApp)"
      >
        <img
          src={imageUrl}
          alt="Daiana Timóteo - Estética Facial"
          className="w-full h-auto min-h-[100px] object-contain rounded-2xl block group-hover:opacity-95 transition-opacity"
        />
      </a>
    </div>
  );
};
