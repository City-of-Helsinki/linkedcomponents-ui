import {
  AttendeeStatus,
  EnrolmentsQueryVariables,
} from '../../../generated/graphql';
import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { enrolmentsPathBuilder, getEnrolmentFields } from '../utils';

describe('getEnrolmentFields function', () => {
  it('should return default values if value is not set', () => {
    const { email, id, name, phoneNumber } = getEnrolmentFields({
      enrolment: fakeEnrolment({
        email: null,
        name: null,
        id: '',
        phoneNumber: null,
      }),
      language: 'fi',
      registration: fakeRegistration(),
    });

    expect(email).toBe('');
    expect(id).toBe('');
    expect(name).toBe('');
    expect(phoneNumber).toBe('');
  });
});

describe('enrolmentsPathBuilder function', () => {
  const cases: [EnrolmentsQueryVariables, string][] = [
    [
      {
        attendeeStatus: AttendeeStatus.Attending,
        registration: registrationId,
      },
      `/registration/${registrationId}/signup/?attendee_status=attending`,
    ],
    [
      { registration: registrationId },
      `/registration/${registrationId}/signup/`,
    ],
    [
      { registration: registrationId, text: 'text' },
      `/registration/${registrationId}/signup/?text=text`,
    ],
  ];

  it.each(cases)(
    'should create enrolments request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(enrolmentsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
