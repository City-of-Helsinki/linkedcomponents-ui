import { mockString } from '../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { PRICE_GROUP_INITIAL_VALUES } from '../constants';
import { PriceGroupFormFields } from '../types';
import { priceGroupSchema } from '../validation';

const testPriceGroupSchema = async (priceGroup: PriceGroupFormFields) => {
  try {
    await priceGroupSchema.validate(priceGroup);
    return true;
  } catch (e) {
    return false;
  }
};

describe('priceGroupSchema', () => {
  const validPriceGroupValues: PriceGroupFormFields = {
    ...PRICE_GROUP_INITIAL_VALUES,
    publisher: TEST_PUBLISHER_ID,
    description: {
      ...PRICE_GROUP_INITIAL_VALUES.description,
      fi: 'Description',
    },
  };

  it('should return true if price group is valid', async () => {
    expect(await testPriceGroupSchema(validPriceGroupValues)).toBe(true);
  });

  it('should return false if is publisher is empty', async () => {
    expect(
      await testPriceGroupSchema({ ...validPriceGroupValues, publisher: '' })
    ).toBe(false);
  });

  it('should return false if Finnish description is missing', async () => {
    expect(
      await testPriceGroupSchema({
        ...validPriceGroupValues,
        description: { ...validPriceGroupValues.description, fi: '' },
      })
    ).toBe(false);
  });

  it('should return true if Finnish description is 255 characters long', async () => {
    expect(
      await testPriceGroupSchema({
        ...validPriceGroupValues,
        description: {
          ...validPriceGroupValues.description,
          fi: mockString(255),
        },
      })
    ).toBe(true);
  });

  it('should return false if description longer than 255 characters', async () => {
    expect(
      await testPriceGroupSchema({
        ...validPriceGroupValues,
        description: {
          ...validPriceGroupValues.description,
          sv: mockString(256),
        },
      })
    ).toBe(false);
  });

  it('should return true if description is 255 characters long', async () => {
    expect(
      await testPriceGroupSchema({
        ...validPriceGroupValues,
        description: {
          ...validPriceGroupValues.description,
          sv: mockString(255),
        },
      })
    ).toBe(true);
  });
});
