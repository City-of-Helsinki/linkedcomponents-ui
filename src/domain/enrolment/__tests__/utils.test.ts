import { EnrolmentQueryVariables } from '../../../generated/graphql';
import { fakeEnrolment } from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import { ENROLMENT_INITIAL_VALUES, NOTIFICATIONS } from '../constants';
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
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      notificationLanguage,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      yearOfBirth,
      zip,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: null,
        email: null,
        extraInfo: null,
        membershipNumber: null,
        name: null,
        nativeLanguage: null,
        notifications: null,
        notificationLanguage: null,
        phoneNumber: null,
        serviceLanguage: null,
        streetAddress: null,
        yearOfBirth: null,
        zip: null,
      })
    );

    expect(city).toBe('');
    expect(email).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(name).toBe('');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([]);
    expect(notificationLanguage).toBe('');
    expect(phoneNumber).toBe('');
    expect(serviceLanguage).toBe('');
    expect(streetAddress).toBe('');
    expect(yearOfBirth).toBe('');
    expect(zip).toBe('');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedName = 'Name';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    const expectedNotificationLanguage = 'sv';
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedServiceLanguage = 'en';
    const expectedStreetAddress = 'Street address';
    const expectedYearOfBirth = '2021';
    const expectedZip = '00100';

    const {
      city,
      email,
      extraInfo,
      membershipNumber,
      name,
      nativeLanguage,
      notifications,
      notificationLanguage,
      phoneNumber,
      serviceLanguage,
      streetAddress,
      yearOfBirth,
      zip,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: expectedCity,
        email: expectedEmail,
        extraInfo: expectedExtraInfo,
        membershipNumber: expectedMembershipNumber,
        name: expectedName,
        nativeLanguage: expectedNativeLanguage,
        notifications: 3,
        notificationLanguage: expectedNotificationLanguage,
        phoneNumber: expectedPhoneNumber,
        serviceLanguage: expectedServiceLanguage,
        streetAddress: expectedStreetAddress,
        yearOfBirth: expectedYearOfBirth,
        zip: expectedZip,
      })
    );

    expect(city).toBe(expectedCity);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(name).toBe(expectedName);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(notificationLanguage).toBe(expectedNotificationLanguage);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
    expect(streetAddress).toBe(expectedStreetAddress);
    expect(yearOfBirth).toBe(expectedYearOfBirth);
    expect(zip).toBe(expectedZip);
  });
});

describe('getEnrolmentNotificationTypes function', () => {
  it('should return correct notification types', () => {
    expect(getEnrolmentNotificationTypes(0)).toEqual([]);
    expect(getEnrolmentNotificationTypes(1)).toEqual([NOTIFICATIONS.SMS]);
    expect(getEnrolmentNotificationTypes(2)).toEqual([NOTIFICATIONS.EMAIL]);
    expect(getEnrolmentNotificationTypes(3)).toEqual([
      NOTIFICATIONS.EMAIL,
      NOTIFICATIONS.SMS,
    ]);
    expect(getEnrolmentNotificationTypes(4)).toEqual([]);
  });
});

describe('getEnrolmentNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getEnrolmentNotificationsCode([])).toBe(0);
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.SMS])).toBe(1);
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(2);
    expect(
      getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(3);
  });
});

describe('getEnrolmentPayload function', () => {
  it('should return single event as payload', () => {
    expect(getEnrolmentPayload(ENROLMENT_INITIAL_VALUES, registration)).toEqual(
      {
        city: null,
        email: null,
        extraInfo: null,
        membershipNumber: null,
        name: null,
        notifications: 0,
        phoneNumber: null,
        registration: registration.id,
      }
    );

    const city = 'City',
      email = 'Email',
      extraInfo = 'Extra info',
      membershipNumber = 'XXX-123',
      name = 'Name',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567';
    const payload = getEnrolmentPayload(
      {
        ...ENROLMENT_INITIAL_VALUES,
        city,
        email,
        extraInfo,
        membershipNumber,
        name,
        notifications,
        phoneNumber,
      },
      registration
    );

    expect(payload).toEqual({
      city,
      email,
      extraInfo,
      membershipNumber,
      name,
      notifications: 2,
      phoneNumber,
      registration: registration.id,
    });
  });
});

describe('enrolmentPathBuilder function', () => {
  const cases: [EnrolmentQueryVariables, string][] = [
    [{ id: 'hel:123' }, '/enrolment/hel:123/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(enrolmentPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
