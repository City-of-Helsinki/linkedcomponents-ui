import {
  OrganizationClassDocument,
  OrganizationClassesDocument,
} from '../../../generated/graphql';
import { fakeOrganizationClasses } from '../../../utils/mockDataUtils';
import {
  MAX_OGRANIZATION_CLASSES_PAGE_SIZE,
  TEST_ORGANIZATION_CLASS_ID,
} from '../constants';

const organizationClassName = 'Organization class name';

const organizationClasses = fakeOrganizationClasses(1, [
  { id: TEST_ORGANIZATION_CLASS_ID, name: organizationClassName },
]);
const organizationClassesResponse = { data: { organizationClasses } };
const organizationClassesVariables = {
  createPath: undefined,
  pageSize: MAX_OGRANIZATION_CLASSES_PAGE_SIZE,
};
const mockedOrganizationClassesResponse = {
  request: {
    query: OrganizationClassesDocument,
    variables: organizationClassesVariables,
  },
  result: organizationClassesResponse,
};

const organizationClass = organizationClasses.data[0];
const organizationClassResponse = { data: { organizationClass } };
const organizationClassVariables = {
  createPath: undefined,
  id: TEST_ORGANIZATION_CLASS_ID,
};
const mockedOrganizationClassResponse = {
  request: {
    query: OrganizationClassDocument,
    variables: organizationClassVariables,
  },
  result: organizationClassResponse,
};

export {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
  organizationClassName,
};
