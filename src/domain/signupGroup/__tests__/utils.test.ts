import {
  CreateSignupGroupMutationInput,
  SignupInput,
} from '../../../generated/graphql';
import {
  fakeRegistration,
  fakeSignup,
  fakeSignupGroup,
  getMockedSeatsReservationData,
} from '../../../utils/mockDataUtils';
import {
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../../seatsReservation/constants';
import { setSeatsReservationData } from '../../seatsReservation/utils';
import { TEST_SIGNUP_ID } from '../../signup/constants';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from '../constants';
import {
  getSignupDefaultInitialValues,
  getSignupGroupInitialValues,
  getSignupGroupPayload,
  getSignupNotificationsCode,
  getSignupNotificationTypes,
  getUpdateSignupGroupPayload,
  isRestoringSignupGroupFormDataDisabled,
  isSignupFieldRequired,
  omitSensitiveDataFromSignupGroupPayload,
} from '../utils';

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

describe('getSignupDefaultInitialValues function', () => {
  it('should return signup initial values', () => {
    expect(getSignupDefaultInitialValues()).toEqual({
      city: '',
      dateOfBirth: null,
      extraInfo: '',
      firstName: '',
      id: null,
      inWaitingList: false,
      lastName: '',
      responsibleForGroup: false,
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
      fakeSignupGroup({
        signups: [
          fakeSignup({
            city: null,
            dateOfBirth: null,
            email: null,
            extraInfo: null,
            firstName: null,
            id: TEST_SIGNUP_ID,
            lastName: null,
            membershipNumber: null,
            nativeLanguage: null,
            notifications: null,
            phoneNumber: null,
            serviceLanguage: null,
            streetAddress: null,
            zipcode: null,
          }),
        ],
      })
    );

    expect(signups).toEqual([
      {
        city: '',
        dateOfBirth: null,
        extraInfo: '',
        firstName: '',
        inWaitingList: false,
        id: TEST_SIGNUP_ID,
        lastName: '',
        responsibleForGroup: false,
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

  it('should return signup group initial values', () => {
    const expectedCity = 'City';
    const expectedDateOfBirth = new Date('2021-10-10');
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedGroupExtraInfo = 'Group extra info';
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
      fakeSignupGroup({
        extraInfo: expectedGroupExtraInfo,
        signups: [
          fakeSignup({
            city: expectedCity,
            dateOfBirth: '2021-10-10',
            email: expectedEmail,
            extraInfo: expectedExtraInfo,
            firstName: expectedFirstName,
            id: TEST_SIGNUP_ID,
            lastName: expectedLastName,
            membershipNumber: expectedMembershipNumber,
            nativeLanguage: expectedNativeLanguage,
            notifications: NOTIFICATION_TYPE.EMAIL,
            phoneNumber: expectedPhoneNumber,
            responsibleForGroup: false,
            serviceLanguage: expectedServiceLanguage,
            streetAddress: expectedStreetAddress,
            zipcode: expectedZip,
          }),
        ],
      })
    );

    expect(signups).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: expectedExtraInfo,
        firstName: expectedFirstName,
        id: TEST_SIGNUP_ID,
        lastName: expectedLastName,
        inWaitingList: false,
        responsibleForGroup: false,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      },
    ]);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedGroupExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
  });
});

describe('getSignupNotificationTypes function', () => {
  it('should return correct notification types', () => {
    expect(
      getSignupNotificationTypes(NOTIFICATION_TYPE.NO_NOTIFICATION)
    ).toEqual([]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.SMS)).toEqual([
      NOTIFICATIONS.SMS,
    ]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
    ]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.SMS_EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
      NOTIFICATIONS.SMS,
    ]);
    expect(getSignupNotificationTypes('lorem ipsum')).toEqual([]);
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
            id: TEST_SIGNUP_ID,
            lastName,
            inWaitingList: false,
            responsibleForGroup: false,
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

describe('isRestoringSignupGroupFormDataDisabled', () => {
  it('should return true if signup group is defined', () => {
    expect(
      isRestoringSignupGroupFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
        signupGroup: fakeSignupGroup(),
      })
    ).toBe(true);
  });

  it('should return true if reservation data is not defined', () => {
    expect(
      isRestoringSignupGroupFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(true);
  });

  it('should return true if reservation data is expired', () => {
    setSeatsReservationData(
      TEST_REGISTRATION_ID,
      getMockedSeatsReservationData(-1000)
    );
    expect(
      isRestoringSignupGroupFormDataDisabled({
        registrationId: TEST_REGISTRATION_ID,
      })
    ).toBe(true);
  });

  it('should return false if reservation data is not expired', () => {
    setSeatsReservationData(
      TEST_REGISTRATION_ID,
      getMockedSeatsReservationData(1000)
    );
    expect(
      isRestoringSignupGroupFormDataDisabled({
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

describe('getSignupGroupInitialValues', () => {
  it('should sort singnups so that items where responsibleForGroup is true are at the start', () => {
    const signup1 = fakeSignup({ id: 'signup:1', responsibleForGroup: false });
    const signup2 = fakeSignup({ id: 'signup:2', responsibleForGroup: true });
    const signup3 = fakeSignup({ id: 'signup:3', responsibleForGroup: true });
    const signup4 = fakeSignup({ id: 'signup:4', responsibleForGroup: false });
    const signupGroup = fakeSignupGroup({
      signups: [signup1, signup2, signup3, signup4],
    });

    const initialValues = getSignupGroupInitialValues(signupGroup);
    expect(initialValues.signups[0].id).toEqual(signup2.id);
    expect(initialValues.signups[1].id).toEqual(signup3.id);
    expect(initialValues.signups[2].id).toEqual(signup1.id);
    expect(initialValues.signups[3].id).toEqual(signup4.id);
  });
});

describe('getUpdateSignupGroupPayload function', () => {
  it('should return signup group payload default values', () => {
    expect(
      getUpdateSignupGroupPayload({
        formValues: {
          ...SIGNUP_GROUP_INITIAL_VALUES,
          signups: [{ ...SIGNUP_INITIAL_VALUES }],
        },
        registration,
      })
    ).toEqual({
      extraInfo: '',
      registration: TEST_REGISTRATION_ID,
      signups: [
        {
          city: '',
          dateOfBirth: null,
          email: null,
          extraInfo: '',
          firstName: '',
          id: null,
          lastName: '',
          membershipNumber: '',
          nativeLanguage: null,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: null,
          responsibleForGroup: false,
          serviceLanguage: null,
          streetAddress: null,
          zipcode: null,
        },
      ],
    });
  });

  it('should return signup group payload', () => {
    const city = 'City',
      dateOfBirth = new Date('1999-10-10'),
      email = 'Email',
      extraInfo = 'Extra info',
      groupExtraInfo = 'Group extra info',
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
        extraInfo,
        firstName,
        id: TEST_SIGNUP_ID,
        inWaitingList: false,
        lastName,
        responsibleForGroup: true,
        streetAddress,
        zipcode,
      },
    ];

    const payload = getUpdateSignupGroupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        email,
        extraInfo: groupExtraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        signups,
      },
      registration,
    });

    expect(payload).toEqual({
      extraInfo: groupExtraInfo,
      registration: TEST_REGISTRATION_ID,
      signups: [
        {
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
          responsibleForGroup: true,
          serviceLanguage,
          streetAddress,
          zipcode,
        },
      ],
    });
  });
});

describe('omitSensitiveDataFromSignupGroupPayload', () => {
  it('should omit sensitive data from payload', () => {
    const payload: CreateSignupGroupMutationInput = {
      extraInfo: 'Extra info',
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [
        {
          city: 'Helsinki',
          dateOfBirth: '1999-10-10',
          email: 'test@email.com',
          extraInfo: 'Signup entra info',
          firstName: 'First name',
          id: '1',
          lastName: 'Last name',
          membershipNumber: 'XYZ',
          nativeLanguage: 'fi',
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: '0441234567',
          responsibleForGroup: true,
          serviceLanguage: 'fi',
          streetAddress: 'Address',
          zipcode: '123456',
        },
      ],
    };

    const filteredPayload = omitSensitiveDataFromSignupGroupPayload(
      payload
    ) as CreateSignupGroupMutationInput;
    expect(filteredPayload).toEqual({
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [
        {
          id: '1',
          notifications: NOTIFICATION_TYPE.EMAIL,
          responsibleForGroup: true,
        },
      ],
    });
    const signup = filteredPayload.signups?.[0] as SignupInput;
    expect(filteredPayload.extraInfo).toBeUndefined();
    expect(signup.city).toBeUndefined();
    expect(signup.email).toBeUndefined();
    expect(signup.extraInfo).toBeUndefined();
    expect(signup.firstName).toBeUndefined();
    expect(signup.lastName).toBeUndefined();
    expect(signup.membershipNumber).toBeUndefined();
    expect(signup.nativeLanguage).toBeUndefined();
    expect(signup.phoneNumber).toBeUndefined();
    expect(signup.serviceLanguage).toBeUndefined();
    expect(signup.streetAddress).toBeUndefined();
    expect(signup.zipcode).toBeUndefined();
  });
});
