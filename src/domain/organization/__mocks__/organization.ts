import { MockedResponse } from '@apollo/client/testing';

import { OrganizationDocument } from '../../../generated/graphql';
import { fakeOrganization } from '../../../utils/mockDataUtils';
import { TEST_DATA_SOURCE, TEST_PUBLISHER_ID } from '../constants';

const dataSource = TEST_DATA_SOURCE;
const organizationClassification = 'ahjo:1';
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

export {
  mockedOrganizationResponse,
  organization,
  organizationClassification,
  organizationId,
  organizationName,
};
