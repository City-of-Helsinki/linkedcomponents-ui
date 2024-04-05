import { mockString } from '../../../utils/testUtils';
import {
  WEB_STORE_ACCOUNT_INITIAL_VALUES,
  WEB_STORE_MERCHANT_INITIAL_VALUES,
} from '../constants';
import {
  WebStoreAccountFormFields,
  WebStoreMerchantFormFields,
} from '../types';
import { webStoreAccountSchema, webStoreMerchantSchema } from '../validation';

const testWebStoreAccountSchema = async (
  account: WebStoreAccountFormFields
) => {
  try {
    await webStoreAccountSchema.validate(account);
    return true;
  } catch (e) {
    return false;
  }
};

const testWebStoreMerchantSchema = async (
  merchant: WebStoreMerchantFormFields
) => {
  try {
    await webStoreMerchantSchema.validate(merchant);
    return true;
  } catch (e) {
    return false;
  }
};

describe('webStoreAccountSchema', () => {
  const validAccountValues: WebStoreAccountFormFields = {
    ...WEB_STORE_ACCOUNT_INITIAL_VALUES,
    balanceProfitCenter: '16',
    companyCode: '73',
    mainLedgerAccount: '91',
    vatCode: '11',
  };

  it('should return true if web store account is valid', async () => {
    expect(await testWebStoreAccountSchema(validAccountValues)).toBe(true);
  });

  const testCases: [Partial<WebStoreAccountFormFields>][] = [
    [{ vatCode: '' }],
    [{ vatCode: mockString(3) }],
    [{ companyCode: '' }],
    [{ companyCode: mockString(5) }],
    [{ mainLedgerAccount: '' }],
    [{ mainLedgerAccount: mockString(7) }],
    [{ balanceProfitCenter: '' }],
    [{ balanceProfitCenter: mockString(11) }],
    [{ internalOrder: mockString(11) }],
    [{ profitCenter: mockString(8) }],
    [{ project: mockString(17) }],
    [{ operationArea: mockString(7) }],
  ];
  it.each(testCases)(
    'should return false if account is invalid, %s',
    async (accountOverrides) => {
      expect(
        await testWebStoreAccountSchema({
          ...validAccountValues,
          ...accountOverrides,
        })
      ).toBe(false);
    }
  );
});

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
