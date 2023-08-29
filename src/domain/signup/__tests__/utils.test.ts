import { fakeSignup } from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../../signupGroup/constants';
import { TEST_SIGNUP_ID } from '../constants';
import {
  getSignupGroupInitialValuesFromSignup,
  getUpdateSignupPayload,
} from '../utils';

describe('getUpdateSignupPayload function', () => {
  it('should return payload to update a signup', () => {
    expect(
      getUpdateSignupPayload({
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
      responsibleForGroup: false,
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
        extraInfo,
        firstName,
        id: null,
        inWaitingList: false,
        lastName,
        responsibleForGroup: true,
        streetAddress,
        zipcode,
      },
    ];
    const payload = getUpdateSignupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        email,
        extraInfo: '',
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
      responsibleForGroup: true,
      serviceLanguage,
      streetAddress,
      zipcode,
    });
  });
});

describe('getSignupGroupInitialValuesFromSignup function', () => {
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
    } = getSignupGroupInitialValuesFromSignup(
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
        notifications: NOTIFICATION_TYPE.EMAIL,
        phoneNumber: null,
        responsibleForGroup: true,
        serviceLanguage: null,
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
        responsibleForGroup: true,
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
    } = getSignupGroupInitialValuesFromSignup(
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
        responsibleForGroup: true,
        serviceLanguage: expectedServiceLanguage,
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
        responsibleForGroup: true,
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
