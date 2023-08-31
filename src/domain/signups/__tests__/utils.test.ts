import {
  AttendeeStatus,
  SignupsQueryVariables,
} from '../../../generated/graphql';
import { fakeRegistration, fakeSignup } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { getSignupFields, signupsPathBuilder } from '../utils';

describe('getSignupFields function', () => {
  it('should return default values if value is not set', () => {
    const { email, firstName, id, lastName, phoneNumber } = getSignupFields({
      language: 'fi',
      registration: fakeRegistration(),
      signup: fakeSignup({
        email: null,
        firstName: null,
        id: '',
        lastName: null,
        phoneNumber: null,
      }),
    });

    expect(email).toBe('');
    expect(firstName).toBe('');
    expect(id).toBe('');
    expect(lastName).toBe('');
    expect(phoneNumber).toBe('');
  });
});

describe('signupsPathBuilder function', () => {
  const cases: [SignupsQueryVariables, string][] = [
    [
      { attendeeStatus: AttendeeStatus.Attending },
      `/signup/?attendee_status=attending`,
    ],
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
