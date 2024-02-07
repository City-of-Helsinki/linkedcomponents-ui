import { MockedResponse } from '@apollo/client/testing';

import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../../envVariables';
import { CreateOrganizationDocument } from '../../../generated/graphql';
import { fakeOrganization } from '../../../utils/mockDataUtils';
import { TEST_ORGANIZATION_CLASS_ID } from '../../organizationClass/constants';
import { organizations } from '../../organizations/__mocks__/organizationsPage';
import { ORGANIZATION_INTERNAL_TYPE } from '../constants';

const organizationValues = {
  classification: TEST_ORGANIZATION_CLASS_ID,
  dataSource: LINKED_EVENTS_SYSTEM_DATA_SOURCE,
  name: 'Organization name',
  originId: '123',
};

const payload = {
  adminUsers: [],
  affiliatedOrganizations: [],
  classification: organizationValues.classification,
  dataSource: organizationValues.dataSource,
  financialAdminUsers: [],
  internalType: ORGANIZATION_INTERNAL_TYPE.NORMAL,
  name: organizationValues.name,
  parentOrganization: organizations.data[0]?.atId,
  registrationAdminUsers: [],
  regularUsers: [],
  replacedBy: '',
  subOrganizations: [],
  dissolutionDate: null,
  foundingDate: null,
  id: `${organizationValues.dataSource}:${organizationValues.originId}`,
  originId: organizationValues.originId,
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
