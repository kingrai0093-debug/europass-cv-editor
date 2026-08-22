import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.europass.cveditor',
  appName: 'europass-cv-editor',
  webDir: 'dist',
  // BUNDLED offline APK - uses local dist.
  server: {
    url: 'https://kingrai0093-debug.github.io/europass-cv-editor/',
    cleartext: true,
  }
};

export default config;
