import { advanceTo, clear } from 'jest-date-mock';
import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import { AttendeeFields } from '../types';
import { getAttendeeSchema, isAboveMinAge, isBelowMaxAge } from '../validation';

afterEach(() => {
  clear();
});

const testAboveMinAge = async (minAge: number, date: Date | null) => {
  try {
    await Yup.date()
      .nullable()
      .test(
        'isAboveMinAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
          min: minAge,
        }),
        (date) => isAboveMinAge(date, minAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testBelowMaxAge = async (maxAge: number, date: Date | null) => {
  try {
    await Yup.date()
      .nullable()
      .test(
        'isBelowMaxAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
          max: maxAge,
        }),
        (date) => isBelowMaxAge(date, maxAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testAttendeeSchema = async (
  registration: RegistrationFieldsFragment,
  attendee: AttendeeFields
) => {
  try {
    await getAttendeeSchema(registration).validate(attendee);
    return true;
  } catch (e) {
    return false;
  }
};

describe('isAboveMinAge function', () => {
  test('should return true value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, new Date('2022-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is greater than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, new Date('2012-01-01'));

    expect(result).toBe(true);
  });
});

describe('isBelowMaxAge function', () => {
  test('should return true if value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, new Date('2012-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is less than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, new Date('2015-01-01'));

    expect(result).toBe(true);
  });
});

describe('attendeeSchema function', () => {
  const registration = fakeRegistration();
  const validAttendee: AttendeeFields = {
    city: 'City',
    dateOfBirth: new Date('2000-01-01'),
    extraInfo: '',
    inWaitingList: true,
    name: 'name',
    streetAddress: 'Street address',
    zipcode: '00100',
  };

  test('should return true if attendee is valid', async () => {
    expect(await testAttendeeSchema(registration, validAttendee)).toBe(true);
  });

  test('should return false if name is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.NAME],
        }),
        { ...validAttendee, name: '' }
      )
    ).toBe(false);
  });

  test('should return false if street address is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.STREET_ADDRESS],
        }),
        { ...validAttendee, streetAddress: '' }
      )
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMinAge: 8 }), {
        ...validAttendee,
        dateOfBirth: null,
      })
    ).toBe(false);

    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMaxAge: 12 }), {
        ...validAttendee,
        dateOfBirth: null,
      })
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMinAge: 8 }), {
        ...validAttendee,
        dateOfBirth: null,
      })
    ).toBe(false);

    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMaxAge: 12 }), {
        ...validAttendee,
        dateOfBirth: null,
      })
    ).toBe(false);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMaxAge: 8 }), {
        ...validAttendee,
        dateOfBirth: new Date('2012-01-01'),
      })
    ).toBe(false);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testAttendeeSchema(fakeRegistration({ audienceMinAge: 5 }), {
        ...validAttendee,
        dateOfBirth: new Date('2022-01-01'),
      })
    ).toBe(false);
  });

  test('should return false if city is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.CITY],
        }),
        { ...validAttendee, city: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.ZIPCODE],
        }),
        { ...validAttendee, zipcode: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is invalid', async () => {
    expect(
      await testAttendeeSchema(registration, {
        ...validAttendee,
        zipcode: '123456',
      })
    ).toBe(false);
  });
});
