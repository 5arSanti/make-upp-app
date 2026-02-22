import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.mobilet3.app",
  appName: "mobile-ionic-t3",
  webDir: "dist",
  android: {
    buildOptions: {
      keystoreAlias: "mobile-ionic-t3",
      keystoreAliasPassword: "mobile-ionic-t3",
      keystorePassword: "mobile-ionic-t3",
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: false,
    },
  },
};

export default config;
