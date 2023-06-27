import { languagesPathBuilder } from '../utils';

describe('languagesPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      languagesPathBuilder({
        args: { serviceLanguage: true },
      })
    ).toBe('/language/?service_language=true');
    expect(
      languagesPathBuilder({
        args: { serviceLanguage: false },
      })
    ).toBe('/language/?service_language=false');
  });
});
