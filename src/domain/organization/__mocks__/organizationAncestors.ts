import { MockedResponse } from '@apollo/client/testing';

import { OrganizationsDocument } from '../../../generated/graphql';
import { fakeOrganizations } from '../../../utils/mockDataUtils';
import { MAX_OGRANIZATIONS_PAGE_SIZE, TEST_PUBLISHER_ID } from '../constants';

const organizationAncestorsVariables = {
  child: TEST_PUBLISHER_ID,
  createPath: undefined,
  pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
};

const organizationAncestorsResponse = {
  data: { organizations: fakeOrganizations(0) },
};

const mockedOrganizationAncestorsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationAncestorsVariables,
  },
  result: organizationAncestorsResponse,
  newData: () => organizationAncestorsResponse,
};

export { mockedOrganizationAncestorsResponse };
