import * as Yup from 'yup';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import {
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../utils/mockDataUtils';
import { mockNumberString, mockString } from '../../../utils/testUtils';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { TEST_PRICE_GROUP_ID } from '../../priceGroup/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import { NOTIFICATIONS } from '../constants';
import {
  ContactPersonFormFields,
  SignupFormFields,
  SignupGroupFormFields,
} from '../types';
import {
  getContactPersonSchema,
  getSignupGroupSchema,
  getSignupSchema,
  isAboveMinAge,
  isBelowMaxAge,
} from '../validation';

const validSignup: SignupFormFields = {
  city: 'City',
  dateOfBirth: new Date('2000-01-01'),
  extraInfo: '',
  firstName: 'first name',
  id: null,
  inWaitingList: true,
  lastName: 'last name',
  phoneNumber: '0441234567',
  priceGroup: '',
  streetAddress: 'Street address',
  zipcode: '00100',
};

const validContactPerson: ContactPersonFormFields = {
  email: 'test@email.com',
  firstName: 'First name',
  id: null,
  lastName: 'Last name',
  membershipNumber: 'xxx',
  nativeLanguage: 'fi',
  notifications: [NOTIFICATIONS.EMAIL],
  phoneNumber: '0441234567',
  serviceLanguage: 'fi',
};

afterEach(() => {
  vi.useRealTimers();
});

const testAboveMinAge = async (
  minAge: number,
  date: Date | null,
  startTime: string | null = null
) => {
  try {
    await Yup.date()
      .nullable()
      .test(
        'isAboveMinAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
          min: minAge,
        }),
        (date) => isAboveMinAge(date, startTime, minAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testBelowMaxAge = async (
  maxAge: number,
  date: Date | null,
  startTime: string | null = null
) => {
  try {
    await Yup.date()
      .nullable()
      .test(
        'isBelowMaxAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
          max: maxAge,
        }),
        (date) => isBelowMaxAge(date, startTime, maxAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testContactPersonSchema = async (
  registration: RegistrationFieldsFragment,
  signups: SignupFormFields[],
  contactPerson: ContactPersonFormFields
) => {
  try {
    await getContactPersonSchema(registration, signups).validate(contactPerson);
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

  test('should return true if value is null', async () => {
    const result = await testAboveMinAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is less than min age in start time', async () => {
    const result = await testAboveMinAge(
      9,
      new Date('2022-01-01'),
      '2022-12-12'
    );

    expect(result).toBe(false);
  });

  test('should return false if age is less than min age', async () => {
    const result = await testAboveMinAge(9, new Date('2022-01-01'));

    expect(result).toBe(false);
  });

  test('should return true if age is greater than min age', async () => {
    const result = await testAboveMinAge(9, new Date('2012-01-01'));

    expect(result).toBe(true);
  });

  test('should return true if age is greater than min age in start time', async () => {
    const result = await testAboveMinAge(
      9,
      new Date('2012-12-11'),
      '2022-12-12'
    );

    expect(result).toBe(true);
  });
});

describe('isBelowMaxAge function', () => {
  beforeEach(() => {
    vi.setSystemTime('2022-10-10');
  });

  test('should return true if value is null', async () => {
    const result = await testBelowMaxAge(9, null);

    expect(result).toBe(true);
  });

  test('should return false if age is greater than max age in start time', async () => {
    const result = await testBelowMaxAge(
      9,
      new Date('2015-01-01'),
      '2025-10-10'
    );

    expect(result).toBe(false);
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

describe('getContactPersonSchema function', () => {
  const registration = fakeRegistration();
  const signups: SignupFormFields[] = [];

  test('should return true if contact person is valid', async () => {
    expect(
      await testContactPersonSchema(registration, signups, validContactPerson)
    ).toBe(true);
  });

  const testCases: [Partial<ContactPersonFormFields>][] = [
    [{ email: '' }],
    [{ email: `${mockString(255)}@email.com` }],
    [{ email: 'not-email' }],
    [{ phoneNumber: '', notifications: [NOTIFICATIONS.SMS] }],
    [{ phoneNumber: 'xxx', notifications: [NOTIFICATIONS.SMS] }],
    [{ phoneNumber: mockNumberString(19), notifications: [NOTIFICATIONS.SMS] }],
    [{ firstName: mockString(51) }],
    [{ lastName: mockString(51) }],
    [{ notifications: [] }],
    [{ membershipNumber: mockString(51) }],
    [{ serviceLanguage: '' }],
  ];

  it.each(testCases)(
    'should return false if contact person is invalid, %s',
    async (contactPersonOverrides) => {
      expect(
        await testContactPersonSchema(registration, signups, {
          ...validContactPerson,
          ...contactPersonOverrides,
        })
      ).toBe(false);
    }
  );

  test('should return true if signup is free and first name is empty', async () => {
    const registration = fakeRegistration({
      registrationPriceGroups: [
        fakeRegistrationPriceGroup({ id: 1, price: '0.00' }),
      ],
    });
    const signups: SignupFormFields[] = [{ ...validSignup, priceGroup: '1' }];
    expect(
      await testContactPersonSchema(registration, signups, {
        ...validContactPerson,
        firstName: '',
      })
    ).toBe(true);
  });

  test('should return false if payment is required and first name is empty', async () => {
    const registration = fakeRegistration({
      registrationPriceGroups: [
        fakeRegistrationPriceGroup({ id: 1, price: '12.00' }),
      ],
    });
    const signups: SignupFormFields[] = [{ ...validSignup, priceGroup: '1' }];
    expect(
      await testContactPersonSchema(registration, signups, {
        ...validContactPerson,
        firstName: '',
      })
    ).toBe(false);
  });

  test('should return true if signup is free and last name is empty', async () => {
    const registration = fakeRegistration({
      registrationPriceGroups: [
        fakeRegistrationPriceGroup({ id: 1, price: '0.00' }),
      ],
    });
    const signups: SignupFormFields[] = [{ ...validSignup, priceGroup: '1' }];
    expect(
      await testContactPersonSchema(registration, signups, {
        ...validContactPerson,
        lastName: '',
      })
    ).toBe(true);
  });

  test('should return false if payment is required and last name is empty', async () => {
    const registration = fakeRegistration({
      registrationPriceGroups: [
        fakeRegistrationPriceGroup({ id: 1, price: '12.00' }),
      ],
    });
    const signups: SignupFormFields[] = [{ ...validSignup, priceGroup: '1' }];
    expect(
      await testContactPersonSchema(registration, signups, {
        ...validContactPerson,
        lastName: '',
      })
    ).toBe(false);
  });
});

describe('signupSchema function', () => {
  const registration = fakeRegistration({
    registrationPriceGroups: [
      fakeRegistrationPriceGroup({ id: TEST_PRICE_GROUP_ID }),
    ],
  });
  const validSignup: SignupFormFields = {
    city: 'City',
    dateOfBirth: new Date('2000-01-01'),
    extraInfo: '',
    firstName: 'first name',
    id: null,
    inWaitingList: true,
    lastName: 'last name',
    phoneNumber: '0441234567',
    priceGroup: TEST_PRICE_GROUP_ID.toString(),
    streetAddress: 'Street address',
    zipcode: '00100',
  };

  test('should return true if signup is valid', async () => {
    expect(await testSignupSchema(registration, validSignup)).toBe(true);
  });

  test('should return false if price group is missing', async () => {
    expect(
      await testSignupSchema(registration, { ...validSignup, priceGroup: '' })
    ).toBe(false);
  });

  test("should return false if price group is missing but registration doesn't have any price group", async () => {
    expect(
      await testSignupSchema(
        fakeRegistration({ registrationPriceGroups: [] }),
        { ...validSignup, priceGroup: '' }
      )
    ).toBe(true);
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

  const testCases: [Partial<SignupFormFields>][] = [
    [{ city: '' }],
    [{ city: mockString(51) }],
    [{ firstName: '' }],
    [{ firstName: mockString(51) }],
    [{ lastName: '' }],
    [{ lastName: mockString(51) }],
    [{ phoneNumber: '' }],
    [{ phoneNumber: 'xxx' }],
    [{ streetAddress: '' }],
    [{ streetAddress: mockString(501) }],
    [{ zipcode: '' }],
    [{ zipcode: '123456' }],
    [{ zipcode: mockString(11) }],
  ];

  it.each(testCases)(
    'should return false if signup is invalid, %s',
    async (signupOverrides) => {
      expect(
        await testSignupSchema(
          fakeRegistration({
            mandatoryFields: [
              REGISTRATION_MANDATORY_FIELDS.CITY,
              REGISTRATION_MANDATORY_FIELDS.FIRST_NAME,
              REGISTRATION_MANDATORY_FIELDS.LAST_NAME,
              REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER,
              REGISTRATION_MANDATORY_FIELDS.STREET_ADDRESS,
              REGISTRATION_MANDATORY_FIELDS.ZIPCODE,
            ],
          }),
          {
            ...validSignup,
            ...signupOverrides,
          }
        )
      ).toBe(false);
    }
  );
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
