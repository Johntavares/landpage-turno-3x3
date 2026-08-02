import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// IDs Oficiais do Google AdMob para Android (Turno 3x3)
export const ADMOB_TEST_IDS = {
  APP_ID: 'ca-app-pub-5140224476422289~4759924503',
  BANNER: 'ca-app-pub-5140224476422289/9928490703',
  INTERSTITIAL: 'ca-app-pub-5140224476422289/9928490703', // Atualize este ID quando criar o bloco Intersticial
};

export class AdMobService {
  private static isInitialized = false;

  /**
   * Inicializa o Google AdMob no aplicativo nativo (Android/iOS)
   */
  static async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('[AdMob] Plataforma Web/Browser - Modo de simulação de anúncios ativo.');
      return;
    }

    if (this.isInitialized) return;

    try {
      await AdMob.initialize({
        initializeForTesting: false,
      });

      // Registrar escuta de eventos
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        console.log('[AdMob] Banner de anúncio carregado com sucesso!');
      });

      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        console.warn('[AdMob] Falha ao carregar banner:', err);
      });

      this.isInitialized = true;
      console.log('[AdMob] Google AdMob SDK inicializado com sucesso.');
    } catch (err) {
      console.error('[AdMob] Erro ao inicializar SDK AdMob:', err);
    }
  }

  /**
   * Exibe Banner de Anúncio no Rodapé
   */
  static async showBottomBanner(adUnitId: string = ADMOB_TEST_IDS.BANNER): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await this.initialize();
      await AdMob.showBanner({
        adId: adUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 60, // Espaço para não cobrir a barra de navegação inferior
        isTesting: false,
      });
    } catch (err) {
      console.warn('[AdMob] Erro ao exibir banner:', err);
    }
  }

  /**
   * Ocultar Banner de Anúncio
   */
  static async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.hideBanner();
    } catch (err) {
      console.warn('[AdMob] Erro ao ocultar banner:', err);
    }
  }

  /**
   * Carregar e exibir Anúncio Intersticial (Tela Cheia)
   */
  static async showInterstitial(adUnitId: string = ADMOB_TEST_IDS.INTERSTITIAL): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await this.initialize();
      await AdMob.prepareInterstitial({
        adId: adUnitId,
        isTesting: false,
      });
      await AdMob.showInterstitial();
    } catch (err) {
      console.warn('[AdMob] Erro ao exibir anúncio intersticial:', err);
    }
  }
}
