import removeProtocolFromUrl from '../removeProtocolFromUrl';

const cases = [
  ['http://testurl.com', 'testurl.com'],
  ['https://testurl.com', 'testurl.com'],
  ['http://www.testurl.com', 'testurl.com'],
  ['https://www.testurl.com', 'testurl.com'],
  ['www.testurl.com', 'testurl.com'],
];

it.each(cases)(
  'should return %p without protocol, returns %p',
  (url, expectedResult) =>
    expect(removeProtocolFromUrl(url)).toBe(expectedResult)
);
