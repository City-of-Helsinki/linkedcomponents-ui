export type FeatureFlags = {
  SHOW_REGISTRATION: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  SHOW_REGISTRATION: process.env.BROWSER_TESTS_SHOW_REGISTRATION === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
