/* eslint-disable import/no-named-as-default-member */
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import i18n from 'i18next';

import { EnrolmentQueryVariables } from '../../../generated/graphql';
import {
  fakeEnrolment,
  fakeRegistration,
  fakeSeatsReservation,
} from '../../../utils/mockDataUtils';
import { enrolment } from '../../enrolment/__mocks__/enrolment';
import { registration } from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';
import { setSeatsReservationData } from '../../reserveSeats/utils';
import {
  ATTENDEE_INITIAL_VALUES,
  ENROLMENT_ACTIONS,
  ENROLMENT_FIELDS,
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  TEST_ENROLMENT_ID,
} from '../constants';
import {
  enrolmentPathBuilder,
  getAttendeeCapacityError,
  getAttendeeDefaultInitialValues,
  getEditEnrolmentWarning,
  getEnrolmentInitialValues,
  getEnrolmentNotificationsCode,
  getEnrolmentNotificationTypes,
  getEnrolmentPayload,
  getFreeAttendeeCapacity,
  getUpdateEnrolmentPayload,
  isEnrolmentFieldRequired,
  isRestoringFormDataDisabled,
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

describe('getAttendeeDefaultInitialValues function', () => {
  it('should return attendee initial values', () => {
    expect(getAttendeeDefaultInitialValues(fakeRegistration())).toEqual({
      city: '',
      dateOfBirth: null,
      extraInfo: '',
      inWaitingList: false,
      name: '',
      streetAddress: '',
      zipcode: '',
    });
  });
});

describe('getEnrolmentInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      attendees,
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: null,
        dateOfBirth: null,
        email: null,
        extraInfo: null,
        membershipNumber: null,
        name: null,
        nativeLanguage: null,
        notifications: null,
        phoneNumber: null,
        serviceLanguage: null,
        streetAddress: null,
        zipcode: null,
      }),
      fakeRegistration()
    );

    expect(attendees).toEqual([
      {
        city: '',
        dateOfBirth: null,
        extraInfo: '',
        inWaitingList: false,
        name: '',
        streetAddress: '',
        zipcode: '',
      },
    ]);
    expect(email).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([]);
    expect(phoneNumber).toBe('');
    expect(serviceLanguage).toBe('');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedDateOfBirth = new Date('2021-10-10');
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedName = 'Name';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedServiceLanguage = 'sv';
    const expectedStreetAddress = 'Test address';
    const expectedZip = '12345';

    const {
      attendees,
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: expectedCity,
        dateOfBirth: '2021-10-10',
        email: expectedEmail,
        extraInfo: expectedExtraInfo,
        membershipNumber: expectedMembershipNumber,
        name: expectedName,
        nativeLanguage: expectedNativeLanguage,
        notifications: NOTIFICATION_TYPE.SMS_EMAIL,
        phoneNumber: expectedPhoneNumber,
        serviceLanguage: expectedServiceLanguage,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      }),
      registration
    );

    expect(attendees).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: '',
        inWaitingList: false,
        name: expectedName,
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

describe('getEnrolmentNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getEnrolmentNotificationsCode([])).toBe(
      NOTIFICATION_TYPE.NO_NOTIFICATION
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.SMS])).toBe(
      NOTIFICATION_TYPE.SMS
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(
      NOTIFICATION_TYPE.EMAIL
    );
    expect(
      getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(NOTIFICATION_TYPE.SMS_EMAIL);
  });
});

describe('getEnrolmentPayload function', () => {
  it('should return single enrolment as payload', () => {
    expect(
      getEnrolmentPayload({
        formValues: {
          ...ENROLMENT_INITIAL_VALUES,
          attendees: [ATTENDEE_INITIAL_VALUES],
        },
        reservationCode: TEST_SEATS_RESERVATION_CODE,
      })
    ).toEqual({
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city: '',
          dateOfBirth: null,
          email: null,
          extraInfo: '',
          membershipNumber: '',
          name: '',
          nativeLanguage: null,
          notifications: 'none',
          phoneNumber: null,
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
      membershipNumber = 'XXX-123',
      name = 'Name',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getEnrolmentPayload({
      formValues: {
        ...ENROLMENT_INITIAL_VALUES,
        attendees: [
          {
            city,
            dateOfBirth,
            extraInfo: '',
            inWaitingList: false,
            name,
            streetAddress,
            zipcode,
          },
        ],
        email,
        extraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      reservationCode: TEST_SEATS_RESERVATION_CODE,
    });

    expect(payload).toEqual({
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city,
          dateOfBirth: '1999-10-10',
          email,
          extraInfo,
          membershipNumber,
          name,
          nativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber,
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
        formValues: ENROLMENT_INITIAL_VALUES,
        id: TEST_ENROLMENT_ID,
        registration,
      })
    ).toEqual({
      city: '',
      dateOfBirth: null,
      email: null,
      extraInfo: '',
      id: TEST_ENROLMENT_ID,
      membershipNumber: '',
      name: '',
      nativeLanguage: null,
      notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
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
      membershipNumber = 'XXX-123',
      name = 'Name',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const attendees = [
      {
        city,
        dateOfBirth,
        extraInfo: '',
        inWaitingList: false,
        name,
        streetAddress,
        zipcode,
      },
    ];
    const payload = getUpdateEnrolmentPayload({
      formValues: {
        ...ENROLMENT_INITIAL_VALUES,
        attendees,
        email,
        extraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      id: TEST_ENROLMENT_ID,
      registration,
    });

    expect(payload).toEqual({
      city,
      dateOfBirth: '1999-10-10',
      email,
      extraInfo,
      id: TEST_ENROLMENT_ID,
      membershipNumber,
      name,
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
  const cases: [EnrolmentQueryVariables, string][] = [
    [{ id: 'hel:123' }, '/signup_edit/hel:123/'],
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
    expect(
      getEditEnrolmentWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: ENROLMENT_ACTIONS.CANCEL,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä osallistujaa.');
  });
});

describe('getAttendeeCapacityError', () => {
  it('should return undefined if maximum_attendee_capacity is not defined', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximumAttendeeCapacity: null }),
        4,
        i18n.t.bind(i18n)
      )
    ).toBeUndefined();
  });

  it('should return correct error if participantAmount is less than 1', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximumAttendeeCapacity: null }),
        0,
        i18n.t.bind(i18n)
      )
    ).toBe('Osallistujien vähimmäismäärä on 1.');
  });

  it('should return correct error if participantAmount is greater than maximum_attendee_capacity', () => {
    expect(
      getAttendeeCapacityError(
        fakeRegistration({ maximumAttendeeCapacity: 3 }),
        4,
        i18n.t.bind(i18n)
      )
    ).toBe('Osallistujien enimmäismäärä on 3.');
  });
});

describe('getFreeAttendeeCapacity', () => {
  it('should return undefined if maximum_attendee_capacity is not defined', () => {
    expect(
      getFreeAttendeeCapacity(
        fakeRegistration({ maximumAttendeeCapacity: null })
      )
    ).toBeUndefined();
  });

  it('should return correct amount if maximum_attendee_capacity is defined', () => {
    expect(
      getFreeAttendeeCapacity(
        fakeRegistration({
          currentAttendeeCount: 4,
          maximumAttendeeCapacity: 40,
        })
      )
    ).toBe(36);
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

describe('isEnrolmentFieldRequired', () => {
  const falseCases: [string[], ENROLMENT_FIELDS][] = [
    [['phone_number'], ENROLMENT_FIELDS.EMAIL],
    [['phone_number'], ENROLMENT_FIELDS.EXTRA_INFO],
    [['phone_number'], ENROLMENT_FIELDS.MEMBERSHIP_NUMBER],
    [['phone_number'], ENROLMENT_FIELDS.NATIVE_LANGUAGE],
    [['phone_number'], ENROLMENT_FIELDS.SERVICE_LANGUAGE],
  ];

  it.each(falseCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isEnrolmentFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(false)
  );

  const trueCases: [string[], ENROLMENT_FIELDS][] = [
    [['phone_number'], ENROLMENT_FIELDS.PHONE_NUMBER],
  ];

  it.each(trueCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isEnrolmentFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(true)
  );
});
