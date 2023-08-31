/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { SignupQueryVariables } from '../../../generated/graphql';
import { registration } from '../../registration/__mocks__/registration';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../../signupGroup/constants';
import { SIGNUP_ACTIONS, TEST_SIGNUP_ID } from '../constants';
import {
  enrolmentPathBuilder,
  getEditEnrolmentWarning,
  getUpdateEnrolmentPayload,
} from '../utils';

describe('getUpdateEnrolmentPayload function', () => {
  it('should return single enrolment as payload', () => {
    expect(
      getUpdateEnrolmentPayload({
        formValues: SIGNUP_GROUP_INITIAL_VALUES,
        id: TEST_SIGNUP_ID,
        registration,
      })
    ).toEqual({
      city: '',
      dateOfBirth: null,
      email: null,
      extraInfo: '',
      firstName: '',
      id: TEST_SIGNUP_ID,
      lastName: '',
      membershipNumber: '',
      nativeLanguage: null,
      notifications: NOTIFICATION_TYPE.EMAIL,
      phoneNumber: null,
      registration: registration.id,
      serviceLanguage: null,
      streetAddress: null,
      zipcode: null,
    });

    const city = 'City',
      dateOfBirth = new Date('1999-10-10'),
      email = 'Email',
      extraInfo = 'Extra info',
      firstName = 'First name',
      lastName = 'Last name',
      membershipNumber = 'XXX-123',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const signups = [
      {
        city,
        dateOfBirth,
        extraInfo: '',
        firstName,
        id: null,
        inWaitingList: false,
        lastName,
        responsibleForGroup: false,
        streetAddress,
        zipcode,
      },
    ];
    const payload = getUpdateEnrolmentPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        email,
        extraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        signups,
      },
      id: TEST_SIGNUP_ID,
      registration,
    });

    expect(payload).toEqual({
      city,
      dateOfBirth: '1999-10-10',
      email,
      extraInfo,
      firstName,
      id: TEST_SIGNUP_ID,
      lastName,
      membershipNumber,
      nativeLanguage,
      notifications: NOTIFICATION_TYPE.EMAIL,
      phoneNumber,
      registration: registration.id,
      serviceLanguage,
      streetAddress,
      zipcode,
    });
  });
});

describe('enrolmentPathBuilder function', () => {
  const cases: [SignupQueryVariables, string][] = [
    [{ id: 'hel:123' }, `/signup/hel:123/`],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(enrolmentPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('getEditEnrolmentWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [SIGNUP_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditEnrolmentWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [SIGNUP_ACTIONS.CANCEL, SIGNUP_ACTIONS.SEND_MESSAGE];

    deniedActions.forEach((action) => {
      expect(getEditEnrolmentWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata osallistujia.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    const commonProps = {
      authenticated: true,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };
    const actions: [SIGNUP_ACTIONS, string][] = [
      [
        SIGNUP_ACTIONS.CANCEL,
        'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
      ],
      [
        SIGNUP_ACTIONS.CREATE,
        'Sinulla ei ole oikeuksia luoda osallistujia tähän ilmoittautumiseen.',
      ],
      [
        SIGNUP_ACTIONS.VIEW,
        'Sinulla ei ole oikeuksia nähdä tämän ilmoittautumisen osallistujia.',
      ],
    ];

    actions.forEach(([action, error]) =>
      expect(getEditEnrolmentWarning({ ...commonProps, action })).toBe(error)
    );
  });
});
