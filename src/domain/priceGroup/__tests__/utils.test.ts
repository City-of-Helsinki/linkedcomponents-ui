/* eslint-disable import/no-named-as-default-member */
/* eslint-disable max-len */
import i18n from 'i18next';

import { PriceGroupsQueryVariables } from '../../../generated/graphql';
import { fakeOrganization, fakeUser } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { PRICE_GROUP_ACTIONS } from '../constants';
import { PriceGroupOption } from '../types';
import {
  checkCanUserDoPriceGroupAction,
  getEditPriceGroupWarning,
  priceGroupsPathBuilder,
  sortPriceGroupOptions,
} from '../utils';

describe('priceGroupsPathBuilder function', () => {
  const cases: [PriceGroupsQueryVariables, string][] = [
    [{ description: 'test' }, '/price_group/?description=test'],
    [{ isFree: false }, '/price_group/?is_free=false'],
    [{ isFree: true }, '/price_group/?is_free=true'],
    [{ page: 3 }, '/price_group/?page=3'],
    [{ pageSize: 10 }, '/price_group/?page_size=10'],
    [{ publisher: 'test' }, '/price_group/?publisher=test'],
  ];

  it.each(cases)(
    'should build correct path, with valiables %p',
    (variables, expectedPath) =>
      expect(priceGroupsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('sortPriceGroupOptions function', () => {
  it('should build price group options', () => {
    const option1: PriceGroupOption = {
      label: 'Price group 1',
      isFree: false,
      value: '1',
    };

    const option2: PriceGroupOption = {
      label: 'Second price group',
      isFree: false,
      value: '2',
    };

    const option3: PriceGroupOption = {
      label: 'Hintaryhmä 3',
      isFree: false,
      value: '3',
    };

    expect([option1, option2, option3].sort(sortPriceGroupOptions)).toEqual([
      option3,
      option1,
      option2,
    ]);
  });
});

describe('checkCanUserDoPriceGroupAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should allow correct actions if financialAdminArganizations contains publisher', () => {
    const user = fakeUser({ financialAdminOrganizations: [publisher] });

    const allowedActions = [
      PRICE_GROUP_ACTIONS.CREATE,
      PRICE_GROUP_ACTIONS.DELETE,
      PRICE_GROUP_ACTIONS.EDIT,
      PRICE_GROUP_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoPriceGroupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if organizationAncestors contains any of the financialAdminArganizations', () => {
    const financialAdminOrganization = 'financialadmin:1';
    const user = fakeUser({
      financialAdminOrganizations: [financialAdminOrganization],
    });

    const allowedActions = [
      PRICE_GROUP_ACTIONS.CREATE,
      PRICE_GROUP_ACTIONS.DELETE,
      PRICE_GROUP_ACTIONS.EDIT,
      PRICE_GROUP_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoPriceGroupAction({
          action,
          organizationAncestors: [
            fakeOrganization({ id: financialAdminOrganization }),
          ],
          publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if publisher is not defined and user has at least one financial admin organization', () => {
    const financialAdminOrganization = 'financialadmin:1';
    const user = fakeUser({
      financialAdminOrganizations: [financialAdminOrganization],
    });

    const allowedActions = [
      PRICE_GROUP_ACTIONS.CREATE,
      PRICE_GROUP_ACTIONS.EDIT,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoPriceGroupAction({
          action,
          organizationAncestors: [],
          publisher: '',
          user,
        })
      ).toBe(true);
    });
  });
});

describe('getEditPriceGroupWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [PRICE_GROUP_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditPriceGroupWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      PRICE_GROUP_ACTIONS.CREATE,
      PRICE_GROUP_ACTIONS.DELETE,
      PRICE_GROUP_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditPriceGroupWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata hintaryhmiä.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditPriceGroupWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: PRICE_GROUP_ACTIONS.CREATE,
      })
    ).toBe('Sinulla ei ole oikeuksia luoda hintaryhmiä.');

    expect(
      getEditPriceGroupWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: PRICE_GROUP_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä hintaryhmää.');
  });
});
