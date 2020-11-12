import { keywordSetPathBuilder, keywordSetsPathBuilder } from '../utils';

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
