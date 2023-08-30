/* eslint-disable import/no-named-as-default-member */
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import i18n from 'i18next';

import { SignupQueryVariables } from '../../../generated/graphql';
import {
  fakeRegistration,
  fakeSeatsReservation,
  fakeSignup,
} from '../../../utils/mockDataUtils';
import { enrolment } from '../../enrolment/__mocks__/enrolment';
import {
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';
import { setSeatsReservationData } from '../../reserveSeats/utils';
import {
  ENROLMENT_ACTIONS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
  TEST_ENROLMENT_ID,
} from '../constants';
import {
  enrolmentPathBuilder,
  getEditEnrolmentWarning,
  getEnrolmentNotificationTypes,
  getSignupDefaultInitialValues,
  getSignupGroupInitialValues,
  getSignupGroupPayload,
  getSignupNotificationsCode,
  getUpdateEnrolmentPayload,
  isRestoringFormDataDisabled,
  isSignupFieldRequired,
} from '../utils';

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const generateSeatsReservationData = (expirationOffset: number) => {
  const now = new Date();
  let expiration = '';

  if (expirationOffset) {
    expiration = addSeconds(now, expirationOffset).toISOString();
  } else {
    expiration = subSeconds(now, expirationOffset).toISOString();
  }

  const reservation = fakeSeatsReservation({ expiration });

  return reservation;
};

describe('getSignupDefaultInitialValues function', () => {
  it('should return signup initial values', () => {
    expect(getSignupDefaultInitialValues(fakeRegistration())).toEqual({
      city: '',
      dateOfBirth: null,
      extraInfo: '',
      firstName: '',
      inWaitingList: false,
      lastName: '',
      streetAddress: '',
      zipcode: '',
    });
  });
});

describe('getSignupGroupInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      signups,
    } = getSignupGroupInitialValues(
      fakeSignup({
        city: null,
        dateOfBirth: null,
        email: null,
        extraInfo: null,
        firstName: null,
        lastName: null,
        membershipNumber: null,
        nativeLanguage: null,
        notifications: null,
        phoneNumber: null,
        serviceLanguage: null,
        streetAddress: null,
        zipcode: null,
      }),
      fakeRegistration()
    );

    expect(signups).toEqual([
      {
        city: '',
        dateOfBirth: null,
        extraInfo: '',
        firstName: '',
        inWaitingList: false,
        lastName: '',
        streetAddress: '',
        zipcode: '',
      },
    ]);
    expect(email).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([NOTIFICATIONS.EMAIL]);
    expect(phoneNumber).toBe('');
    expect(serviceLanguage).toBe('');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedDateOfBirth = new Date('2021-10-10');
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedFirstName = 'First name';
    const expectedLastName = 'Last name';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL];
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedServiceLanguage = 'sv';
    const expectedStreetAddress = 'Test address';
    const expectedZip = '12345';

    const {
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      signups,
    } = getSignupGroupInitialValues(
      fakeSignup({
        city: expectedCity,
        dateOfBirth: '2021-10-10',
        email: expectedEmail,
        extraInfo: expectedExtraInfo,
        firstName: expectedFirstName,
        lastName: expectedLastName,
        membershipNumber: expectedMembershipNumber,
        nativeLanguage: expectedNativeLanguage,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: expectedPhoneNumber,
        serviceLanguage: expectedServiceLanguage,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      }),
      registration
    );

    expect(signups).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: '',
        firstName: expectedFirstName,
        lastName: expectedLastName,
        inWaitingList: false,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      },
    ]);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
  });
});

describe('getEnrolmentNotificationTypes function', () => {
  it('should return correct notification types', () => {
    expect(
      getEnrolmentNotificationTypes(NOTIFICATION_TYPE.NO_NOTIFICATION)
    ).toEqual([]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.SMS)).toEqual([
      NOTIFICATIONS.SMS,
    ]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
    ]);
    expect(getEnrolmentNotificationTypes(NOTIFICATION_TYPE.SMS_EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
      NOTIFICATIONS.SMS,
    ]);
    expect(getEnrolmentNotificationTypes('lorem ipsum')).toEqual([]);
  });
});

describe('getSignupNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getSignupNotificationsCode([])).toBe(
      NOTIFICATION_TYPE.NO_NOTIFICATION
    );
    expect(getSignupNotificationsCode([NOTIFICATIONS.SMS])).toBe(
      NOTIFICATION_TYPE.SMS
    );
    expect(getSignupNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(
      NOTIFICATION_TYPE.EMAIL
    );
    expect(
      getSignupNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(NOTIFICATION_TYPE.SMS_EMAIL);
  });
});

describe('getSignupGroupPayload function', () => {
  it('should return signup group payload', () => {
    expect(
      getSignupGroupPayload({
        formValues: {
          ...SIGNUP_GROUP_INITIAL_VALUES,
          signups: [SIGNUP_INITIAL_VALUES],
        },
        registration,
        reservationCode: TEST_SEATS_RESERVATION_CODE,
      })
    ).toEqual({
      extraInfo: '',
      registration: registrationId,
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city: '',
          dateOfBirth: null,
          email: null,
          extraInfo: '',
          firstName: '',
          lastName: '',
          membershipNumber: '',
          nativeLanguage: null,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: null,
          responsibleForGroup: true,
          serviceLanguage: null,
          streetAddress: null,
          zipcode: null,
        },
      ],
    });

    const city = 'City',
      dateOfBirth = new Date('1999-10-10'),
      email = 'Email',
      extraInfo = 'Extra info',
      firstName = 'First name',
      groupExtraInfo = 'Group extra info',
      lastName = 'Last name',
      membershipNumber = 'XXX-123',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getSignupGroupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        email,
        extraInfo: groupExtraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        signups: [
          {
            city,
            dateOfBirth,
            extraInfo,
            firstName,
            lastName,
            inWaitingList: false,
            streetAddress,
            zipcode,
          },
        ],
      },
      registration,
      reservationCode: TEST_SEATS_RESERVATION_CODE,
    });

    expect(payload).toEqual({
      extraInfo: groupExtraInfo,
      registration: registrationId,
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city,
          dateOfBirth: '1999-10-10',
          email,
          extraInfo,
          firstName,
          lastName,
          membershipNumber,
          nativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber,
          responsibleForGroup: true,
          serviceLanguage,
          streetAddress,
          zipcode,
        },
      ],
    });
  });
});

describe('getUpdateEnrolmentPayload function', () => {
  it('should return single enrolment as payload', () => {
    expect(
      getUpdateEnrolmentPayload({
        formValues: SIGNUP_GROUP_INITIAL_VALUES,
        id: TEST_ENROLMENT_ID,
        registration,
      })
    ).toEqual({
      city: '',
      dateOfBirth: null,
      email: null,
      extraInfo: '',
      firstName: '',
      id: TEST_ENROLMENT_ID,
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
        inWaitingList: false,
        lastName,
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
      id: TEST_ENROLMENT_ID,
      registration,
    });

    expect(payload).toEqual({
      city,
      dateOfBirth: '1999-10-10',
      email,
      extraInfo,
      firstName,
      id: TEST_ENROLMENT_ID,
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
    const allowedActions = [ENROLMENT_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditEnrolmentWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      ENROLMENT_ACTIONS.CANCEL,
      ENROLMENT_ACTIONS.SEND_MESSAGE,
    ];

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
    const actions: [ENROLMENT_ACTIONS, string][] = [
      [
        ENROLMENT_ACTIONS.CANCEL,
        'Sinulla ei ole oikeuksia muokata tätä osallistujaa.',
      ],
      [
        ENROLMENT_ACTIONS.CREATE,
        'Sinulla ei ole oikeuksia luoda osallistujia tähän ilmoittautumiseen.',
      ],
      [
        ENROLMENT_ACTIONS.VIEW,
        'Sinulla ei ole oikeuksia nähdä tämän ilmoittautumisen osallistujia.',
      ],
    ];

    actions.forEach(([action, error]) =>
      expect(getEditEnrolmentWarning({ ...commonProps, action })).toBe(error)
    );
  });
});

describe('isRestoringFormDataDisabled', () => {
  it('should return true if enrolment is defined', () => {
    expect(
      isRestoringFormDataDisabled({
        enrolment: enrolment,
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(true);
  });

  it('should return true if reservation data is not defined', () => {
    expect(
      isRestoringFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(true);
  });

  it('should return true if reservation data is expired', () => {
    setSeatsReservationData(
      TEST_REGISTRATION_ID,
      generateSeatsReservationData(-1000)
    );
    expect(
      isRestoringFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(true);
  });

  it('should return false if reservation data is not expired', () => {
    setSeatsReservationData(
      TEST_REGISTRATION_ID,
      generateSeatsReservationData(1000)
    );
    expect(
      isRestoringFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(false);
  });
});

describe('isSignupFieldRequired', () => {
  const falseCases: [string[], SIGNUP_GROUP_FIELDS][] = [
    [['phone_number'], SIGNUP_GROUP_FIELDS.EMAIL],
    [['phone_number'], SIGNUP_GROUP_FIELDS.EXTRA_INFO],
    [['phone_number'], SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER],
    [['phone_number'], SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE],
    [['phone_number'], SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE],
  ];

  it.each(falseCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(false)
  );

  const trueCases: [string[], SIGNUP_GROUP_FIELDS][] = [
    [['phone_number'], SIGNUP_GROUP_FIELDS.PHONE_NUMBER],
  ];

  it.each(trueCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(true)
  );
});
