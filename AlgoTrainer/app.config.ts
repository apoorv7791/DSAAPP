import type { ExpoConfig } from "expo/config";

/**
 * EAS Build does not read local `.env` on build workers unless variables are set as EAS Environment Variables
 * or EAS Secrets (see docs/RELEASE_ANDROID.md). `EXPO_PUBLIC_*` values are inlined at bundle time.
 */
const config: ExpoConfig = {
  name: "AlgoTrainer",
  slug: "AlgoTrainer",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/Algo.png",
  scheme: "algotrainer",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.apoorvsingh.AlgoTrainer",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/Algo.png",
      backgroundColor: "#E6F4FE",
    },
    predictiveBackGestureEnabled: false,
    package: "com.apoorvsingh.AlgoTrainer",
  },
  web: {
    output: "static",
    favicon: "./assets/images/Algo.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/Algo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-localization",
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "d030d009-29da-43d2-aa9d-58f7cad158e5",
    },
    backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL ?? "",
    /** Public HTTPS URL for Play Console + in-app "open in browser". Set EXPO_PUBLIC_PRIVACY_POLICY_URL in EAS. */
    privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? "",
    termsOfServiceUrl: process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL ?? "",
  },
};

export default config;
