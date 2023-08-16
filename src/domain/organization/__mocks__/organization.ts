import { MockedResponse } from '@apollo/client/testing';

import { OrganizationDocument } from '../../../generated/graphql';
import { fakeOrganization } from '../../../utils/mockDataUtils';
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
const organizationVariables = { createPath: undefined, id: organizationId };
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse: MockedResponse = {
  request: { query: OrganizationDocument, variables: organizationVariables },
  result: organizationResponse,
  newData: () => organizationResponse,
};

const externalOrganization = fakeOrganization({
  classification: organizationClassification,
  dataSource,
  id: EXTERNAL_PUBLISHER_ID,
  name: 'Muu',
});
const externalOrganizationVariables = { createPath: undefined, id: 'others' };
const externalOrganizationResponse = { data: { externalOrganization } };
const mockedExternalOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: externalOrganizationVariables,
  },
  result: externalOrganizationResponse,
  newData: () => externalOrganizationResponse,
};

export {
  mockedExternalOrganizationResponse,
  mockedOrganizationResponse,
  organization,
  organizationClassification,
  organizationId,
  organizationName,
  organizationVariables,
};
