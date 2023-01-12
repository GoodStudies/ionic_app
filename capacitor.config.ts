import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "goodstudies_ionic",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: "Library/CapacitorDatabase",
    },
    SplashScreen: {
    //   launchShowDuration: 2000,
      launchAutoHide: false,
    //   backgroundColor: "#ffffffff",
    //   androidSplashResourceName: "splash",
    //   androidScaleType: "CENTER",
    //   androidSpinnerStyle: "large",
    //   iosSpinnerStyle: "small",
    //   spinnerColor: "#999999",
    //   splashFullScreen: true,
    //   splashImmersive: true,
    //   layoutName: "launch_screen",
    },
  },
  server: {
    hostname: "localhost:8100",
    androidScheme: "http",
  },
};

export default config;
