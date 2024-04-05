import { MockedResponse } from '@apollo/client/testing';

import {
  DeleteOrganizationDocument,
  PatchOrganizationDocument,
  UpdateOrganizationDocument,
} from '../../../generated/graphql';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';
import { organizations } from '../../organizations/__mocks__/organizationsPage';
import { users } from '../../user/__mocks__/user';
import { TEST_PUBLISHER_ID } from '../constants';
import {
  merchantPayload,
  organization,
  organizationClassification,
  organizationName,
  organizationWithMerchant,
} from './organization';

const deleteOrganizationVariables = { id: organization.id };
const deleteOrganizationResponse = { data: { deleteOrganization: null } };
const mockedDeleteOrganizationResponse: MockedResponse = {
  request: {
    query: DeleteOrganizationDocument,
    variables: deleteOrganizationVariables,
  },
  result: deleteOrganizationResponse,
};

const payload = {
  adminUsers: [users.data[0]?.username],
  affiliatedOrganizations: [],
  classification: organizationClassification,
  financialAdminUsers: [],
  internalType: 'normal',
  name: organizationName,
  parentOrganization: undefined,
  registrationAdminUsers: [],
  regularUsers: [],
  replacedBy: organizations.data[0]?.atId,
  subOrganizations: [],
  dataSource: TEST_DATA_SOURCE_ID,
  dissolutionDate: null,
  foundingDate: '2021-01-01',
  id: TEST_PUBLISHER_ID,
  originId: '1',
  webStoreMerchants: [],
};

const updateOrganizationVariables = { input: payload };

const updateOrganizationResponse = {
  data: { updateOrganization: organization },
};

const mockedUpdateOrganizationResponse: MockedResponse = {
  request: {
    query: UpdateOrganizationDocument,
    variables: updateOrganizationVariables,
  },
  result: updateOrganizationResponse,
};

const mockedInvalidUpdateOrganizationResponse: MockedResponse = {
  request: {
    query: UpdateOrganizationDocument,
    variables: updateOrganizationVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

const patchPayload = {
  webStoreMerchants: [merchantPayload],
};

const patchOrganizationWithMerchantVariables = {
  id: TEST_PUBLISHER_ID,
  input: patchPayload,
};

const patchOrganizationWithMerchantResponse = {
  data: { patchOrganization: organizationWithMerchant },
};

const mockedPatchOrganizationWithMerchantResponse: MockedResponse = {
  request: {
    query: PatchOrganizationDocument,
    variables: patchOrganizationWithMerchantVariables,
  },
  result: patchOrganizationWithMerchantResponse,
};

export {
  mockedDeleteOrganizationResponse,
  mockedInvalidUpdateOrganizationResponse,
  mockedPatchOrganizationWithMerchantResponse,
  mockedUpdateOrganizationResponse,
};
