import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import { NOTIFICATIONS } from '../constants';
import { SignupFormFields, SignupGroupFormFields } from '../types';
import {
  getSignupGroupSchema,
  getSignupSchema,
  isAboveMinAge,
  isBelowMaxAge,
} from '../validation';

afterEach(() => {
  vi.useRealTimers();
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
  signup: SignupFormFields
) => {
  try {
    await getSignupSchema(registration).validate(signup);
    return true;
  } catch (e) {
    return false;
  }
};

const testSignupGroupSchema = async (
  registration: RegistrationFieldsFragment,
  signupGroup: SignupGroupFormFields
) => {
  try {
    await getSignupGroupSchema(registration).validate(signupGroup);
    return true;
  } catch (e) {
    return false;
  }
};

describe('isAboveMinAge function', () => {
  beforeEach(() => {
    vi.setSystemTime('2022-10-10');
  });
  test('should return true value is null', async () => {
    const result = await testAboveMinAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is less than min age', async () => {
    const result = await testAboveMinAge(9, new Date('2022-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is greater than min age', async () => {
    const result = await testAboveMinAge(9, new Date('2012-01-01'));

    expect(result).toBe(true);
  });
});

describe('isBelowMaxAge function', () => {
  test('should return true if value is null', async () => {
    const result = await testBelowMaxAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is greater than max age', async () => {
    const result = await testBelowMaxAge(9, new Date('2012-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is less than max age', async () => {
    const result = await testBelowMaxAge(9, new Date('2015-01-01'));

    expect(result).toBe(true);
  });
});

describe('signupSchema function', () => {
  const registration = fakeRegistration();
  const validSignup: SignupFormFields = {
    city: 'City',
    dateOfBirth: new Date('2000-01-01'),
    extraInfo: '',
    firstName: 'first name',
    id: null,
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
    vi.setSystemTime('2022-10-10');

    expect(
      await testSignupSchema(fakeRegistration({ audienceMaxAge: 8 }), {
        ...validSignup,
        dateOfBirth: new Date('2012-01-01'),
      })
    ).toBe(false);
  });

  test('should return false if age is less than min age', async () => {
    vi.setSystemTime('2022-10-10');

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

describe('signupGroupSchema function', () => {
  const registration = fakeRegistration();
  const validSignupGroup: SignupGroupFormFields = {
    contactPerson: {
      email: 'user@email.com',
      firstName: 'First name',
      id: null,
      lastName: 'Last name',
      membershipNumber: '',
      nativeLanguage: 'fi',
      notifications: [NOTIFICATIONS.EMAIL],
      phoneNumber: '',
      serviceLanguage: 'fi',
    },
    extraInfo: '',
    signups: [],
  };

  test('should return true if signup group data is valid', async () => {
    expect(await testSignupGroupSchema(registration, validSignupGroup)).toBe(
      true
    );
  });

  test('should return false if email is missing', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          email: '',
        },
      })
    ).toBe(false);
  });

  test('should return false if email is invalid', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          email: 'user@email.',
        },
      })
    ).toBe(false);
  });

  test('should return false if phone number is missing', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          phoneNumber: '',
          notifications: [NOTIFICATIONS.SMS],
        },
      })
    ).toBe(false);
  });

  test('should return false if phone number is invalid', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          phoneNumber: 'xxx',
          notifications: [NOTIFICATIONS.SMS],
        },
      })
    ).toBe(false);
  });

  test('should return false if notifications is empty array', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          notifications: [],
        },
      })
    ).toBe(false);
  });

  test('should return false if native language is empty', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          nativeLanguage: '',
        },
      })
    ).toBe(false);
  });

  test('should return false if service language is empty', async () => {
    expect(
      await testSignupGroupSchema(registration, {
        ...validSignupGroup,
        contactPerson: {
          ...validSignupGroup.contactPerson,
          serviceLanguage: '',
        },
      })
    ).toBe(false);
  });

  test('should return false if extra info is set as mandatory field but value is empty', async () => {
    expect(
      await testSignupGroupSchema(
        fakeRegistration({ mandatoryFields: ['extra_info'] }),
        {
          ...validSignupGroup,
          extraInfo: '',
        }
      )
    ).toBe(false);
  });
});
