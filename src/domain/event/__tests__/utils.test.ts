import { eventPathBuilder, sortLanguage } from '../utils';

describe('eventPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      eventPathBuilder({
        args: { id: 'hel:123', include: ['include1', 'include2'] },
      })
    ).toBe('/event/hel:123/?include=include1,include2');
  });
});

describe('sortLanguage function', () => {
  it('should sort languages correctly', () => {
    const en = {
      label: 'Englanti',
      value: 'en',
    };
    const fi = {
      label: 'Suomi',
      value: 'fi',
    };
    const ru = {
      label: 'Venäjä',
      value: 'ru',
    };
    const sv = {
      label: 'Ruotsi',
      value: 'sv',
    };
    expect([ru, en, sv, fi].sort(sortLanguage)).toEqual([fi, sv, en, ru]);
  });
});
