import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.turno3x3.app',
  appName: 'Turno 3x3',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-5140224476422289~4759924503',
      testingDevices: ['EMULATOR'],
    },
  },
};

export default config;
