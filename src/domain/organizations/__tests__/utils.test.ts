import { vi } from 'vitest';

import { ROUTES } from '../../../constants';
import { waitReducerToBeCalled } from '../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import {
  ExpandedOrganizationsActionTypes,
  ORGANIZATION_SEARCH_PARAMS,
  ORGANIZATION_SORT_OPTIONS,
} from '../constants';
import { OrganizationSearchParam } from '../types';
import {
  addExpandedOrganization,
  getOrganizationParamValue,
  removeExpandedOrganization,
} from '../utils';

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

describe('addExpandedOrganization function', () => {
  it('should call reducer correcly', async () => {
    const dispatchExpandedOrganizationsState = vi.fn();
    const id = TEST_PUBLISHER_ID;

    addExpandedOrganization({ dispatchExpandedOrganizationsState, id });

    await waitReducerToBeCalled(dispatchExpandedOrganizationsState, {
      payload: id,
      type: ExpandedOrganizationsActionTypes.ADD_EXPANDED_ORGANIZATION,
    });
  });
});

describe('removeExpandedOrganization function', () => {
  it('should call reducer correcly', async () => {
    const dispatchExpandedOrganizationsState = vi.fn();
    const id = TEST_PUBLISHER_ID;

    removeExpandedOrganization({ dispatchExpandedOrganizationsState, id });

    await waitReducerToBeCalled(dispatchExpandedOrganizationsState, {
      payload: id,
      type: ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION,
    });
  });
});
