export type FeatureFlags = {
  LOCALIZED_IMAGE: boolean;
  SHOW_ADMIN: boolean;
};

const getFeatureFlags = (): FeatureFlags => ({
  LOCALIZED_IMAGE: import.meta.env.REACT_APP_LOCALIZED_IMAGE === 'true',
  SHOW_ADMIN: import.meta.env.REACT_APP_SHOW_ADMIN === 'true',
});

const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];

export const featureFlagUtils = {
  isFeatureEnabled,
  getFeatureFlags,
};
