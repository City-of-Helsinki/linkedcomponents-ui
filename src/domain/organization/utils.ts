import {
  OrganizationFieldsFragment,
  OrganizationQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import { OrganizationFields } from './types';

export const organizationPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationQueryVariables>) => {
  const { id } = args;

  return `/organization/${id}/`;
};

export const getOrganizationFields = (
  organization: OrganizationFieldsFragment
): OrganizationFields => ({
  name: organization.name || '',
});
