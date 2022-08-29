import addParamsToQueryString from '../addParamsToQueryString';

describe('addParamsToQueryString function', () => {
  const cases: [{ [key: string]: unknown }, string][] = [
    [
      { eventType: ['general', 'volunteering'] },
      '?eventType=general&eventType=volunteering',
    ],
    [{ page: 3 }, '?page=3'],
    [{ returnPath: `/fi/registrations` }, '?returnPath=%2Ffi%2Fregistrations'],
    [{ text: 'search' }, '?text=search'],
  ];

  it.each(cases)(
    'should add %p params to search, returns %p',
    (params, expectedResult) => {
      expect(addParamsToQueryString('', params)).toBe(expectedResult);
    }
  );
});
