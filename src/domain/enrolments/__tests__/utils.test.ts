import {
  AttendeeStatus,
  EnrolmentsQueryVariables,
} from '../../../generated/graphql';
import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { registrationId } from '../../registration/__mocks__/registration';
import { attendees, waitingAttendees } from '../__mocks__/enrolmentsPage';
import {
  enrolmentsPathBuilder,
  filterEnrolments,
  getEnrolmentFields,
} from '../utils';

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

describe('filterEnrolments function', () => {
  const enrolments = [...attendees, ...waitingAttendees];

  test('should return only attendees', () => {
    const filteredEnrolments = filterEnrolments({
      enrolments,
      query: {
        attendeeStatus: AttendeeStatus.Attending,
        registration: registrationId,
      },
    });

    expect(filteredEnrolments).toEqual(attendees);
    expect(filteredEnrolments).not.toContain(waitingAttendees);
  });

  test('should return only waiting list attendees', () => {
    const filteredEnrolments = filterEnrolments({
      enrolments,
      query: {
        attendeeStatus: AttendeeStatus.Waitlisted,
        registration: registrationId,
      },
    });

    expect(filteredEnrolments).toEqual(waitingAttendees);
    expect(filteredEnrolments).not.toContain(attendees);
  });

  test('should filter attendees by name text', () => {
    const filteredEnrolments = filterEnrolments({
      enrolments,
      query: { registration: registrationId, text: waitingAttendees[0].name },
    });

    expect(filteredEnrolments).toEqual([waitingAttendees[0]]);
  });

  test('should filter attendees by email text', () => {
    const filteredEnrolments = filterEnrolments({
      enrolments,
      query: { registration: registrationId, text: waitingAttendees[0].email },
    });

    expect(filteredEnrolments).toEqual([waitingAttendees[0]]);
  });

  test('should filter attendees by phone number text', () => {
    const filteredEnrolments = filterEnrolments({
      enrolments,
      query: {
        registration: registrationId,
        text: waitingAttendees[0].phoneNumber,
      },
    });

    expect(filteredEnrolments).toEqual([waitingAttendees[0]]);
  });
});
