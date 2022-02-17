import { ROUTES } from '../../../constants';
import {
  ORGANIZATION_SEARCH_PARAMS,
  ORGANIZATION_SORT_OPTIONS,
} from '../constants';
import { OrganizationSearchParam } from '../types';
import { getOrganizationParamValue } from '../utils';

describe('getOrganizationParamValue function', () => {
  it('should get sort value', () => {
    expect(
      getOrganizationParamValue({
        param: ORGANIZATION_SEARCH_PARAMS.SORT,
        value: ORGANIZATION_SORT_OPTIONS.ID,
      })
    ).toBe(ORGANIZATION_SORT_OPTIONS.ID);
  });

  it('should get text value', () => {
    expect(
      getOrganizationParamValue({
        param: ORGANIZATION_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getOrganizationParamValue({
        param: ORGANIZATION_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.ORGANIZATIONS}`,
      })
    ).toBe(ROUTES.ORGANIZATIONS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getOrganizationParamValue({
        param: 'unsupported' as OrganizationSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
