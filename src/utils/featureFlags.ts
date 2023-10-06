export type FeatureFlags = {
  LOCALIZED_IMAGE: boolean;
  SHOW_ADMIN: boolean;
  SHOW_REGISTRATION: boolean;
};

const getFeatureFlags = (): FeatureFlags => ({
  LOCALIZED_IMAGE: import.meta.env.VITE_LOCALIZED_IMAGE === 'true',
  SHOW_ADMIN: import.meta.env.VITE_SHOW_ADMIN === 'true',
  SHOW_REGISTRATION: import.meta.env.VITE_SHOW_REGISTRATION === 'true',
});

const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];

export const featureFlagUtils = {
  isFeatureEnabled,
  getFeatureFlags,
};
