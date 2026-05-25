export type FeatureFlags = {
  SHOW_ADMIN: boolean;
  SHOW_PLACE_PAGES: boolean;
  SWEDISH_TRANSLATIONS: boolean;
  WEB_STORE_INTEGRATION: boolean;
};

const env = import.meta.env ?? process.env;

const getFeatureFlags = (): FeatureFlags => ({
  SHOW_ADMIN: env.REACT_APP_SHOW_ADMIN === 'true',
  SHOW_PLACE_PAGES: env.REACT_APP_SHOW_PLACE_PAGES === 'true',
  SWEDISH_TRANSLATIONS: env.REACT_APP_ENABLE_SWEDISH_TRANSLATIONS === 'true',
  WEB_STORE_INTEGRATION: env.REACT_APP_WEB_STORE_INTEGRATION_ENABLED === 'true',
});

const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];

export const featureFlagUtils = {
  isFeatureEnabled,
  getFeatureFlags,
};
