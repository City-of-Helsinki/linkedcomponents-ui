import { MockedResponse } from '@apollo/client/testing';

import {
  OrganizationFieldsFragment,
  OrganizationsDocument,
} from '../../../generated/graphql';
import { fakeOrganizations } from '../../../utils/mockDataUtils';
import {
  KASKO_ORGANIZATION_ID,
  MAX_OGRANIZATIONS_PAGE_SIZE,
} from '../constants';

const organizationsOverrides: Partial<OrganizationFieldsFragment>[] = [
  {
    id: `${KASKO_ORGANIZATION_ID}1`,
    name: 'Organization 1',
    parentOrganization: null,
    subOrganizations: [],
  },
];

const kaskoOrganizationDecendantsVariables = {
  createPath: undefined,
  pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
  parent: KASKO_ORGANIZATION_ID,
  dissolved: false,
};

const kaskoOrganizationDecendantsResponse = {
  data: {
    organizations: fakeOrganizations(
      organizationsOverrides.length,
      organizationsOverrides
    ),
  },
};

const mockedKaskoOrganizationDecendantsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: kaskoOrganizationDecendantsVariables,
  },
  result: kaskoOrganizationDecendantsResponse,
  newData: () => kaskoOrganizationDecendantsResponse,
};

export { mockedKaskoOrganizationDecendantsResponse };
