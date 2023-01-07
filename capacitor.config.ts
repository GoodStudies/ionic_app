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
  },
  server: {
      hostname: "localhost:8100",
      androidScheme: "http"
    }
};

export default config;
