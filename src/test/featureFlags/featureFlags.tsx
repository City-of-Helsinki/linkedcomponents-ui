import { FeatureFlags, featureFlagUtils } from '../../utils/featureFlags';

export const setFeatureFlags = (override: FeatureFlags): void => {
  featureFlagUtils.getFeatureFlags = vi.fn().mockReturnValue(override);
  featureFlagUtils.isFeatureEnabled = vi
    .fn()
    .mockImplementation(
      (feature): boolean => override[feature as keyof FeatureFlags]
    );
};
