import { ApolloClient } from '@apollo/client';

import { MAX_PAGE_SIZE } from '../../constants';
import {
  Organization,
  OrganizationDocument,
  OrganizationFieldsFragment,
  OrganizationQuery,
  OrganizationQueryVariables,
  OrganizationsDocument,
  OrganizationsQuery,
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

export const getOrganizationAncestorsQueryResult = async (
  publisher: string,
  apolloClient: ApolloClient<object>
): Promise<Organization[]> => {
  try {
    if (!publisher) {
      return [];
    }

    const { data: organizationsData } = await apolloClient.query<
      OrganizationsQuery
    >({
      query: OrganizationsDocument,
      variables: {
        child: publisher as string,
        createPath: getPathBuilder(organizationsPathBuilder),
        pageSize: MAX_PAGE_SIZE,
      },
    });

    return organizationsData.organizations.data as OrganizationFieldsFragment[];
  } catch (e) {
    return [];
  }
};
