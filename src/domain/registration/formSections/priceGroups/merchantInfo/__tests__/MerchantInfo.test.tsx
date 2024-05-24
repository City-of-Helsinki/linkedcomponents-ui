import {
  OrganizationMerchantsDocument,
  WebStoreMerchantFieldsFragment,
} from '../../../../../../generated/graphql';
import { fakeWebStoreMerchant } from '../../../../../../utils/mockDataUtils';
import { render, screen } from '../../../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../../../organization/constants';
import MerchantInfo from '../MerchantInfo';

const id = 1;

const merchantOverrides: Partial<WebStoreMerchantFieldsFragment> = {
  businessId: '12345678',
  city: 'Helsinki',
  email: 'test@email.com',
  id,
  name: 'Merchant 1',
  phoneNumber: '0441234567',
  streetAddress: 'Street address',
  termsOfServiceUrl: 'http://test.com',
  zipcode: '00100',
};
const merchants = [fakeWebStoreMerchant(merchantOverrides)];

const merchantsResponse = { data: { organizationMerchants: merchants } };

const merchantsVariables = { id: TEST_PUBLISHER_ID };
const mockedOrganizationMerchantsResponse = {
  request: {
    query: OrganizationMerchantsDocument,
    variables: merchantsVariables,
  },
  result: merchantsResponse,
};

const mocks = [mockedOrganizationMerchantsResponse];

const renderComponent = () =>
  render(<MerchantInfo id={id.toString()} publisher={TEST_PUBLISHER_ID} />, {
    mocks,
  });

test('should render merchant info', async () => {
  renderComponent();
  const fields = [
    { name: 'Katuosoite', value: merchantOverrides.streetAddress },
    { name: 'Postinumero', value: merchantOverrides.zipcode },
    { name: 'Kaupunki', value: merchantOverrides.city },
    { name: 'Sähköposti', value: merchantOverrides.email },
    { name: 'Puhelinnumero', value: merchantOverrides.phoneNumber },
    { name: 'Palveluehdot URL', value: merchantOverrides.termsOfServiceUrl },
    { name: 'Y-tunnus', value: merchantOverrides.businessId },
  ];

  for (const { name, value } of fields) {
    const el = await screen.findByRole('textbox', { name: name });
    expect(el).toHaveValue(value);
  }
});
