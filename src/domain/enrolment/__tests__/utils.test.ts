/* eslint-disable import/no-named-as-default-member */
import { registration } from '../../registration/__mocks__/registration';
import { TEST_SIGNUP_ID } from '../../signup/constants';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../../signupGroup/constants';
import { getUpdateSignupPayload } from '../utils';

describe('getUpdateSignupPayload function', () => {
  it('should return single enrolment as payload', () => {
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
    const payload = getUpdateSignupPayload({
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
