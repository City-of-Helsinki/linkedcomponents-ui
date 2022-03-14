import { MockedResponse } from '@apollo/client/testing';

import { DeleteOrganizationDocument } from '../../../generated/graphql';
import { organization } from './organization';

const deleteOrganizationVariables = { id: organization.id };
const deleteOrganizationResponse = { data: { deleteOrganization: null } };
const mockedDeleteOrganizationResponse: MockedResponse = {
  request: {
    query: DeleteOrganizationDocument,
    variables: deleteOrganizationVariables,
  },
  result: deleteOrganizationResponse,
};

export { mockedDeleteOrganizationResponse };
