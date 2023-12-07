import {
  OrganizationFieldsFragment,
  OrganizationsDocument,
} from '../../../generated/graphql';
import generateAtId from '../../../utils/generateAtId';
import { fakeOrganizations } from '../../../utils/mockDataUtils';
import { MAX_OGRANIZATIONS_PAGE_SIZE } from '../../organization/constants';

const organizationId1 = 'organization:1';
const organizationId2 = 'organization:2';
const organizationId3 = 'organization:3';

const organizationsOverrides: Partial<OrganizationFieldsFragment>[] = [
  {
    id: organizationId1,
    name: 'Organization 1',
    parentOrganization: null,
    subOrganizations: [generateAtId(organizationId2, 'organization')],
  },
  {
    id: organizationId2,
    name: 'Organization 2',
    parentOrganization: generateAtId(organizationId1, 'organization'),
  },
  {
    id: organizationId3,
    name: 'Organization 3',
    parentOrganization: null,
  },
];

const organizations = fakeOrganizations(
  organizationsOverrides.length,
  organizationsOverrides
);
const organizationsResponse = { data: { organizations } };
const organizationsVariables = {
  createPath: undefined,
  pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
  dissolved: false,
};
const mockedOrganizationsResponse = {
  request: { query: OrganizationsDocument, variables: organizationsVariables },
  result: organizationsResponse,
};

export { mockedOrganizationsResponse, organizations };
