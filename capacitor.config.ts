import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.europass.cveditor',
  appName: 'europass-cv-editor',
  webDir: 'dist',
  // BUNDLED offline APK - uses local dist. For LIVE wrapper, uncomment server block below:
  // server: { url: 'https://rbcking.dpdns.org', cleartext: false, androidScheme: 'https' },
};

export default config;
