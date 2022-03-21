import { MockedResponse } from '@apollo/client/testing';

import {
  DeleteOrganizationDocument,
  UpdateOrganizationDocument,
} from '../../../generated/graphql';
import { organizations } from '../../organizations/__mocks__/organizationsPage';
import { users } from '../../user/__mocks__/user';
import { TEST_DATA_SOURCE, TEST_PUBLISHER_ID } from '../constants';
import {
  organization,
  organizationClassification,
  organizationName,
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
  adminUsers: [users.data[0].username],
  affiliatedOrganizations: [],
  classification: organizationClassification,
  internalType: 'normal',
  name: organizationName,
  parentOrganization: '',
  regularUsers: [],
  replacedBy: organizations.data[0].atId,
  subOrganizations: [],
  dataSource: TEST_DATA_SOURCE,
  dissolutionDate: null,
  foundingDate: '2021-01-01',
  id: TEST_PUBLISHER_ID,
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

export {
  mockedDeleteOrganizationResponse,
  mockedInvalidUpdateOrganizationResponse,
  mockedUpdateOrganizationResponse,
};
