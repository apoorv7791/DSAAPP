import Constants from 'expo-constants';

function readExtra(key: 'privacyPolicyUrl' | 'termsOfServiceUrl'): string | undefined {
  const raw = Constants.expoConfig?.extra?.[key];
  if (typeof raw !== 'string') return undefined;
  const t = raw.trim();
  return t.length > 0 ? t : undefined;
}

export function getPrivacyPolicyUrl(): string | undefined {
  return readExtra('privacyPolicyUrl');
}

export function getTermsOfServiceUrl(): string | undefined {
  return readExtra('termsOfServiceUrl');
}
