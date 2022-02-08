export type FeatureFlags = {
  SHOW_ADMIN: boolean;
  SHOW_REGISTRATION: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  SHOW_ADMIN: process.env.BROWSER_TESTS_SHOW_ADMIN === 'true',
  SHOW_REGISTRATION: process.env.BROWSER_TESTS_SHOW_REGISTRATION === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
