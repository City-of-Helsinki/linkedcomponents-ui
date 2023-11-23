export type FeatureFlags = {
  SHOW_ADMIN: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  SHOW_ADMIN: process.env.BROWSER_TESTS_SHOW_ADMIN === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
