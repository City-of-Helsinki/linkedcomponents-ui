import {
  AttendeeStatus,
  EnrolmentsQueryVariables,
} from '../../../generated/graphql';
import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { enrolmentsPathBuilder, getEnrolmentFields } from '../utils';

describe('getEnrolmentFields function', () => {
  it('should return default values if value is not set', () => {
    const { email, id, name, phoneNumber } = getEnrolmentFields({
      enrolment: fakeEnrolment({
        email: null,
        name: null,
        id: null,
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
      { attendeeStatus: AttendeeStatus.Attending },
      '/signup/?attendee_status=attending',
    ],
    [{ events: ['event:1', 'event:2'] }, '/signup/?events=event:1,event:2'],
    [
      { registrations: ['registration:1', 'registration:2'] },
      '/signup/?registrations=registration:1,registration:2',
    ],
    [{ text: 'text' }, '/signup/?text=text'],
  ];

  it.each(cases)(
    'should create enrolments request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(enrolmentsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
