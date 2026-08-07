import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

// Purga forçada de anúncios legados de teste no localStorage

try {
  const adsData = localStorage.getItem('turno3x3_managed_ads');
  if (
    adsData &&
    (adsData.includes('Equipamentos') ||
      adsData.includes('banner-home-default') ||
      adsData.includes('banner-profile-default') ||
      adsData.includes('unsplash.com') ||
      adsData.includes('daiana-timoteo'))
  ) {
    localStorage.removeItem('turno3x3_managed_ads');
  }
} catch (e) {}


createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

