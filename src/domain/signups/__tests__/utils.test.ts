import {
  AttendeeStatus,
  SignupsQueryVariables,
} from '../../../generated/graphql';
import { fakeRegistration, fakeSignup } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { enrolmentsPathBuilder, getEnrolmentFields } from '../utils';

describe('getEnrolmentFields function', () => {
  it('should return default values if value is not set', () => {
    const { email, firstName, id, lastName, phoneNumber } = getEnrolmentFields({
      enrolment: fakeSignup({
        email: null,
        firstName: null,
        id: '',
        lastName: null,
        phoneNumber: null,
      }),
      language: 'fi',
      registration: fakeRegistration(),
    });

    expect(email).toBe('');
    expect(firstName).toBe('');
    expect(id).toBe('');
    expect(lastName).toBe('');
    expect(phoneNumber).toBe('');
  });
});

describe('enrolmentsPathBuilder function', () => {
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
    'should create enrolments request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(enrolmentsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
