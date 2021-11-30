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
      email,
      extraInfo,
      membershipNumber,
      name,
      notifications,
      phoneNumber,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: null,
        email: null,
        extraInfo: null,
        membershipNumber: null,
        name: null,
        notifications: null,
        phoneNumber: null,
      })
    );

    expect(city).toBe('');
    expect(email).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(name).toBe('');
    expect(notifications).toEqual([]);
    expect(phoneNumber).toBe('');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedName = 'Name';
    const expectedNotifications = [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    const expectedPhoneNumber = '+358 44 123 4567';

    const {
      city,
      email,
      extraInfo,
      membershipNumber,
      name,
      notifications,
      phoneNumber,
    } = getEnrolmentInitialValues(
      fakeEnrolment({
        city: expectedCity,
        email: expectedEmail,
        extraInfo: expectedExtraInfo,
        membershipNumber: expectedMembershipNumber,
        name: expectedName,
        notifications: NOTIFICATION_TYPE.SMS_EMAIL,
        phoneNumber: expectedPhoneNumber,
      })
    );

    expect(city).toBe(expectedCity);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(name).toBe(expectedName);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
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
        email: null,
        extraInfo: '',
        membershipNumber: '',
        name: null,
        notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
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
      notifications: NOTIFICATION_TYPE.EMAIL,
      phoneNumber,
      registration: registration.id,
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
