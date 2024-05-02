export type FeatureFlags = {
  LOCALIZED_IMAGE: boolean;
  SHOW_ADMIN: boolean;
  SHOW_PLACE_PAGES: boolean;
  SWEDISH_TRANSLATIONS: boolean;
  WEB_STORE_INTEGRATION: boolean;
};

const getFeatureFlags = (): FeatureFlags => ({
  LOCALIZED_IMAGE: import.meta.env.REACT_APP_LOCALIZED_IMAGE === 'true',
  SHOW_ADMIN: import.meta.env.REACT_APP_SHOW_ADMIN === 'true',
  SHOW_PLACE_PAGES: import.meta.env.REACT_APP_SHOW_PLACE_PAGES === 'true',
  SWEDISH_TRANSLATIONS:
    import.meta.env.REACT_APP_ENABLE_SWEDISH_TRANSLATIONS === 'true',
  WEB_STORE_INTEGRATION:
    import.meta.env.REACT_APP_WEB_STORE_INTEGRATION_ENABLED === 'true',
});

const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];

export const featureFlagUtils = {
  isFeatureEnabled,
  getFeatureFlags,
};
