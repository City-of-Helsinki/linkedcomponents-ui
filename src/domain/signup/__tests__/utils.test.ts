import {
  CreateSignupsMutationInput,
  SignupInput,
} from '../../../generated/graphql';
import {
  fakeRegistrationPriceGroup,
  fakeSignup,
} from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../../signupGroup/constants';
import { TEST_CONTACT_PERSON_ID, TEST_SIGNUP_ID } from '../constants';
import {
  getCreateSignupsPayload,
  getSignupGroupInitialValuesFromSignup,
  getUpdateSignupPayload,
  omitSensitiveDataFromSignupPayload,
  omitSensitiveDataFromSignupsPayload,
} from '../utils';

const signupPayload: SignupInput = {
  city: 'Helsinki',
  contactPerson: {
    email: 'test@email.com',
    firstName: 'First name',
    lastName: 'Last name',
    membershipNumber: 'XYZ',
    nativeLanguage: 'fi',
    notifications: NOTIFICATION_TYPE.EMAIL,
    phoneNumber: '0441234567',
    serviceLanguage: 'fi',
  },
  dateOfBirth: '1999-10-10',
  extraInfo: 'Signup entra info',
  firstName: 'First name',
  id: '1',
  lastName: 'Last name',
  streetAddress: 'Address',
  zipcode: '123456',
};

const city = 'City',
  contactPersonFirstName = 'Contact first name',
  contactPersonLastName = 'Contact last name',
  dateOfBirth = new Date('1999-10-10'),
  email = 'Email',
  extraInfo = 'Extra info',
  firstName = 'First name',
  lastName = 'Last name',
  membershipNumber = 'XXX-123',
  nativeLanguage = 'fi',
  notifications = [NOTIFICATIONS.EMAIL],
  phoneNumber = '0441234567',
  priceGroup = '12',
  serviceLanguage = 'sv',
  streetAddress = 'Street address',
  zipcode = '00100';

describe('getCreateSignupPayload function', () => {
  const reservationCode = 'reservation-code';
  const signups = [
    {
      city,
      dateOfBirth,
      extraInfo,
      firstName,
      id: null,
      inWaitingList: false,
      lastName,
      phoneNumber,
      priceGroup,
      streetAddress,
      zipcode,
    },
  ];

  it('should return create signup payload for free event', () => {
    const payload = getCreateSignupsPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        contactPerson: {
          email,
          firstName: contactPersonFirstName,
          id: null,
          lastName: contactPersonLastName,
          membershipNumber,
          nativeLanguage,
          notifications,
          phoneNumber,
          serviceLanguage,
        },
        extraInfo: '',
        signups,
      },
      registration,
      reservationCode,
    });

    expect(payload).toEqual({
      registration: registration.id,
      reservationCode,
      signups: [
        {
          city,
          contactPerson: {
            email,
            firstName: contactPersonFirstName,
            id: null,
            lastName: contactPersonLastName,
            membershipNumber,
            nativeLanguage,
            notifications: NOTIFICATION_TYPE.EMAIL,
            phoneNumber,
            serviceLanguage,
          },
          dateOfBirth: '1999-10-10',
          extraInfo,
          firstName,
          lastName,
          phoneNumber,
          priceGroup: {
            registrationPriceGroup: priceGroup,
          },
          streetAddress,
          zipcode,
        },
      ],
    });
  });

  it('should return create signup payload for not free event', () => {
    const payload = getCreateSignupsPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        contactPerson: {
          email,
          firstName: contactPersonFirstName,
          id: null,
          lastName: contactPersonLastName,
          membershipNumber,
          nativeLanguage,
          notifications,
          phoneNumber,
          serviceLanguage,
        },
        extraInfo: '',
        signups,
      },
      registration: {
        ...registration,
        registrationPriceGroups: [
          fakeRegistrationPriceGroup({
            id: Number(priceGroup),
            price: '10.00',
          }),
        ],
      },
      reservationCode,
    });

    expect(payload).toEqual({
      registration: registration.id,
      reservationCode,
      signups: [
        {
          city,
          contactPerson: {
            email,
            firstName: contactPersonFirstName,
            id: null,
            lastName: contactPersonLastName,
            membershipNumber,
            nativeLanguage,
            notifications: NOTIFICATION_TYPE.EMAIL,
            phoneNumber,
            serviceLanguage,
          },
          createPayment: true,
          dateOfBirth: '1999-10-10',
          extraInfo,
          firstName,
          lastName,
          phoneNumber,
          priceGroup: {
            registrationPriceGroup: priceGroup,
          },
          streetAddress,
          zipcode,
        },
      ],
    });
  });
});

describe('getUpdateSignupPayload function', () => {
  it('should return update signup payload for initial values', () => {
    expect(
      getUpdateSignupPayload({
        formValues: SIGNUP_GROUP_INITIAL_VALUES,
        hasSignupGroup: false,
        id: TEST_SIGNUP_ID,
        registration,
      })
    ).toEqual({
      city: '',
      contactPerson: {
        email: null,
        id: null,
        firstName: '',
        lastName: '',
        membershipNumber: '',
        nativeLanguage: null,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: null,
        serviceLanguage: null,
      },
      dateOfBirth: null,
      extraInfo: '',
      firstName: '',
      id: TEST_SIGNUP_ID,
      lastName: '',
      phoneNumber: '',
      registration: registration.id,
      streetAddress: null,
      zipcode: null,
    });
  });

  it('contactPerson should be null if hasSignupGroup is true', () => {
    const { contactPerson } = getUpdateSignupPayload({
      formValues: SIGNUP_GROUP_INITIAL_VALUES,
      hasSignupGroup: true,
      id: TEST_SIGNUP_ID,
      registration,
    });
    expect(contactPerson).toBe(undefined);
  });

  it('should return update signup payload', () => {
    const signups = [
      {
        city,
        dateOfBirth,
        extraInfo,
        firstName,
        id: null,
        inWaitingList: false,
        lastName,
        phoneNumber,
        priceGroup,
        streetAddress,
        zipcode,
      },
    ];

    const payload = getUpdateSignupPayload({
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
        extraInfo: '',
        signups,
      },
      hasSignupGroup: false,
      id: TEST_SIGNUP_ID,
      registration,
    });

    expect(payload).toEqual({
      city,
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
      dateOfBirth: '1999-10-10',
      extraInfo,
      firstName,
      id: TEST_SIGNUP_ID,
      lastName,
      phoneNumber,
      priceGroup: {
        registrationPriceGroup: priceGroup,
      },
      registration: registration.id,
      streetAddress,
      zipcode,
    });
  });
});

describe('getSignupGroupInitialValuesFromSignup function', () => {
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
    } = getSignupGroupInitialValuesFromSignup(
      fakeSignup({
        city: null,
        contactPerson: {
          email: null,
          firstName: null,
          id: TEST_CONTACT_PERSON_ID,
          membershipNumber: null,
          nativeLanguage: null,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: null,
          serviceLanguage: null,
        },
        dateOfBirth: null,
        extraInfo: null,
        firstName: null,
        id: TEST_SIGNUP_ID,
        lastName: null,
        phoneNumber: null,
        streetAddress: null,
        zipcode: null,
      })
    );

    expect(signups).toEqual([
      {
        city: '',
        dateOfBirth: null,
        extraInfo: '',
        firstName: '',
        id: TEST_SIGNUP_ID,
        inWaitingList: false,
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
    const expectedFirstName = 'First name';
    const expectedLastName = 'Last name';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL];
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedPriceGroup = '1';
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
    } = getSignupGroupInitialValuesFromSignup(
      fakeSignup({
        city: expectedCity,
        contactPerson: {
          email: expectedEmail,
          id: TEST_CONTACT_PERSON_ID,
          membershipNumber: expectedMembershipNumber,
          nativeLanguage: expectedNativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phoneNumber: expectedPhoneNumber,
          serviceLanguage: expectedServiceLanguage,
        },
        dateOfBirth: '2021-10-10',
        extraInfo: expectedExtraInfo,
        firstName: expectedFirstName,
        id: TEST_SIGNUP_ID,
        lastName: expectedLastName,
        phoneNumber: expectedPhoneNumber,
        priceGroup: { registrationPriceGroup: 1 },
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      })
    );

    expect(signups).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: expectedExtraInfo,
        firstName: expectedFirstName,
        id: TEST_SIGNUP_ID,
        inWaitingList: false,
        lastName: expectedLastName,
        phoneNumber: expectedPhoneNumber,
        priceGroup: expectedPriceGroup,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      },
    ]);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
  });
});

describe('omitSensitiveDataFromSignupPayload', () => {
  it('should omit sensitive data from payload', () => {
    const filteredPayload = omitSensitiveDataFromSignupPayload(
      signupPayload
    ) as SignupInput;
    expect(filteredPayload).toEqual({
      contactPerson: {
        notifications: NOTIFICATION_TYPE.EMAIL,
      },
      id: '1',
    });
  });

  it('contact person should be null if its not defined', () => {
    const payload: SignupInput = {
      ...signupPayload,
      contactPerson: null,
    };

    const { contactPerson } = omitSensitiveDataFromSignupPayload(payload);
    expect(contactPerson).toBe(null);
  });
});

describe('omitSensitiveDataFromSignupsPayload', () => {
  it('should omit sensitive data from payload', () => {
    const payload: CreateSignupsMutationInput = {
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [signupPayload, { ...signupPayload, id: '2' }],
    };

    const filteredPayload = omitSensitiveDataFromSignupsPayload(payload);

    expect(filteredPayload).toEqual({
      registration: registration.id,
      reservationCode: 'xxx',
      signups: [
        {
          contactPerson: { notifications: NOTIFICATION_TYPE.EMAIL },
          id: '1',
        },
        {
          contactPerson: { notifications: NOTIFICATION_TYPE.EMAIL },
          id: '2',
        },
      ],
    });
  });
});
