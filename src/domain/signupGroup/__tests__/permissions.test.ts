/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { fakeUser } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import {
  checkCanUserDoSignupGroupAction,
  getSignupGroupActionWarning,
} from '../permissions';

describe('getSignupGroupActionWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    const deniedActions = [
      SIGNUP_GROUP_ACTIONS.CREATE,
      SIGNUP_GROUP_ACTIONS.EDIT,
      SIGNUP_GROUP_ACTIONS.UPDATE,
      SIGNUP_GROUP_ACTIONS.VIEW,
    ];

    deniedActions.forEach((action) => {
      expect(getSignupGroupActionWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata osallistujia.'
      );
    });
  });

  const testCases: [SIGNUP_GROUP_ACTIONS, string][] = [
    [
      SIGNUP_GROUP_ACTIONS.CREATE,
      'Sinulla ei ole oikeuksia lisätä osallistujia tähän ilmoittautumiseen.',
    ],
    [
      SIGNUP_GROUP_ACTIONS.EDIT,
      'Sinulla ei ole oikeuksia muokata osallistujia.',
    ],
    [
      SIGNUP_GROUP_ACTIONS.UPDATE,
      'Sinulla ei ole oikeuksia muokata osallistujia.',
    ],
    [
      SIGNUP_GROUP_ACTIONS.VIEW,
      'Sinulla ei ole oikeuksia nähdä tämän ilmoittautumisen osallistujia.',
    ],
  ];

  it.each(testCases)(
    'should return correct warning if user cannot do action, %p returns %p',
    (action, warning) => {
      expect(
        getSignupGroupActionWarning({
          authenticated: true,
          t: i18n.t.bind(i18n),
          userCanDoAction: false,
          action,
        })
      ).toBe(warning);
    }
  );
});

describe('checkCanUserDoSignupGroupAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  const testAdminOrgCases: [SIGNUP_GROUP_ACTIONS, boolean][] = [
    [SIGNUP_GROUP_ACTIONS.CREATE, false],
    [SIGNUP_GROUP_ACTIONS.DELETE, false],
    [SIGNUP_GROUP_ACTIONS.EDIT, false],
    [SIGNUP_GROUP_ACTIONS.UPDATE, false],
    [SIGNUP_GROUP_ACTIONS.VIEW, false],
  ];
  it.each(testAdminOrgCases)(
    'should allow/deny correct actions if adminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupGroupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testRegistrationAdminOrgCases: [SIGNUP_GROUP_ACTIONS, boolean][] = [
    [SIGNUP_GROUP_ACTIONS.CREATE, true],
    [SIGNUP_GROUP_ACTIONS.DELETE, true],
    [SIGNUP_GROUP_ACTIONS.EDIT, true],
    [SIGNUP_GROUP_ACTIONS.UPDATE, true],
    [SIGNUP_GROUP_ACTIONS.VIEW, true],
  ];
  it.each(testRegistrationAdminOrgCases)(
    'should allow/deny correct actions if registrationAdminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ registrationAdminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupGroupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testOrgMemberCases: [SIGNUP_GROUP_ACTIONS, boolean][] = [
    [SIGNUP_GROUP_ACTIONS.CREATE, false],
    [SIGNUP_GROUP_ACTIONS.DELETE, false],
    [SIGNUP_GROUP_ACTIONS.EDIT, false],
    [SIGNUP_GROUP_ACTIONS.UPDATE, false],
    [SIGNUP_GROUP_ACTIONS.VIEW, false],
  ];
  it.each(testOrgMemberCases)(
    'should allow/deny correct actions if organizationMembers contains publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ organizationMemberships: [publisher] });

      expect(
        checkCanUserDoSignupGroupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(isAllowed);
    }
  );
});
