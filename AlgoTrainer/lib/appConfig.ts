import Constants from "expo-constants";

type ExtraUrlKey = "backendUrl" | "privacyPolicyUrl" | "termsOfServiceUrl";

function readExtra(key: ExtraUrlKey): string | undefined {
  const raw = Constants.expoConfig?.extra?.[key];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeUrl(value: string): string {
  return value.replace(/\/$/, "");
}

export function getBackendUrl(): string | undefined {
  const value = readExtra("backendUrl");
  return value ? normalizeUrl(value) : undefined;
}

export function getPrivacyPolicyUrl(): string | undefined {
  const value = readExtra("privacyPolicyUrl");
  return value ? normalizeUrl(value) : undefined;
}

export function getTermsOfServiceUrl(): string | undefined {
  const value = readExtra("termsOfServiceUrl");
  return value ? normalizeUrl(value) : undefined;
}
