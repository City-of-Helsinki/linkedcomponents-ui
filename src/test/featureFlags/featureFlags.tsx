import * as FeatureFlags from '../../utils/featureFlags';

export const setFeatureFlags = (override: FeatureFlags.FeatureFlags): void => {
  jest.spyOn(FeatureFlags, 'getFeatureFlags').mockReturnValue(override);
  jest
    .spyOn(FeatureFlags, 'isFeatureEnabled')
    .mockImplementation((feature): boolean => override[feature]);
};
