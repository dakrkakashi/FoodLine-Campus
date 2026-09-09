import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodline.campus',
  appName: 'FoodLine Campus',
  webDir: 'public',
  server: {
    url: 'https://food-line-campus.vercel.app',
    cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#07070B',
  },
};

export default config;
