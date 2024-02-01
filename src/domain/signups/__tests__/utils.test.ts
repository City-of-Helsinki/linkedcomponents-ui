import {
  AttendeeStatus,
  SignupsQueryVariables,
} from '../../../generated/graphql';
import { fakeRegistration, fakeSignup } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { TEST_SIGNUP_ID } from '../../signup/constants';
import { TEST_SIGNUP_GROUP_ID } from '../../signupGroup/constants';
import { getSignupFields, signupsPathBuilder } from '../utils';

describe('getSignupFields function', () => {
  it('should return default values if value is not set', () => {
    const {
      contactPersonEmail,
      contactPersonPhoneNumber,
      firstName,
      id,
      lastName,
      phoneNumber,
    } = getSignupFields({
      language: 'fi',
      registration: fakeRegistration(),
      signup: fakeSignup({
        contactPerson: {
          email: null,
          firstName: null,
          lastName: null,
          id: '',
          phoneNumber: null,
        },
        firstName: null,
        id: '',
        lastName: null,
        phoneNumber: null,
      }),
    });

    expect(contactPersonEmail).toBe('');
    expect(contactPersonPhoneNumber).toBe('');
    expect(firstName).toBe('');
    expect(id).toBe('');
    expect(lastName).toBe('');
    expect(phoneNumber).toBe('');
  });

  it('should return correct signupfields', () => {
    expect(
      getSignupFields({
        language: 'fi',
        registration: fakeRegistration({ id: TEST_REGISTRATION_ID }),
        signup: fakeSignup({
          contactPerson: {
            email: 'contact@email.com',
            firstName: 'Contact person first name',
            lastName: 'Contact person last name',
            id: '',
            phoneNumber: '0401234567',
          },
          firstName: 'First name',
          id: TEST_SIGNUP_ID,
          lastName: 'Last name',
          phoneNumber: '0407654321',
          signupGroup: TEST_SIGNUP_GROUP_ID,
        }),
      })
    ).toEqual({
      attendeeStatus: 'attending',
      contactPersonEmail: 'contact@email.com',
      contactPersonPhoneNumber: '0401234567',
      firstName: 'First name',
      fullName: 'First name Last name',
      id: 'signup:0',
      lastName: 'Last name',
      phoneNumber: '0407654321',
      signupGroup: 'signupgroup:1',
      signupGroupUrl:
        '/fi/registrations/registration:0/signup-group/edit/signupgroup:1',
      signupUrl: '/fi/registrations/registration:0/signup/edit/signup:0',
    });
  });
});

describe('signupsPathBuilder function', () => {
  const cases: [SignupsQueryVariables, string][] = [
    [
      { attendeeStatus: AttendeeStatus.Attending },
      `/signup/?attendee_status=attending`,
    ],
    [{ page: 2 }, `/signup/?page=2`],
    [{ pageSize: 10 }, `/signup/?page_size=10`],
    [
      { registration: [registrationId] },
      `/signup/?registration=${registrationId}`,
    ],
    [{ text: 'text' }, `/signup/?text=text`],
  ];

  it.each(cases)(
    'should create signups request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(signupsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
