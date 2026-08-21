import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.europass.cveditor',
  appName: 'europass-cv-editor',
  webDir: 'dist',
  // LIVE APK: loads https://rbcking.dpdns.org directly (always latest, no rebuild).
  // Bundled APK: comment out `server` block to use local dist (offline).
  server: {
    url: 'https://rbcking.dpdns.org',
    cleartext: false,
    androidScheme: 'https',
  },
};

export default config;
