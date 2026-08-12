/**
 * Utilitário oficial de compartilhamento do aplicativo Turno 3x3
 */
export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareApp(options?: ShareOptions): Promise<{ success: boolean; method: 'native' | 'whatsapp' | 'clipboard' }> {
  const shareData = {
    title: options?.title || 'Turno 3x3 🗓️',
    text: options?.text || 'Confira e acompanhe a sua escala de trabalho 3x3, folgas e plantões no app Turno 3x3!',
    url: options?.url || 'https://turno3x3.jw.tec.br',
  };

  // 1. Tentar a Web Share API Nativa (Navegadores Mobile, Android, iOS, PWA)
  if (navigator.share && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  // 2. Fallback: Copiar o link para a área de transferência
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      return { success: true, method: 'clipboard' };
    }
  } catch {}

  // 3. Fallback Direto WhatsApp
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return { success: true, method: 'whatsapp' };
}
