import { mockString } from '../../../utils/testUtils';
import { TEST_EVENT_ID } from '../../event/constants';
import {
  REGISTRATION_ACCOUNT_FIELDS,
  REGISTRATION_FIELDS,
  REGISTRATION_INITIAL_VALUES,
  REGISTRATION_MERCHANT_FIELDS,
} from '../constants';
import { RegistrationFormFields } from '../types';
import { getFocusableFieldId, registrationSchema } from '../validation';

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

describe('getFocusableFieldId', () => {
  it.each([
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE, 'audienceMaxAge'],
    [REGISTRATION_FIELDS.EVENT, 'event-input'],
    [
      REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE,
      'registrationPriceGroupsVatPercentage-toggle-button',
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_ACCOUNT}.${REGISTRATION_ACCOUNT_FIELDS.ACCOUNT}`,
      'registrationAccount.account-toggle-button',
    ],
    [
      `${REGISTRATION_FIELDS.REGISTRATION_MERCHANT}.${REGISTRATION_MERCHANT_FIELDS.MERCHANT}`,
      'registrationMerchant.merchant-toggle-button',
    ],
  ])('should return corrent field id', (fieldName, expectedId) => {
    expect(getFocusableFieldId(fieldName)).toBe(expectedId);
  });
});
