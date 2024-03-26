import { WebStoreMerchantFieldsFragment } from '../../../generated/graphql';
import { mockString } from '../../../utils/testUtils';
import { WEB_STORE_MERCHANT_INITIAL_VALUES } from '../constants';
import { WebStoreMerchantFormFields } from '../types';
import { webStoreMerchantSchema } from '../validation';

const testWebStoreMerchantSchema = async (
  merchant: WebStoreMerchantFieldsFragment
) => {
  try {
    await webStoreMerchantSchema.validate(merchant);
    return true;
  } catch (e) {
    return false;
  }
};

describe('webStoreMerchantSchema', () => {
  const validMerchantValues: WebStoreMerchantFormFields = {
    ...WEB_STORE_MERCHANT_INITIAL_VALUES,
    businessId: '1234567',
    city: 'Helsinki',
    email: 'test@email.com',
    name: 'Test merchant',
    paytrailMerchantId: '123',
    phoneNumber: '0401234567',
    streetAddress: 'Test address',
    termsOfServiceUrl: 'https://test.com',
    url: 'https://test.com',
    zipcode: '00100',
  };

  it('should return true if web store merchant is valid', async () => {
    expect(await testWebStoreMerchantSchema(validMerchantValues)).toBe(true);
  });

  const testCases: [Partial<WebStoreMerchantFormFields>][] = [
    [{ name: '' }],
    [{ name: mockString(101) }],
    [{ streetAddress: '' }],
    [{ streetAddress: mockString(501) }],
    [{ zipcode: '' }],
    [{ zipcode: mockString(11) }],
    [{ city: '' }],
    [{ city: mockString(51) }],
    [{ email: '' }],
    [{ email: 'invalid-email' }],
    [{ phoneNumber: '' }],
    [{ phoneNumber: mockString(19) }],
    [{ url: '' }],
    [{ url: 'invalid-url' }],
    [{ termsOfServiceUrl: '' }],
    [{ termsOfServiceUrl: 'invalid-url' }],
    [{ businessId: '' }],
    [{ businessId: mockString(10) }],
    [{ paytrailMerchantId: '' }],
    [{ paytrailMerchantId: mockString(101) }],
  ];
  it.each(testCases)(
    'should return false if merchant is invalid, %s',
    async (merchantOverrides) => {
      expect(
        await testWebStoreMerchantSchema({
          ...validMerchantValues,
          ...merchantOverrides,
        })
      ).toBe(false);
    }
  );
});
