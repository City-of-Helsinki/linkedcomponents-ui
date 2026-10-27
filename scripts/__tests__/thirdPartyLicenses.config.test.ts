import { describe, expect, it } from 'vitest';

import { thirdPartyLicensesConfig } from '../thirdPartyLicenses.config.mts';

describe('thirdPartyLicensesConfig', () => {
  // The decisions are the part of the notices that a reader cannot verify
  // from the bundle alone, so losing one has to fail a test.
  it('elects Apache-2.0 for the dual-licensed dompurify', () => {
    const decision = thirdPartyLicensesConfig.licenseDecisions?.dompurify;

    expect(decision?.license).toBe('Apache-2.0');
    expect(decision?.note).toContain('(MPL-2.0 OR Apache-2.0)');
  });

  it.each(['ckeditor5', '@ckeditor/*'])(
    'names GPL-2.0-or-later for %s, which declares no SPDX license',
    (key) => {
      const decision = thirdPartyLicensesConfig.licenseDecisions?.[key];

      expect(decision?.license).toBe('GPL-2.0-or-later');
      expect(decision?.declared).toBe('SEE LICENSE IN LICENSE.md');
    }
  );
});
