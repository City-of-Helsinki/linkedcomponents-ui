import updateLocaleParam from '../updateLocaleParam';

test('should update locale param', () => {
  expect(updateLocaleParam('/fi', 'fi', 'sv')).toBe('/sv');
  expect(updateLocaleParam('/fi/', 'fi', 'sv')).toBe('/sv/');
  expect(updateLocaleParam('/fi/test', 'fi', 'sv')).toBe('/sv/test');
});
