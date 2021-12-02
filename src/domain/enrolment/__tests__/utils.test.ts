import { EnrolmentQueryVariables } from '../../../generated/graphql';
import { fakeEnrolment } from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
} from '../constants';
import {
  enrolmentPathBuilder,
  getEnrolmentInitialValues,
  getEnrolmentNotificationsCode,
  getEnrolmentNotificationTypes,
  getEnrolmentPayload,
} from '../utils';

describe('getEnrolmentInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      city,
      dateOfBirth,
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      zip,
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
      })
    );

    expect(city).toBe('');
    expect(dateOfBirth).toBe(null);
    expect(email).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(name).toBe('');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([]);
    expect(phoneNumber).toBe('');
    expect(serviceLanguage).toBe('');
    expect(streetAddress).toBe('');
    expect(zip).toBe('');
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
      city,
      dateOfBirth,
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      zip,
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
      })
    );

    expect(city).toBe(expectedCity);
    expect(dateOfBirth).toEqual(expectedDateOfBirth);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(name).toBe(expectedName);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
    expect(streetAddress).toBe(expectedStreetAddress);
    expect(zip).toBe(expectedZip);
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
    expect(getEnrolmentPayload(ENROLMENT_INITIAL_VALUES, registration)).toEqual(
      {
        city: null,
        dateOfBirth: null,
        email: null,
        extraInfo: '',
        membershipNumber: '',
        name: null,
        nativeLanguage: null,
        notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
        phoneNumber: null,
        registration: registration.id,
        serviceLanguage: null,
        streetAddress: null,
        zipcode: null,
      }
    );

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
    const payload = getEnrolmentPayload(
      {
        ...ENROLMENT_INITIAL_VALUES,
        city,
        dateOfBirth,
        email,
        extraInfo,
        membershipNumber,
        name,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        streetAddress,
        zip: zipcode,
      },
      registration
    );

    expect(payload).toEqual({
      city,
      dateOfBirth: '1999-10-10',
      email,
      extraInfo,
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
