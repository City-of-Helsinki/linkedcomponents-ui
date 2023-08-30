import { advanceTo, clear } from 'jest-date-mock';

import { TEST_EVENT_ID } from '../../event/constants';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import { RegistrationFormFields } from '../types';
import { registrationSchema } from '../validation';

const testRegistrationSchema = async (registration: RegistrationFormFields) => {
  try {
    await registrationSchema.validate(registration);
    return true;
  } catch (e) {
    return false;
  }
};

afterEach(() => {
  clear();
});

describe('registrationSchema', () => {
  const validRegistrationValues: RegistrationFormFields = {
    ...REGISTRATION_INITIAL_VALUES,
    enrolmentEndTimeDate: new Date('2023-01-01'),
    enrolmentEndTimeTime: '15:00',
    enrolmentStartTimeDate: new Date('2023-01-01'),
    enrolmentStartTimeTime: '15:00',
    event: TEST_EVENT_ID,
  };

  beforeEach(() => {
    advanceTo('2022-11-07');
  });

  it('should return true if registration is valid', async () => {
    expect(await testRegistrationSchema(validRegistrationValues)).toBe(true);
  });

  it('should return false if event is missing', async () => {
    expect(
      await testRegistrationSchema({ ...validRegistrationValues, event: '' })
    ).toBe(false);
  });

  it('should return false if enrolment start time is missing', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        enrolmentStartTimeDate: null,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        enrolmentStartTimeTime: '',
      })
    ).toBe(false);
  });

  it('should return false if enrolment end time is missing', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        enrolmentEndTimeDate: null,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        enrolmentEndTimeTime: '',
      })
    ).toBe(false);
  });

  it('should return false if enrolment end time is before start time', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        enrolmentEndTimeTime: '09:00',
      })
    ).toBe(false);
  });

  it('should return false if minimum attendee capacity is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        minimumAttendeeCapacity: -1,
      })
    ).toBe(false);
  });

  it('should return false if maximum attendee capacity is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        maximumAttendeeCapacity: -1,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        maximumAttendeeCapacity: 14,
        minimumAttendeeCapacity: 15,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        maximumAttendeeCapacity: 16,
        minimumAttendeeCapacity: 15,
      })
    ).toBe(true);
  });

  it('should return false if waiting list capacity is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        waitingListCapacity: -1,
      })
    ).toBe(false);
  });

  it('should return false if maximum group size is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        maximumGroupSize: 0,
      })
    ).toBe(false);
  });

  it('should return false if audience min age is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        audienceMinAge: -1,
      })
    ).toBe(false);
  });

  it('should return false if audience max age is invalid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        audienceMaxAge: -1,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        audienceMaxAge: 14,
        audienceMinAge: 15,
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        audienceMaxAge: 16,
        audienceMinAge: 15,
      })
    ).toBe(true);
  });

  it('should return false if registration user access email is invalid or missing', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        registrationUserAccesses: [{ email: '', id: null, language: '' }],
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        registrationUserAccesses: [
          { email: 'invalid@', id: null, language: '' },
        ],
      })
    ).toBe(false);

    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        registrationUserAccesses: [
          { email: 'invalid@email.com', id: null, language: '' },
        ],
      })
    ).toBe(true);
  });
});
