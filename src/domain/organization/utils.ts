import { ApolloClient } from '@apollo/client';

import {
  Organization,
  OrganizationDocument,
  OrganizationFieldsFragment,
  OrganizationQuery,
  OrganizationQueryVariables,
  OrganizationsQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import getPathBuilder from '../../utils/getPathBuilder';
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

export const getOrganizationQueryResult = async (
  id: string,
  apolloClient: ApolloClient<object>
): Promise<Organization | null> => {
  try {
    const { data: organizationData } = await apolloClient.query<
      OrganizationQuery
    >({
      query: OrganizationDocument,
      variables: {
        id,
        createPath: getPathBuilder(organizationPathBuilder),
      },
    });

    return organizationData.organization;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};
