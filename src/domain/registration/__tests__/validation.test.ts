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
  vi.useRealTimers();
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

  const validPriceGroup = {
    id: 1,
    priceGroup: '1',
    price: '10.00',
    vatPercentage: '24.00',
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

  it('should return false if vatPercentage of registration price group is empty', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        hasPrice: true,
        registrationPriceGroups: [{ ...validPriceGroup, vatPercentage: '' }],
      })
    ).toBe(false);
  });

  it('should validate price or vatPercentage of free registration price group', async () => {
    expect(
      await testRegistrationSchema({
        ...validRegistrationValues,
        priceGroupOptions: [{ isFree: true, label: 'Price group', value: '1' }],
        hasPrice: true,
        registrationPriceGroups: [{ ...validPriceGroup, vatPercentage: '' }],
      })
    ).toBe(false);
  });
});
