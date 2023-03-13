import { advanceTo, clear } from 'jest-date-mock';
import * as Yup from 'yup';

import { AttendeeFields } from '../types';
import { attendeeSchema, isAboveMinAge, isBelowMaxAge } from '../validation';

afterEach(() => {
  clear();
});

const testAboveMinAge = async (minAge: string, date: Date | null) => {
  try {
    await isAboveMinAge([minAge], Yup.date().nullable()).validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testBelowMaxAge = async (maxAge: string, date: Date | null) => {
  try {
    await isBelowMaxAge([maxAge], Yup.date().nullable()).validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testAttendeeSchema = async (attendee: AttendeeFields) => {
  try {
    await attendeeSchema.validate(attendee);
    return true;
  } catch (e) {
    return false;
  }
};

describe('isAboveMinAge function', () => {
  test('should return true value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge('9', null);

    expect(result).toBe(true);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge('9', new Date('2022-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is greater than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge('9', new Date('2012-01-01'));

    expect(result).toBe(true);
  });
});

describe('isBelowMaxAge function', () => {
  test('should return true if value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge('9', null);

    expect(result).toBe(true);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge('9', new Date('2012-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is less than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge('9', new Date('2015-01-01'));

    expect(result).toBe(true);
  });
});

describe('attendeeSchema function', () => {
  const validAttendee: AttendeeFields = {
    audienceMaxAge: null,
    audienceMinAge: null,
    city: 'City',
    dateOfBirth: new Date('2000-01-01'),
    extraInfo: '',
    inWaitingList: true,
    name: 'name',
    streetAddress: 'Street address',
    zip: '00100',
  };

  test('should return true if attendee is valid', async () => {
    expect(await testAttendeeSchema(validAttendee)).toBe(true);
  });

  test('should return false if name is missing', async () => {
    expect(await testAttendeeSchema({ ...validAttendee, name: '' })).toBe(
      false
    );
  });

  test('should return false if street address is missing', async () => {
    expect(
      await testAttendeeSchema({ ...validAttendee, streetAddress: '' })
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testAttendeeSchema({ ...validAttendee, dateOfBirth: null })
    ).toBe(false);
  });

  test('should return false if zip is missing', async () => {
    expect(await testAttendeeSchema({ ...validAttendee, zip: '' })).toBe(false);
  });

  test('should return false if zip is invalid', async () => {
    expect(await testAttendeeSchema({ ...validAttendee, zip: '123456' })).toBe(
      false
    );
  });

  test('should return false if city is missing', async () => {
    expect(await testAttendeeSchema({ ...validAttendee, city: '' })).toBe(
      false
    );
  });
});
