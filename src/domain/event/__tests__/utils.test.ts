import { OptionType } from '../../../types';
import { sortLanguage } from '../utils';

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
