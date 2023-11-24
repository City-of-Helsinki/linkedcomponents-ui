/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { fakeRegistration, fakeUser } from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import {
  checkCanUserDoRegistrationAction,
  getRegistrationActionWarning,
} from '../permissions';

describe('checkCanUserDoRegistrationAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  const testAdminOrgCases: [REGISTRATION_ACTIONS, boolean][] = [
    [REGISTRATION_ACTIONS.COPY, true],
    [REGISTRATION_ACTIONS.COPY_LINK, true],
    [REGISTRATION_ACTIONS.CREATE, true],
    [REGISTRATION_ACTIONS.DELETE, true],
    [REGISTRATION_ACTIONS.EDIT, true],
    [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST, false],
    [REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL, false],
    [REGISTRATION_ACTIONS.SHOW_SIGNUPS, false],
    [REGISTRATION_ACTIONS.UPDATE, true],
  ];
  it.each(testAdminOrgCases)(
    'should allow/deny correct actions if adminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoRegistrationAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testAdminCreatedCases: [REGISTRATION_ACTIONS, boolean][] = [
    [REGISTRATION_ACTIONS.COPY, true],
    [REGISTRATION_ACTIONS.COPY_LINK, true],
    [REGISTRATION_ACTIONS.CREATE, true],
    [REGISTRATION_ACTIONS.DELETE, true],
    [REGISTRATION_ACTIONS.EDIT, true],
    [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST, true],
    [REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL, true],
    [REGISTRATION_ACTIONS.SHOW_SIGNUPS, true],
    [REGISTRATION_ACTIONS.UPDATE, true],
  ];
  it.each(testAdminCreatedCases)(
    'should allow/deny correct actions for admin who created the registration, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoRegistrationAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({
            isCreatedByCurrentUser: true,
            publisher,
          }),
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testRegistrationAdminOrgCases: [REGISTRATION_ACTIONS, boolean][] = [
    [REGISTRATION_ACTIONS.COPY, true],
    [REGISTRATION_ACTIONS.COPY_LINK, true],
    [REGISTRATION_ACTIONS.CREATE, true],
    [REGISTRATION_ACTIONS.DELETE, true],
    [REGISTRATION_ACTIONS.EDIT, true],
    [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST, true],
    [REGISTRATION_ACTIONS.SHOW_SIGNUPS, true],
    [REGISTRATION_ACTIONS.UPDATE, true],
  ];
  it.each(testRegistrationAdminOrgCases)(
    'should allow/deny correct actions if registrationAdminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ registrationAdminOrganizations: [publisher] });

      expect(
        checkCanUserDoRegistrationAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testOrgMemberCases: [REGISTRATION_ACTIONS, boolean][] = [
    [REGISTRATION_ACTIONS.COPY, false],
    [REGISTRATION_ACTIONS.COPY_LINK, false],
    [REGISTRATION_ACTIONS.CREATE, false],
    [REGISTRATION_ACTIONS.DELETE, false],
    [REGISTRATION_ACTIONS.EDIT, false],
    [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST, false],
    [REGISTRATION_ACTIONS.SHOW_SIGNUPS, false],
    [REGISTRATION_ACTIONS.UPDATE, false],
  ];
  it.each(testOrgMemberCases)(
    'should allow/deny correct actions if organizationMembers contains publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ organizationMemberships: [publisher] });

      expect(
        checkCanUserDoRegistrationAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(isAllowed);
    }
  );
});

describe('getRegistrationActionWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    const deniedActions = [
      REGISTRATION_ACTIONS.COPY,
      REGISTRATION_ACTIONS.COPY_LINK,
      REGISTRATION_ACTIONS.DELETE,
      REGISTRATION_ACTIONS.EDIT,
      REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL,
      REGISTRATION_ACTIONS.SHOW_SIGNUPS,
      REGISTRATION_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(
        getRegistrationActionWarning({
          action,
          ...commonProps,
        })
      ).toBe('Sinulla ei ole oikeuksia muokata ilmoittautumisia.');
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getRegistrationActionWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: REGISTRATION_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
  });

  it('should return warning if registration has signups', () => {
    expect(
      getRegistrationActionWarning({
        authenticated: true,
        registration: fakeRegistration({ currentAttendeeCount: 1 }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: REGISTRATION_ACTIONS.DELETE,
      })
    ).toBe('Ilmoittautumisia joilla on osallistujia ei voi poistaa.');
  });
});
