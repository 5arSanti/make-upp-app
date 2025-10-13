import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.makeupp.app",
  appName: "make-upp",
  webDir: "dist",
  android: {
    buildOptions: {
      keystoreAlias: "make-upp",
      keystoreAliasPassword: "make-upp",
      keystorePassword: "make-upp",
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFE3F3",
      showSpinner: false,
    },
  },
};

export default config;
