import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'app-infile',
  webDir: 'dist',
  // Allow cleartext for local server connections
  server: {
    cleartext: true,
    androidScheme: 'http'
  },
  // Enable the native HTTP plugin
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SocialLogin: {
      providers: {
        google: true,      // true = enabled (bundled), false = disabled (not bundled)
        facebook: false,   // Use false to reduce app size
        apple: false,      // Apple uses system APIs, no external deps
        twitter: false   // false = disabled (not bundled)
      },
      logLevel: 1 // Warnings and errors only
    }
  },
};

export default config;
