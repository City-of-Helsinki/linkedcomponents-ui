import {
  AttendeeStatus,
  ContactPersonInput,
  CreateSignupGroupMutationInput,
  SignupInput,
} from '../../../generated/graphql';
import {
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
  fakeSignup,
  fakeSignupGroup,
  fakeSignupPriceGroup,
  getMockedSeatsReservationData,
} from '../../../utils/mockDataUtils';
import {
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SEATS_RESERVATION_CODE } from '../../seatsReservation/constants';
import { setSeatsReservationData } from '../../seatsReservation/utils';
import { TEST_CONTACT_PERSON_ID, TEST_SIGNUP_ID } from '../../signup/constants';
import { getSignupInitialValues } from '../../signup/utils';
import {
  CONTACT_PERSON_FIELDS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from '../constants';
import { SignupFormFields, SignupPriceGroupOption } from '../types';
import {
  calculateTotalPrice,
  getSignupDefaultInitialValues,
  getSignupGroupInitialValues,
  getSignupGroupPayload,
  getSignupNotificationsCode,
  getSignupNotificationTypes,
  getSignupPriceGroupOptions,
  getUpdateSignupGroupPayload,
  isRestoringSignupGroupFormDataDisabled,
  isSignupFieldRequired,
  omitSensitiveDataFromSignupGroupPayload,
  shouldCreatePayment,
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
      phoneNumber: '',
      priceGroup: '',
      streetAddress: '',
      zipcode: '',
    });
  });
});

describe('getSignupGroupInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      contactPerson: {
        email,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      extraInfo,
      signups,
    } = getSignupGroupInitialValues(
      fakeSignupGroup({
        contactPerson: {
          email: null,
          id: TEST_CONTACT_PERSON_ID,
          membershipNumber: null,
          nativeLanguage: null,
          notifications: null,
          phoneNumber: null,
          serviceLanguage: null,
        },
        signups: [
          fakeSignup({
            city: null,
            contactPerson: null,
            dateOfBirth: null,
            extraInfo: null,
            firstName: null,
            id: TEST_SIGNUP_ID,
            lastName: null,
            phoneNumber: null,
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
        phoneNumber: '',
        priceGroup: '',
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
    const expectedPriceGroup = '123';
    const expectedServiceLanguage = 'sv';
    const expectedStreetAddress = 'Test address';
    const expectedZip = '12345';

    const {
      contactPerson: {
        email,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      extraInfo,
      signups,
    } = getSignupGroupInitialValues(
      fakeSignupGroup({
        extraInfo: expectedGroupExtraInfo,
        contactPerson: {
          email: expectedEmail,
          id: TEST_CONTACT_PERSON_ID,
          membershipNumber: expectedMembershipNumber,
          nativeLanguage: expectedNativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: expectedPhoneNumber,
          serviceLanguage: expectedServiceLanguage,
        },
        signups: [
          fakeSignup({
            city: expectedCity,
            contactPerson: null,
            dateOfBirth: '2021-10-10',
            extraInfo: expectedExtraInfo,
            firstName: expectedFirstName,
            id: TEST_SIGNUP_ID,
            lastName: expectedLastName,
            phoneNumber: expectedPhoneNumber,
            priceGroup: { registrationPriceGroup: 123 },
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
        phoneNumber: expectedPhoneNumber,
        priceGroup: expectedPriceGroup,
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
      contactPerson: {
        email: null,
        firstName: '',
        id: null,
        lastName: '',
        membershipNumber: '',
        nativeLanguage: null,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: null,
        serviceLanguage: null,
      },
      extraInfo: '',
      registration: registrationId,
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city: '',
          dateOfBirth: null,
          extraInfo: '',
          id: undefined,
          firstName: '',
          lastName: '',
          phoneNumber: '',
          streetAddress: null,
          zipcode: null,
        },
      ],
    });

    const city = 'City',
      contactPersonFirstName = 'Contact first name',
      contactPersonLastName = 'Contact last name',
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
      priceGroup = '132',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getSignupGroupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        contactPerson: {
          email,
          firstName: contactPersonFirstName,
          id: TEST_CONTACT_PERSON_ID,
          lastName: contactPersonLastName,
          membershipNumber,
          nativeLanguage,
          notifications,
          phoneNumber,
          serviceLanguage,
        },
        extraInfo: groupExtraInfo,
        signups: [
          {
            city,
            dateOfBirth,
            extraInfo,
            firstName,
            id: null,
            lastName,
            inWaitingList: false,
            phoneNumber,
            priceGroup,
            streetAddress,
            zipcode,
          },
        ],
      },
      registration: fakeRegistration({
        id: TEST_REGISTRATION_ID,
        registrationPriceGroups: [
          fakeRegistrationPriceGroup({
            price: '10.00',
            id: Number(priceGroup),
          }),
        ],
      }),
      reservationCode: TEST_SEATS_RESERVATION_CODE,
    });

    expect(payload).toEqual({
      contactPerson: {
        email,
        firstName: contactPersonFirstName,
        id: TEST_CONTACT_PERSON_ID,
        lastName: contactPersonLastName,
        membershipNumber,
        nativeLanguage,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber,
        serviceLanguage,
      },
      createPayment: true,
      extraInfo: groupExtraInfo,
      registration: registrationId,
      reservationCode: TEST_SEATS_RESERVATION_CODE,
      signups: [
        {
          city,
          dateOfBirth: '1999-10-10',
          extraInfo,
          firstName,
          id: undefined,
          lastName,
          phoneNumber,
          priceGroup: { registrationPriceGroup: priceGroup },
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
  const falseCases: [string[], CONTACT_PERSON_FIELDS | SIGNUP_GROUP_FIELDS][] =
    [
      [['phone_number'], CONTACT_PERSON_FIELDS.EMAIL],
      [['phone_number'], SIGNUP_GROUP_FIELDS.EXTRA_INFO],
      [['phone_number'], CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER],
      [['phone_number'], CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE],
      [['phone_number'], CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE],
    ];

  it.each(falseCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(false)
  );

  const trueCases: [string[], CONTACT_PERSON_FIELDS | SIGNUP_GROUP_FIELDS][] = [
    [['phone_number'], CONTACT_PERSON_FIELDS.PHONE_NUMBER],
  ];

  it.each(trueCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatoryFields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatoryFields }), field)
      ).toBe(true)
  );
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
      contactPerson: {
        email: null,
        firstName: '',
        id: null,
        lastName: '',
        membershipNumber: '',
        nativeLanguage: null,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: null,
        serviceLanguage: null,
      },
      extraInfo: '',
      registration: TEST_REGISTRATION_ID,
      signups: [
        {
          city: '',
          dateOfBirth: null,
          extraInfo: '',
          firstName: '',
          id: undefined,
          lastName: '',
          phoneNumber: '',
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
      contactPersonFirstName = 'First name',
      contactPersonLastName = 'Last name',
      firstName = 'First name',
      lastName = 'Last name',
      membershipNumber = 'XXX-123',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      priceGroup = 'pricegroup:1',
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
        phoneNumber,
        priceGroup,
        streetAddress,
        zipcode,
      },
    ];

    const payload = getUpdateSignupGroupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        contactPerson: {
          email,
          firstName: contactPersonFirstName,
          id: TEST_CONTACT_PERSON_ID,
          lastName: contactPersonLastName,
          membershipNumber,
          nativeLanguage,
          notifications,
          phoneNumber,
          serviceLanguage,
        },
        extraInfo: groupExtraInfo,
        signups,
      },
      registration,
    });

    expect(payload).toEqual({
      contactPerson: {
        email,
        firstName: contactPersonFirstName,
        id: TEST_CONTACT_PERSON_ID,
        lastName: contactPersonLastName,
        membershipNumber,
        nativeLanguage,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber,
        serviceLanguage,
      },
      extraInfo: groupExtraInfo,
      registration: TEST_REGISTRATION_ID,
      signups: [
        {
          city,
          dateOfBirth: '1999-10-10',
          extraInfo,
          firstName,
          id: TEST_SIGNUP_ID,
          lastName,
          phoneNumber,
          priceGroup: { registrationPriceGroup: priceGroup },
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
      contactPerson: {
        email: 'test@email.com',
        firstName: 'First name',
        id: TEST_CONTACT_PERSON_ID,
        lastName: 'Last name',
        membershipNumber: 'XYZ',
        nativeLanguage: 'fi',
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: '0441234567',
        serviceLanguage: 'fi',
      },
      extraInfo: 'Extra info',
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [
        {
          city: 'Helsinki',
          contactPerson: undefined,
          dateOfBirth: '1999-10-10',
          extraInfo: 'Signup entra info',
          firstName: 'First name',
          id: '1',
          lastName: 'Last name',
          streetAddress: 'Address',
          zipcode: '123456',
        },
      ],
    };

    const filteredPayload = omitSensitiveDataFromSignupGroupPayload(
      payload
    ) as CreateSignupGroupMutationInput;
    expect(filteredPayload).toEqual({
      contactPerson: {
        id: TEST_CONTACT_PERSON_ID,
        notifications: NOTIFICATION_TYPE.EMAIL,
      },
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [
        {
          contactPerson: undefined,
          id: '1',
        },
      ],
    });
    const signup = filteredPayload.signups?.[0] as SignupInput;
    const contactPerson = filteredPayload.contactPerson as ContactPersonInput;
    expect(filteredPayload.extraInfo).toBeUndefined();
    expect(contactPerson.email).toBeUndefined();
    expect(contactPerson.firstName).toBeUndefined();
    expect(contactPerson.lastName).toBeUndefined();
    expect(contactPerson.membershipNumber).toBeUndefined();
    expect(contactPerson.nativeLanguage).toBeUndefined();
    expect(contactPerson.phoneNumber).toBeUndefined();
    expect(contactPerson.serviceLanguage).toBeUndefined();
    expect(signup.city).toBeUndefined();
    expect(signup.extraInfo).toBeUndefined();
    expect(signup.firstName).toBeUndefined();
    expect(signup.lastName).toBeUndefined();
    expect(signup.streetAddress).toBeUndefined();
    expect(signup.zipcode).toBeUndefined();

    // Set contactPerson to null if it's not defined
    [null, undefined].forEach((contactPerson) => {
      expect(
        omitSensitiveDataFromSignupGroupPayload({
          ...payload,
          contactPerson,
        })
      ).toEqual(expect.objectContaining({ contactPerson: null }));
    });
  });
});

describe('calculateTotalPrice', () => {
  it('should calculate correct total price', () => {
    const priceGroupOptions: SignupPriceGroupOption[] = [
      { label: 'Price 1', value: '1', price: 12.0 },
      { label: 'Price 2', value: '2', price: 8.0 },
      { label: 'Price 3', value: '3', price: 15.0 },
      { label: 'Price 4', value: '4', price: 0 },
    ];
    const signups: SignupFormFields[] = [
      getSignupInitialValues(
        fakeSignup({
          priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 1 }),
        })
      ),
      getSignupInitialValues(
        fakeSignup({
          priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 2 }),
        })
      ),
      getSignupInitialValues(
        fakeSignup({
          priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 3 }),
        })
      ),
      getSignupInitialValues(
        fakeSignup({
          priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 4 }),
        })
      ),
    ];

    const totalPrice = calculateTotalPrice(priceGroupOptions, signups);
    expect(totalPrice).toEqual(35);
  });
});

describe('shouldCreatePayment', () => {
  const priceGroupOptions: SignupPriceGroupOption[] = [
    { label: 'Price 1', value: '1', price: 12.0 },
    { label: 'Price 2', value: '2', price: 0 },
  ];
  const chargeableSignup = getSignupInitialValues(
    fakeSignup({
      attendeeStatus: AttendeeStatus.Attending,
      priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 1 }),
    })
  );
  const chargeableSignupInWaitingList = getSignupInitialValues(
    fakeSignup({
      attendeeStatus: AttendeeStatus.Waitlisted,
      priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 1 }),
    })
  );
  const freeSignup = getSignupInitialValues(
    fakeSignup({
      attendeeStatus: AttendeeStatus.Attending,
      priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 2 }),
    })
  );
  const freeSignupInWaitingList = getSignupInitialValues(
    fakeSignup({
      attendeeStatus: AttendeeStatus.Waitlisted,
      priceGroup: fakeSignupPriceGroup({ registrationPriceGroup: 2 }),
    })
  );

  it.each([
    [[chargeableSignup], true],
    [[chargeableSignupInWaitingList], false],
    [[freeSignup], false],
    [[freeSignupInWaitingList], false],
    [[chargeableSignup, chargeableSignup], true],
    [[chargeableSignup, chargeableSignupInWaitingList], true],
    [[chargeableSignup, freeSignup], true],
    [[chargeableSignup, freeSignupInWaitingList], true],
    [[chargeableSignupInWaitingList, freeSignup], false],
    [[chargeableSignupInWaitingList, freeSignupInWaitingList], false],
    [[freeSignup, freeSignupInWaitingList], false],
  ])(
    'should return true if any chargeable signup is attending',
    (signups, createPayment) => {
      expect(shouldCreatePayment(priceGroupOptions, signups)).toEqual(
        createPayment
      );
    }
  );
});

describe('getSignupPriceGroupOptions', () => {
  it('should get price group options', () => {
    expect(
      getSignupPriceGroupOptions(
        fakeRegistration({
          registrationPriceGroups: [
            fakeRegistrationPriceGroup({
              id: 1,
              price: null,
              priceGroup: fakePriceGroupDense({
                description: { fi: 'First price group' },
              }),
            }),
            fakeRegistrationPriceGroup({
              id: 2,
              price: '12.00',
              priceGroup: fakePriceGroupDense({
                description: { fi: 'Second price group' },
              }),
            }),
            fakeRegistrationPriceGroup({
              id: 3,
              price: '1.20',
              priceGroup: fakePriceGroupDense({
                description: { fi: 'Third price group' },
              }),
            }),
          ],
        }),
        'fi'
      )
    ).toEqual([
      {
        label: 'First price group 0,00 €',
        price: 0,
        value: '1',
      },
      {
        label: 'Second price group 12,00 €',
        price: 12,
        value: '2',
      },
      {
        label: 'Third price group 1,20 €',
        price: 1.2,
        value: '3',
      },
    ]);
  });
});
