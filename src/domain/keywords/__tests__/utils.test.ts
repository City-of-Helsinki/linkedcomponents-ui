import { ROUTES } from '../../../constants';
import { KEYWORD_SEARCH_PARAMS, KEYWORD_SORT_OPTIONS } from '../constants';
import { KeywordSearchParam } from '../types';
import { getKeywordParamValue } from '../utils';

describe('getKeywordParamValue function', () => {
  it('should get page value', () => {
    expect(
      getKeywordParamValue({
        param: KEYWORD_SEARCH_PARAMS.PAGE,
        value: '3',
      })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getKeywordParamValue({
        param: KEYWORD_SEARCH_PARAMS.SORT,
        value: KEYWORD_SORT_OPTIONS.ID,
      })
    ).toBe(KEYWORD_SORT_OPTIONS.ID);
  });

  it('should get text value', () => {
    expect(
      getKeywordParamValue({
        param: KEYWORD_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getKeywordParamValue({
        param: KEYWORD_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.KEYWORDS}`,
      })
    ).toBe(ROUTES.KEYWORDS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getKeywordParamValue({
        param: 'unsupported' as KeywordSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
