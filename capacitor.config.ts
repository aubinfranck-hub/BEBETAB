import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bebetab.world",
  appName: "BEBETAB WORLD",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
