import { MockedResponse } from '@apollo/client/testing';

import {
  OrganizationAccountsDocument,
  OrganizationDocument,
  OrganizationMerchantsDocument,
} from '../../../generated/graphql';
import {
  fakeOrganization,
  fakeWebStoreAccount,
  fakeWebStoreMerchant,
} from '../../../utils/mockDataUtils';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';
import { TEST_ORGANIZATION_CLASS_ID } from '../../organizationClass/constants';
import { EXTERNAL_PUBLISHER_ID, TEST_PUBLISHER_ID } from '../constants';

const dataSource = TEST_DATA_SOURCE_ID;
const organizationClassification = TEST_ORGANIZATION_CLASS_ID;
const organizationId = TEST_PUBLISHER_ID;
const organizationName = 'Organization name';

const organization = fakeOrganization({
  classification: organizationClassification,
  dataSource,
  id: organizationId,
  name: organizationName,
});
const organizationVariables = {
  createPath: undefined,
  id: organizationId,
  dissolved: false,
};
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse: MockedResponse = {
  request: { query: OrganizationDocument, variables: organizationVariables },
  result: organizationResponse,
  newData: () => organizationResponse,
};

const accountPayload = {
  active: false,
  balanceProfitCenter: '738',
  companyCode: '524',
  id: 123,
  internalOrder: '',
  mainLedgerAccount: '971',
  name: 'account',
  operationArea: '',
  profitCenter: '',
  project: '',
};

const merchantPayload = {
  active: false,
  businessId: '12345678',
  city: 'Helsinki',
  email: 'test@email.com',
  id: 123,
  merchantId: 'b85c06a7-b130-4a03-96e6-264edb34e5f9',
  name: 'Merchant name',
  paytrailMerchantId: 'e15f16d6-7157-4841-9bc9-7797da4a4271',
  phoneNumber: '044 1234567',
  streetAddress: 'Street address',
  termsOfServiceUrl: 'https://picsum.photos/seed/IZ2q7OT/640/480',
  zipcode: '00100',
};

const organizationWithFinanfialInfo = fakeOrganization({
  classification: organizationClassification,
  dataSource,
  id: organizationId,
  name: organizationName,
  webStoreAccounts: [fakeWebStoreAccount(accountPayload)],
  webStoreMerchants: [fakeWebStoreMerchant(merchantPayload)],
});
const organizationWithFinanfialInfoResponse = {
  data: { organization: organizationWithFinanfialInfo },
};
const mockedOrganizationWithFinanfialInfoResponse: MockedResponse = {
  request: { query: OrganizationDocument, variables: organizationVariables },
  result: organizationWithFinanfialInfoResponse,
  newData: () => organizationWithFinanfialInfoResponse,
};

const externalOrganization = fakeOrganization({
  classification: organizationClassification,
  dataSource,
  id: EXTERNAL_PUBLISHER_ID,
  name: 'Muu',
});
const externalOrganizationVariables = {
  createPath: undefined,
  id: EXTERNAL_PUBLISHER_ID,
  dissolved: false,
};
const externalOrganizationResponse = { data: { externalOrganization } };
const mockedExternalOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: externalOrganizationVariables,
  },
  result: externalOrganizationResponse,
  newData: () => externalOrganizationResponse,
};

const accountOptions = [
  { label: 'Account 1', value: '1' },
  { label: 'Account 2', value: '2' },
];

const accounts = accountOptions.map((option) =>
  fakeWebStoreAccount({
    ...accountPayload,
    active: true,
    id: Number(option.value),
    name: option.label,
  })
);

const accountsResponse = { data: { organizationAccounts: accounts } };

const accountsVariables = { id: TEST_PUBLISHER_ID };
const mockedOrganizationAccountsResponse = {
  request: {
    query: OrganizationAccountsDocument,
    variables: accountsVariables,
  },
  result: accountsResponse,
};

const merchantOptions = [
  { label: 'Merchant 1', value: '1' },
  { label: 'Merchant 2', value: '2' },
];

const merchants = merchantOptions.map((option) =>
  fakeWebStoreMerchant({
    id: Number(option.value),
    name: option.label,
  })
);

const merchantsResponse = { data: { organizationMerchants: merchants } };

const merchantsVariables = { id: TEST_PUBLISHER_ID };
const mockedOrganizationMerchantsResponse = {
  request: {
    query: OrganizationMerchantsDocument,
    variables: merchantsVariables,
  },
  result: merchantsResponse,
};

export {
  accountOptions,
  accountPayload,
  merchantOptions,
  merchantPayload,
  mockedExternalOrganizationResponse,
  mockedOrganizationAccountsResponse,
  mockedOrganizationMerchantsResponse,
  mockedOrganizationResponse,
  mockedOrganizationWithFinanfialInfoResponse,
  organization,
  organizationClassification,
  organizationId,
  organizationName,
  organizationVariables,
  organizationWithFinanfialInfo,
};
