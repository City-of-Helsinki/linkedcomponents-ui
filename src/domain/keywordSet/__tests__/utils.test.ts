import { fakeKeyword } from '../../../utils/mockDataUtils';
import {
  getKeywordOption,
  keywordSetPathBuilder,
  keywordSetsPathBuilder,
} from '../utils';

describe('getKeywordOption function', () => {
  it('should return correct option', () => {
    expect(
      getKeywordOption({
        keyword: fakeKeyword({ id: 'keyword:1', name: { fi: 'Keyword name' } }),
        locale: 'fi',
      })
    ).toEqual({
      label: 'Keyword name',
      value: 'https://api.hel.fi/linkedevents-test/v1/keyword/keyword:1/',
    });
  });

  it('should return empty option if keyword is null', () => {
    expect(getKeywordOption({ keyword: null, locale: 'fi' })).toEqual({
      label: '',
      value: '',
    });
  });
});

describe('keywordSetPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      keywordSetPathBuilder({
        args: { id: 'hel:123', include: ['include1', 'include2'] },
      })
    ).toBe('/keyword_set/hel:123/?include=include1,include2');
  });
});

describe('keywordSetsPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      keywordSetsPathBuilder({
        args: { include: ['include1', 'include2'] },
      })
    ).toBe('/keyword_set/?include=include1,include2');
  });
});
