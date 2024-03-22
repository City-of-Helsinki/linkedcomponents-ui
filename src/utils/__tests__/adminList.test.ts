import { ADMIN_LIST_SEARCH_PARAMS, ROUTES } from '../../constants';
import { AdminListSearchParam } from '../../types';
import { getAdminListParamValue } from '../adminListQueryStringUtils';

describe('getKeywordSetParamValue function', () => {
  it('should get page value', () => {
    expect(
      getAdminListParamValue({
        param: ADMIN_LIST_SEARCH_PARAMS.PAGE,
        value: '3',
      })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getAdminListParamValue({
        param: ADMIN_LIST_SEARCH_PARAMS.SORT,
        value: 'id',
      })
    ).toBe('id');
  });

  it('should get text value', () => {
    expect(
      getAdminListParamValue({
        param: ADMIN_LIST_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getAdminListParamValue({
        param: ADMIN_LIST_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.KEYWORD_SETS}`,
      })
    ).toBe(ROUTES.KEYWORD_SETS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getAdminListParamValue({
        param: 'unsupported' as AdminListSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
