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
    <div className="w-full my-3">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.99] border border-purple-200/60 dark:border-purple-900/40 cursor-pointer group"
        title="Daiana Timóteo - Agende sua Avaliação (WhatsApp)"
      >
        <img
          src={imageUrl}
          alt="Daiana Timóteo - Agende sua Avaliação"
          className="w-full h-auto object-cover rounded-2xl block group-hover:opacity-95 transition-opacity"
        />
      </a>
    </div>
  );
};
