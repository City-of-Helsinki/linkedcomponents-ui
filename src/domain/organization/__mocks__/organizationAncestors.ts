import { MockedResponse } from '@apollo/client/testing';

import { OrganizationsDocument } from '../../../generated/graphql';
import { fakeOrganizations } from '../../../utils/mockDataUtils';
import {
  EXTERNAL_PUBLISHER_ID,
  MAX_OGRANIZATIONS_PAGE_SIZE,
  TEST_PUBLISHER_ID,
} from '../constants';

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

const externalOrganizationAncestorsVariables = {
  child: EXTERNAL_PUBLISHER_ID,
  createPath: undefined,
  pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
};

const externalOrganizationAncestorsResponse = {
  data: { organizations: fakeOrganizations(0) },
};

const mockedExternalOrganizationAncestorsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: externalOrganizationAncestorsVariables,
  },
  result: externalOrganizationAncestorsResponse,
  newData: () => externalOrganizationAncestorsResponse,
};

export {
  mockedExternalOrganizationAncestorsResponse,
  mockedOrganizationAncestorsResponse,
};
