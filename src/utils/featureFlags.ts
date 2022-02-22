export type FeatureFlags = {
  SHOW_ADMIN: boolean;
  SHOW_REGISTRATION: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  SHOW_ADMIN: process.env.REACT_APP_SHOW_ADMIN === 'true',
  SHOW_REGISTRATION: process.env.REACT_APP_SHOW_REGISTRATION === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
