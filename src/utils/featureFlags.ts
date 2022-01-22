export type FeatureFlags = {
  SHOW_KEYWORD: boolean;
  SHOW_REGISTRATION: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  SHOW_KEYWORD: process.env.REACT_APP_SHOW_KEYWORD === 'true',
  SHOW_REGISTRATION: process.env.REACT_APP_SHOW_REGISTRATION === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
