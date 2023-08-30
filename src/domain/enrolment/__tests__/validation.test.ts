import { advanceTo, clear } from 'jest-date-mock';
import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import { NOTIFICATIONS } from '../constants';
import { EnrolmentFormFields, SignupFields } from '../types';
import {
  getEnrolmentSchema,
  getSignupSchema,
  isAboveMinAge,
  isBelowMaxAge,
} from '../validation';

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

const testSignupSchema = async (
  registration: RegistrationFieldsFragment,
  signup: SignupFields
) => {
  try {
    await getSignupSchema(registration).validate(signup);
    return true;
  } catch (e) {
    return false;
  }
};

const testEnrolmentSchema = async (
  registration: RegistrationFieldsFragment,
  enrolment: EnrolmentFormFields
) => {
  try {
    await getEnrolmentSchema(registration).validate(enrolment);
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

describe('signupSchema function', () => {
  const registration = fakeRegistration();
  const validSignup: SignupFields = {
    city: 'City',
    dateOfBirth: new Date('2000-01-01'),
    extraInfo: '',
    firstName: 'first name',
    inWaitingList: true,
    lastName: 'last name',
    streetAddress: 'Street address',
    zipcode: '00100',
  };

  test('should return true if signup is valid', async () => {
    expect(await testSignupSchema(registration, validSignup)).toBe(true);
  });

  test('should return false if first name is missing', async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.FIRST_NAME],
        }),
        { ...validSignup, firstName: '' }
      )
    ).toBe(false);
  });

  test('should return false if last name is missing', async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.LAST_NAME],
        }),
        { ...validSignup, lastName: '' }
      )
    ).toBe(false);
  });

  test('should return false if street address is missing', async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.STREET_ADDRESS],
        }),
        { ...validSignup, streetAddress: '' }
      )
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testSignupSchema(fakeRegistration({ audienceMinAge: 8 }), {
        ...validSignup,
        dateOfBirth: null,
      })
    ).toBe(false);

    expect(
      await testSignupSchema(fakeRegistration({ audienceMaxAge: 12 }), {
        ...validSignup,
        dateOfBirth: null,
      })
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testSignupSchema(fakeRegistration({ audienceMinAge: 8 }), {
        ...validSignup,
        dateOfBirth: null,
      })
    ).toBe(false);

    expect(
      await testSignupSchema(fakeRegistration({ audienceMaxAge: 12 }), {
        ...validSignup,
        dateOfBirth: null,
      })
    ).toBe(false);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testSignupSchema(fakeRegistration({ audienceMaxAge: 8 }), {
        ...validSignup,
        dateOfBirth: new Date('2012-01-01'),
      })
    ).toBe(false);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testSignupSchema(fakeRegistration({ audienceMinAge: 5 }), {
        ...validSignup,
        dateOfBirth: new Date('2022-01-01'),
      })
    ).toBe(false);
  });

  test('should return false if city is missing', async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.CITY],
        }),
        { ...validSignup, city: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is missing', async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({
          mandatoryFields: [REGISTRATION_MANDATORY_FIELDS.ZIPCODE],
        }),
        { ...validSignup, zipcode: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is invalid', async () => {
    expect(
      await testSignupSchema(registration, {
        ...validSignup,
        zipcode: '123456',
      })
    ).toBe(false);
  });
});

describe('testEnrolmentSchema function', () => {
  const registration = fakeRegistration();
  const validEnrolment: EnrolmentFormFields = {
    email: 'user@email.com',
    extraInfo: '',
    membershipNumber: '',
    nativeLanguage: 'fi',
    notifications: [NOTIFICATIONS.EMAIL],
    phoneNumber: '',
    serviceLanguage: 'fi',
    signups: [],
  };

  test('should return true if enrolment data is valid', async () => {
    expect(await testEnrolmentSchema(registration, validEnrolment)).toBe(true);
  });

  test('should return false if email is missing', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        email: '',
      })
    ).toBe(false);
  });

  test('should return false if email is invalid', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        email: 'user@email.',
      })
    ).toBe(false);
  });

  test('should return false if phone number is missing', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        phoneNumber: '',
        notifications: [NOTIFICATIONS.SMS],
      })
    ).toBe(false);
  });

  test('should return false if phone number is invalid', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        phoneNumber: 'xxx',
      })
    ).toBe(false);
  });

  test('should return false if notifications is empty array', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        notifications: [],
      })
    ).toBe(false);
  });

  test('should return false if native language is empty', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        nativeLanguage: '',
      })
    ).toBe(false);
  });

  test('should return false if service language is empty', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        serviceLanguage: '',
      })
    ).toBe(false);
  });

  test('should return false if membership number is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatoryFields: ['membership_number'] }),
        {
          ...validEnrolment,
          membershipNumber: '',
        }
      )
    ).toBe(false);
  });

  test('should return false if extra info is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatoryFields: ['extra_info'] }),
        {
          ...validEnrolment,
          extraInfo: '',
        }
      )
    ).toBe(false);
  });

  test('should return false if phone number is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatoryFields: ['phone_number'] }),
        {
          ...validEnrolment,
          phoneNumber: '',
        }
      )
    ).toBe(false);
  });
});
