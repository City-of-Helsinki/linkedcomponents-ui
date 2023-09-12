/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { fakeUser } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { SIGNUP_ACTIONS } from '../constants';
import {
  checkCanUserDoSignupAction,
  getSignupActionWarning,
} from '../permissions';

describe('getSignupActionWarning function', () => {
  it.each([
    SIGNUP_ACTIONS.CREATE,
    SIGNUP_ACTIONS.DELETE,
    SIGNUP_ACTIONS.EDIT,
    SIGNUP_ACTIONS.SEND_MESSAGE,
    SIGNUP_ACTIONS.UPDATE,
    SIGNUP_ACTIONS.VIEW,
  ])(
    'should return correct warning if user is not authenticated, %p',
    (action) => {
      const commonProps = {
        authenticated: false,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
      };

      expect(getSignupActionWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata osallistujia.'
      );
    }
  );

  const testCases: [SIGNUP_ACTIONS, string][] = [
    [
      SIGNUP_ACTIONS.CREATE,
      'Sinulla ei ole oikeuksia lisätä osallistujia tähän ilmoittautumiseen.',
    ],
    [
      SIGNUP_ACTIONS.DELETE,
      'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
    ],
    [
      SIGNUP_ACTIONS.EDIT,
      'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
    ],
    [
      SIGNUP_ACTIONS.SEND_MESSAGE,
      'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
    ],
    [
      SIGNUP_ACTIONS.UPDATE,
      'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
    ],
    [
      SIGNUP_ACTIONS.VIEW,
      'Sinulla ei ole oikeuksia nähdä tämän ilmoittautumisen osallistujia.',
    ],
  ];

  it.each(testCases)(
    'should return correct warning if user cannot do action, %p returns %p',
    (action, warning) => {
      expect(
        getSignupActionWarning({
          authenticated: true,
          t: i18n.t.bind(i18n),
          userCanDoAction: false,
          action,
        })
      ).toBe(warning);
    }
  );
});

describe('checkCanUserDoSignupAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  const testAdminOrgCases: [SIGNUP_ACTIONS, boolean][] = [
    [SIGNUP_ACTIONS.CREATE, true],
    [SIGNUP_ACTIONS.DELETE, true],
    [SIGNUP_ACTIONS.EDIT, true],
    [SIGNUP_ACTIONS.SEND_MESSAGE, true],
    [SIGNUP_ACTIONS.UPDATE, true],
    [SIGNUP_ACTIONS.VIEW, true],
  ];
  it.each(testAdminOrgCases)(
    'should allow/deny correct actions if adminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testOrgMemberCases: [SIGNUP_ACTIONS, boolean][] = [
    [SIGNUP_ACTIONS.CREATE, false],
    [SIGNUP_ACTIONS.DELETE, false],
    [SIGNUP_ACTIONS.EDIT, false],
    [SIGNUP_ACTIONS.SEND_MESSAGE, false],
    [SIGNUP_ACTIONS.UPDATE, false],
    [SIGNUP_ACTIONS.VIEW, false],
  ];
  it.each(testOrgMemberCases)(
    'should allow/deny correct actions if organizationMembers contains publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ organizationMemberships: [publisher] });

      expect(
        checkCanUserDoSignupAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(isAllowed);
    }
  );
});
