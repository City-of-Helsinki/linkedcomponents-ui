import sanitizeElementId from '../sanitizeElementId';

test.each([
  ['menu-dropdown-r0', 'menu_dropdown_r0'],
  [
    'registrationUserAccesses[0].language',
    'registrationUserAccesses_0_language',
  ],
  [':r0:', 'r0'],
  ['---abc---', 'abc'],
  ['a__b', 'a_b'],
  ['a::b', 'a_b'],
  ['123-start', 'id_123_start'],
  ['---', 'id'],
])('should sanitize id, %s -> %s', (id, expectedId) => {
  expect(sanitizeElementId(id)).toBe(expectedId);
});

test('should return undefined as is', () => {
  expect(sanitizeElementId(undefined)).toBeUndefined();
});

test('should return null as is', () => {
  expect(sanitizeElementId(null)).toBeNull();
});
