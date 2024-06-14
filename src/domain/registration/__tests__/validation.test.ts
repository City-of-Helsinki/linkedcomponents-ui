import { mockString } from '../../../utils/testUtils';
import { TEST_EVENT_ID } from '../../event/constants';
import {
  REGISTRATION_ACCOUNT_FIELDS,
  REGISTRATION_FIELDS,
  REGISTRATION_INITIAL_VALUES,
  REGISTRATION_MERCHANT_FIELDS,
  REGISTRATION_PRICE_GROUP_FIELDS,
  REGISTRATION_USER_ACCESS_FIELDS,
} from '../constants';
import { RegistrationFormFields } from '../types';
import {
  getFocusableRegistrationFieldId,
  registrationSchema,
} from '../validation';

const testRegistrationSchema = async (registration: RegistrationFormFields) => {
  try {
    await registrationSchema.validate(registration);
    return true;
  } catch (e) {
    return false;
  }
};

afterEach(() => {
  vi.useRealTimers();
});

describe('registrationSchema', () => {
  const validRegistrationAccount = {
    account: '1',
    balanceProfitCenter: '1723',
    companyCode: '1947',
    internalOrder: '',
    mainLedgerAccount: '3503',
    operationArea: '',
    profitCenter: '',
    project: '',
  };
  const validRegistrationValues: RegistrationFormFields = {
    ...REGISTRATION_INITIAL_VALUES,

    enrolmentEndTimeDate: new Date('2023-01-01'),
    enrolmentEndTimeTime: '15:00',
    enrolmentStartTimeDate: new Date('2023-01-01'),
    enrolmentStartTimeTime: '15:00',
    event: TEST_EVENT_ID,
    maximumAttendeeCapacity: 50,
    registrationAccount: validRegistrationAccount,
    registrationMerchant: {
      merchant: '1',
    },
    registrationPriceGroupsVatPercentage: '24.00',
  };

  const validPriceGroup = {
    id: 1,
    priceGroup: '1',
    price: '10.00',
  };

  beforeEach(() => {
    vi.setSystemTime('2022-11-07');
  });

  it('should return true if registration is valid', async () => {
    expect(await testRegistrationSchema(validRegistrationValues)).toBe(true);
  });

  it.each([
    [{ audienceMaxAge: -1 }],
    [{ audienceMinAge: -1 }],
    [{ audienceMaxAge: 14, audienceMinAge: 15 }],

    [{ enrolmentEndTimeDate: null }],
    [{ enrolmentEndTimeTime: '' }],
    [{ enrolmentStartTimeDate: null }],
    [{ enrolmentStartTimeTime: '' }],
    [
      {
        enrolmentEndTimeDate: new Date('2023-01-01'),
        enrolmentEndTimeTime: '09:00',
        enrolmentStartTimeDate: new Date('2023-01-01'),
        enrolmentStartTimeTime: '15:00',
      },
    ],
    [{ event: '' }],
    [{ maximumAttendeeCapacity: '' }],
    [{ maximumAttendeeCapacity: -1 }],
    [{ minimumAttendeeCapacity: -1 }],
    [{ maximumAttendeeCapacity: 14, minimumAttendeeCapacity: 15 }],
    [{ maximumGroupSize: 0 }],
    [{ waitingListCapacity: -1 }],
  ] as Partial<RegistrationFormFields>[])(
    'should return false if registration is invalid',
    async (registrationFields) => {
      expect(
        await testRegistrationSchema({
          ...validRegistrationValues,
          ...registrationFields,
        })
      ).toBe(false);
    }
  );

  it.each([
    [{ email: '', id: null, isSubstituteUser: false, language: '' }, false],
    [
      {
        email: 'invalid@',
        id: null,
        isSubstituteUser: false,
        language: '',
      },
      false,
    ],
    [
      {
        email: 'user@email.com',
        id: null,
        isSubstituteUser: false,
        language: '',
      },
      true,
    ],
    [
      {
        email: 'invalid@email.com',
        id: null,
        isSubstituteUser: true,
        language: '',
      },
      false,
    ],
    [
      {
        email: 'user@hel.fi',
        id: null,
        isSubstituteUser: true,
        language: '',
      },
      true,
    ],
  ])(
    'should validate registration user access email, %s returns %s',

    async (registrationUserAccess, isValid) => {
      expect(
        await testRegistrationSchema({
          ...validRegistrationValues,
          registrationUserAccesses: [registrationUserAccess],
        })
      ).toBe(isValid);
    }
  );

  it('should return true if registration price group is valid', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationPriceGroups: [validPriceGroup],
      })
    ).toBe(true);
  });

  it('should return true if price of free registration price group is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        priceGroupOptions: [
          {
            isFree: true,
            label: 'Price group option',
            value: validPriceGroup.id.toString(),
          },
        ],
        hasPrice: true,
        registrationPriceGroups: [{ ...validPriceGroup, price: '' }],
      })
    ).toBe(true);
  });

  it('should return false if price of registration price group is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationPriceGroups: [{ ...validPriceGroup, price: '' }],
      })
    ).toBe(false);
  });

  it('should return false if priceGroup of registration price group is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationPriceGroups: [{ ...validPriceGroup, priceGroup: '' }],
      })
    ).toBe(false);
  });

  it('should return false if vatPercentage is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationPriceGroups: [validPriceGroup],
        registrationPriceGroupsVatPercentage: '',
      })
    ).toBe(false);
  });

  it.each([
    [{ account: '' }],
    [{ balanceProfitCenter: '' }],
    [{ balanceProfitCenter: mockString(11) }],
    [{ companyCode: '' }],
    [{ companyCode: mockString(5) }],
    [{ internalOrder: mockString(11) }],
    [{ mainLedgerAccount: '' }],
    [{ mainLedgerAccount: mockString(7) }],
    [{ operationArea: mockString(7) }],
    [{ profitCenter: mockString(8) }],
    [{ project: mockString(17) }],
  ])('should return false if account is invalid', async (accountFields) => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,

        hasPrice: true,
        registrationAccount: {
          ...validRegistrationAccount,
          ...accountFields,
        },
        registrationPriceGroups: [validPriceGroup],
      })
    ).toBe(false);
  });

  it('should return false if merchant is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationMerchant: { merchant: '' },
        registrationPriceGroups: [validPriceGroup],
      })
    ).toBe(false);
  });

  it('should not validate price or vatPercentage of free registration price group', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        priceGroupOptions: [{ isFree: true, label: 'Price group', value: '1' }],
        hasPrice: false,
        registrationPriceGroups: [validPriceGroup],
        registrationPriceGroupsVatPercentage: '',
      })
    ).toBe(true);
  });
});

describe('getFocusableRegistrationFieldId', () => {
  it.each([
    [
      REGISTRATION_FIELDS.AUDIENCE_MAX_AGE,
      { fieldId: 'audienceMaxAge', type: 'default' },
    ],
    [REGISTRATION_FIELDS.EVENT, { fieldId: 'event-input', type: 'combobox' }],
    [
      REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE,
      {
        fieldId: 'registrationPriceGroupsVatPercentage-toggle-button',
        type: 'select',
      },
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_ACCOUNT}.${REGISTRATION_ACCOUNT_FIELDS.ACCOUNT}`,
      {
        fieldId: 'registrationAccount.account-toggle-button',
        type: 'select',
      },
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_MERCHANT}.${REGISTRATION_MERCHANT_FIELDS.MERCHANT}`,
      {
        fieldId: 'registrationMerchant.merchant-toggle-button',
        type: 'select',
      },
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}[0].${REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP}`,
      {
        fieldId: 'registrationPriceGroups[0].priceGroup-input',
        type: 'combobox',
      },
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES}[0].${REGISTRATION_USER_ACCESS_FIELDS.LANGUAGE}`,
      {
        fieldId: 'registrationUserAccesses[0].language-toggle-button',
        type: 'select',
      },
    ],
  ])('should return corrent field id', (fieldName, expectedId) => {
    expect(getFocusableRegistrationFieldId(fieldName)).toEqual(expectedId);
  });
});
