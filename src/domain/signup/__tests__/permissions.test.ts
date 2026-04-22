/* eslint-disable import/no-named-as-default-member */
import addDays from 'date-fns/addDays';
import i18n from 'i18next';

import {
  fakeEvent,
  fakePaymentCancellation,
  fakePaymentRefund,
  fakePriceGroup,
  fakeRegistration,
  fakeRegistrationPriceGroup,
  fakeSignup,
  fakeSignupGroup,
  fakeUser,
} from '../../../utils/mockDataUtils';
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
        registration: fakeRegistration(),
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
          registration: fakeRegistration(),
          t: i18n.t.bind(i18n),
          userCanDoAction: false,
          action,
        })
      ).toBe(warning);
    }
  );

  it('should return correct warning when trying to delete signup with payment cancellation', () => {
    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration(),
        signup: fakeSignup({
          paymentCancellation: fakePaymentCancellation(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Osallistujan maksua perutaan eikä osallistujaa voi poistaa.');
  });

  it('should return correct warning when trying to delete signup with signup group with payment cancellation', () => {
    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration(),
        signup: fakeSignup(),
        signupGroup: fakeSignupGroup({
          paymentCancellation: fakePaymentCancellation(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Osallistujan maksua perutaan eikä osallistujaa voi poistaa.');
  });

  it('should return correct warning when trying to delete signup with payment refund', () => {
    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration(),
        signup: fakeSignup({
          paymentRefund: fakePaymentRefund(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Osallistujan maksua hyvitetään eikä osallistujaa voi poistaa.');
  });

  it('should return correct warning when trying to delete signup with signup group with payment refund', () => {
    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration(),
        signup: fakeSignup(),
        signupGroup: fakeSignupGroup({
          paymentRefund: fakePaymentRefund(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Osallistujan maksua hyvitetään eikä osallistujaa voi poistaa.');
  });

  it('should return correct warning when trying to delete paid signup past refund deadline', () => {
    const eventInFiveDays = addDays(new Date(), 5);

    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration({
          event: fakeEvent({ startTime: eventInFiveDays.toISOString() }),
          registrationPriceGroups: [
            fakeRegistrationPriceGroup({ price: '10.00' }),
          ],
        }),
        signup: fakeSignup({
          priceGroup: fakePriceGroup(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Hyvityksen määräaika on umpeutunut eikä osallistujaa voi poistaa.');
  });

  it('should return correct warning when trying to delete signup group with paid signups past refund deadline', () => {
    const eventInFiveDays = addDays(new Date(), 5);

    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration({
          event: fakeEvent({ startTime: eventInFiveDays.toISOString() }),
          registrationPriceGroups: [
            fakeRegistrationPriceGroup({ price: '10.00' }),
          ],
        }),
        signupGroup: fakeSignupGroup({
          signups: [fakeSignup({ priceGroup: fakePriceGroup() })],
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('Hyvityksen määräaika on umpeutunut eikä osallistujaa voi poistaa.');
  });

  it('should not return refund deadline warning when trying to delete paid signup within refund deadline', () => {
    const eventInTenDays = addDays(new Date(), 10);

    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration({
          event: fakeEvent({ startTime: eventInTenDays.toISOString() }),
          registrationPriceGroups: [
            fakeRegistrationPriceGroup({ price: '10.00' }),
          ],
        }),
        signup: fakeSignup({
          priceGroup: fakePriceGroup(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('');
  });

  it('should not return refund deadline warning when trying to delete free signup past deadline', () => {
    const eventInFiveDays = addDays(new Date(), 5);

    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration({
          event: fakeEvent({ startTime: eventInFiveDays.toISOString() }),
          registrationPriceGroups: [
            fakeRegistrationPriceGroup({ price: '0.00' }),
          ],
        }),
        signup: fakeSignup(),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('');
  });

  it('should not return refund deadline warning when registration has no pricing', () => {
    const eventInFiveDays = addDays(new Date(), 5);

    expect(
      getSignupActionWarning({
        authenticated: true,
        registration: fakeRegistration({
          event: fakeEvent({ startTime: eventInFiveDays.toISOString() }),
          registrationPriceGroups: [],
        }),
        signup: fakeSignup({
          priceGroup: fakePriceGroup(),
        }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: SIGNUP_ACTIONS.DELETE,
      })
    ).toBe('');
  });
});

describe('checkCanUserDoSignupAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  const testAdminOrgCases: [SIGNUP_ACTIONS, boolean][] = [
    [SIGNUP_ACTIONS.CREATE, false],
    [SIGNUP_ACTIONS.DELETE, false],
    [SIGNUP_ACTIONS.EDIT, false],
    [SIGNUP_ACTIONS.SEND_MESSAGE, false],
    [SIGNUP_ACTIONS.UPDATE, false],
    [SIGNUP_ACTIONS.VIEW, false],
  ];
  it.each(testAdminOrgCases)(
    'should allow/deny correct actions if adminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(isAllowed);
    }
  );

  const testAdminCreatedCases: [SIGNUP_ACTIONS, boolean][] = [
    [SIGNUP_ACTIONS.CREATE, true],
    [SIGNUP_ACTIONS.DELETE, true],
    [SIGNUP_ACTIONS.EDIT, true],
    [SIGNUP_ACTIONS.SEND_MESSAGE, true],
    [SIGNUP_ACTIONS.UPDATE, true],
    [SIGNUP_ACTIONS.VIEW, true],
  ];
  it.each(testAdminCreatedCases)(
    'should allow/deny correct actions for admin who created the registration, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ adminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupAction({
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

  const testRegistrationAdminOrgCases: [SIGNUP_ACTIONS, boolean][] = [
    [SIGNUP_ACTIONS.CREATE, true],
    [SIGNUP_ACTIONS.DELETE, true],
    [SIGNUP_ACTIONS.EDIT, true],
    [SIGNUP_ACTIONS.SEND_MESSAGE, true],
    [SIGNUP_ACTIONS.UPDATE, true],
    [SIGNUP_ACTIONS.VIEW, true],
  ];
  it.each(testRegistrationAdminOrgCases)(
    'should allow/deny correct actions if registrationAdminArganizations contains event publisher, %p returns %p',
    (action, isAllowed) => {
      const user = fakeUser({ registrationAdminOrganizations: [publisher] });

      expect(
        checkCanUserDoSignupAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
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
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(isAllowed);
    }
  );

  it('should allow any action for superuser', () => {
    const user = fakeUser({ isSuperuser: true });
    const allowedActions = Object.values(SIGNUP_ACTIONS);

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoSignupAction({
          action,
          organizationAncestors: [],
          registration: fakeRegistration({ publisher }),
          user,
        })
      ).toBe(true);
    });
  });
});
