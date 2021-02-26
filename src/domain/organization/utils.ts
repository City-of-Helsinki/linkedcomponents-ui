import {
  OrganizationFieldsFragment,
  OrganizationQueryVariables,
  OrganizationsQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';
import { OrganizationFields } from './types';

export const organizationPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationQueryVariables>) => {
  const { id } = args;

  return `/organization/${id}/`;
};

export const organizationsPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationsQueryVariables>) => {
  const { child } = args;

  const variableToKeyItems = [{ key: 'child', value: child }];

  const query = queryBuilder(variableToKeyItems);

  return `/organization/${query}`;
};

export const getOrganizationFields = (
  organization: OrganizationFieldsFragment
): OrganizationFields => ({
  name: organization.name || '',
});
