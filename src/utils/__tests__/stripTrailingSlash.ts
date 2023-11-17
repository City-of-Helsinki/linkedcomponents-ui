import stripTrailingSlash from '../stripTrailingSlash';

test('should string trailing dash if needed', () => {
  expect(stripTrailingSlash('https://test.com')).toBe('https://test.com');
  expect(stripTrailingSlash('https://test.com/')).toBe('https://test.com');
});
