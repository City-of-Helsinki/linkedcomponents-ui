import { MockedResponse } from '@apollo/client/testing';

import { CreateOrganizationDocument } from '../../../generated/graphql';
import { fakeOrganization } from '../../../utils/mockDataUtils';

const organizationValues = {
  dataSource: 'helsinki',
  name: 'Organization name',
  originId: '123',
};

const payload = {
  adminUsers: [],
  affiliatedOrganizations: [],
  classification: '',
  internalType: '',
  name: organizationValues.name,
  parentOrganization: '',
  regularUsers: [],
  replacedBy: '',
  subOrganizations: [],
  dataSource: organizationValues.dataSource,
  dissolutionDate: null,
  foundingDate: null,
  id: `${organizationValues.dataSource}:${organizationValues.originId}`,
};

const createOrganizationVariables = { input: payload };

const createOrganizationResponse = {
  data: { createOrganization: fakeOrganization() },
};

const mockedCreateOrganizationResponse: MockedResponse = {
  request: {
    query: CreateOrganizationDocument,
    variables: createOrganizationVariables,
  },
  result: createOrganizationResponse,
};

const mockedInvalidCreateOrganizationResponse: MockedResponse = {
  request: {
    query: CreateOrganizationDocument,
    variables: createOrganizationVariables,
  },
  error: {
    ...new Error(),
    result: { name: ['Tämän kentän arvo ei voi olla "null".'] },
  } as Error,
};

export {
  mockedCreateOrganizationResponse,
  mockedInvalidCreateOrganizationResponse,
  organizationValues,
};
