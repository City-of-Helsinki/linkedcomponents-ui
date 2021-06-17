import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

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
  UserFieldsFragment,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import { OrganizationFields } from './types';

export const organizationPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationQueryVariables>): string => {
  const { id } = args;

  return `/organization/${id}/`;
};

export const organizationsPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationsQueryVariables>): string => {
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
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<Organization | null> => {
  try {
    const { data: organizationData } =
      await apolloClient.query<OrganizationQuery>({
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

export const isAdminUserInOrganization = ({
  id,
  organizationAncestors,
  user,
}: {
  id: string | null;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean => {
  const adminOrganizations = user?.adminOrganizations ?? [];

  return Boolean(
    id &&
      (adminOrganizations.includes(id) ||
        adminOrganizations.some((adminOrgId) =>
          organizationAncestors.map((org) => org.id).includes(adminOrgId)
        ))
  );
};

export const isReqularUserInOrganization = ({
  id,
  user,
}: {
  id: string | null;
  user?: UserFieldsFragment;
}): boolean => {
  const organizationMemberships = user?.organizationMemberships ?? [];

  return Boolean(id && organizationMemberships.includes(id));
};

export const getOrganizationAncestorsQueryResult = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<Organization[]> => {
  try {
    if (!id) {
      return [];
    }

    const { data: organizationsData } =
      await apolloClient.query<OrganizationsQuery>({
        query: OrganizationsDocument,
        variables: {
          child: id as string,
          createPath: getPathBuilder(organizationsPathBuilder),
          pageSize: MAX_PAGE_SIZE,
        },
      });

    return organizationsData.organizations.data as OrganizationFieldsFragment[];
  } catch (e) {
    return [];
  }
};
