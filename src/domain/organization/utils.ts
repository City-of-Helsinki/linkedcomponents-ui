import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

import { MAX_PAGE_SIZE, ROUTES } from '../../constants';
import {
  OrganizationDocument,
  OrganizationFieldsFragment,
  OrganizationQuery,
  OrganizationQueryVariables,
  OrganizationsDocument,
  OrganizationsQuery,
  OrganizationsQueryVariables,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
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
  const { child, page, pageSize } = args;

  const variableToKeyItems = [
    { key: 'child', value: child },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/organization/${query}`;
};

export const getOrganizationFullName = (
  organization: OrganizationFieldsFragment,
  t: TFunction
): string => {
  const name = organization.name ?? '';
  if (organization.dissolutionDate) {
    return `${name} (${t('common.dissolved')})`;
  } else if (organization.isAffiliated) {
    return `${name} (${t('common.affiliate')})`;
  }
  return name;
};

export const getOrganizationFields = (
  organization: OrganizationFieldsFragment,
  locale: Language,
  t: TFunction
): OrganizationFields => {
  const id = organization.id ?? '';

  return {
    affiliatedOrganizations: organization.affiliatedOrganizations as string[],
    classification: organization.classification ?? '',
    dataSource: organization.dataSource ?? '',
    fullName: getOrganizationFullName(organization, t),
    id: organization.id ?? '',
    name: organization.name ?? '',
    organizationUrl: `/${locale}${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`,
    parentOrganization: organization.parentOrganization ?? null,
    subOrganizations: organization.subOrganizations as string[],
  };
};

export const getOrganizationQueryResult = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<OrganizationFieldsFragment | null> => {
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
): Promise<OrganizationFieldsFragment[]> => {
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
