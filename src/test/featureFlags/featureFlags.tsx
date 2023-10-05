import { FeatureFlags, featureFlagUtils } from '../../utils/featureFlags';

export const setFeatureFlags = (override: FeatureFlags): void => {
  featureFlagUtils.getFeatureFlags = jest.fn().mockReturnValue(override);
  featureFlagUtils.isFeatureEnabled = jest
    .fn()
    .mockImplementation(
      (feature): boolean => override[feature as keyof FeatureFlags]
    );
};
