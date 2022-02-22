import { ROUTES } from '../../../constants';
import {
  KEYWORD_SET_SEARCH_PARAMS,
  KEYWORD_SET_SORT_OPTIONS,
} from '../constants';
import { KeywordSetSearchParam } from '../types';
import { getKeywordSetParamValue } from '../utils';

describe('getKeywordSetParamValue function', () => {
  it('should get page value', () => {
    expect(
      getKeywordSetParamValue({
        param: KEYWORD_SET_SEARCH_PARAMS.PAGE,
        value: '3',
      })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getKeywordSetParamValue({
        param: KEYWORD_SET_SEARCH_PARAMS.SORT,
        value: KEYWORD_SET_SORT_OPTIONS.ID,
      })
    ).toBe(KEYWORD_SET_SORT_OPTIONS.ID);
  });

  it('should get text value', () => {
    expect(
      getKeywordSetParamValue({
        param: KEYWORD_SET_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getKeywordSetParamValue({
        param: KEYWORD_SET_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.KEYWORD_SETS}`,
      })
    ).toBe(ROUTES.KEYWORD_SETS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getKeywordSetParamValue({
        param: 'unsupported' as KeywordSetSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
