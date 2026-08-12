import React from 'react';
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

  const whatsappLink =
    'https://wa.me/5594988026574?text=Ol%C3%A1!%20Vim%20pelo%20app%20Turno%203x3%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.';

  return (
    <div className="w-full my-3">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.99] border border-purple-300/80 dark:border-purple-800/60 cursor-pointer group bg-[#F0E6F6]"
        title="Daiana Timóteo - Estética Facial (Agendar no WhatsApp)"
      >
        <img
          src={imageUrl}
          alt="Daiana Timóteo - Estética Facial"
          className="w-full h-auto object-cover rounded-2xl block group-hover:opacity-95 transition-opacity"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </a>
    </div>
  );
};
