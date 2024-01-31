export type FeatureFlags = {
  LOCALIZED_IMAGE: boolean;
  SHOW_ADMIN: boolean;
  WEB_STORE_INTEGRATION: boolean;
};

const getFeatureFlags = (): FeatureFlags => ({
  LOCALIZED_IMAGE: import.meta.env.REACT_APP_LOCALIZED_IMAGE === 'true',
  SHOW_ADMIN: import.meta.env.REACT_APP_SHOW_ADMIN === 'true',
  WEB_STORE_INTEGRATION:
    import.meta.env.REACT_APP_WEB_STORE_INTEGRATION_ENABLED === 'true',
});

const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];

export const featureFlagUtils = {
  isFeatureEnabled,
  getFeatureFlags,
};
