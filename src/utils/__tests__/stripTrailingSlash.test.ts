import stripTrailingSlash from '../stripTrailingSlash';

test.each([
  ['https://test.com', 'https://test.com'],
  ['https://test.com/', 'https://test.com'],
  ['https://test.com/route', 'https://test.com/route'],
  ['https://test.com/route/', 'https://test.com/route'],
])('should strip trailing slash, %s -> %s', (url, strippedUrl) => {
  expect(stripTrailingSlash(url)).toBe(strippedUrl);
});
