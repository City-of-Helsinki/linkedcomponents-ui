import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  LINKED_EVENTS_SYSTEM_DATA_SOURCE,
  MAX_PAGE_SIZE,
  ROUTES,
} from '../../constants';
import {
  CreateOrganizationMutationInput,
  OrganizationDocument,
  OrganizationFieldsFragment,
  OrganizationQuery,
  OrganizationQueryVariables,
  OrganizationsDocument,
  OrganizationsQuery,
  OrganizationsQueryVariables,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import {
  AUTHENTICATION_NOT_NEEDED,
  ORGANIZATION_ACTION_ICONS,
  ORGANIZATION_ACTION_LABEL_KEYS,
  ORGANIZATION_ACTIONS,
  ORGANIZATION_INTERNAL_TYPE,
} from './constants';
import { OrganizationFields, OrganizationFormFields } from './types';

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
    atId: organization.atId ?? '',
    classification: organization.classification ?? '',
    dataSource: organization.dataSource ?? '',
    foundingDate: organization.foundingDate
      ? new Date(organization.foundingDate)
      : null,
    fullName: getOrganizationFullName(organization, t),
    id: organization.id ?? '',
    name: organization.name ?? '',
    organizationUrl: `/${locale}${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`,
    originId: id.split(':')[1] ?? '',
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

export const isInDefaultOrganization = ({
  id,
  user,
}: {
  id: string | null;
  user?: UserFieldsFragment;
}): boolean => {
  const organization = user?.organization;

  return id === organization;
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

export const checkCanUserDoAction = ({
  action,
  id,
  organizationAncestors,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  id: string;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean => {
  /* istanbul ignore next */
  const isAdminUser = isAdminUserInOrganization({
    id,
    organizationAncestors,
    user,
  });
  const adminOrganizations = user?.adminOrganizations || [];

  switch (action) {
    case ORGANIZATION_ACTIONS.EDIT:
      return true;
    case ORGANIZATION_ACTIONS.CREATE:
      return !!adminOrganizations.length;
    case ORGANIZATION_ACTIONS.DELETE:
    case ORGANIZATION_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const getEditOrganizationWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: ORGANIZATION_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateOrganization');
  }

  if (!userCanDoAction) {
    return t('organizationsPage.warningNoRightsToEdit');
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  id,
  organizationAncestors,
  t,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  authenticated: boolean;
  id: string;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    id,
    organizationAncestors,
    user,
  });

  const warning = getEditOrganizationWarning({
    action,
    authenticated,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  id,
  onClick,
  organizationAncestors,
  t,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  authenticated: boolean;
  id: string;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    id,
    organizationAncestors,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: ORGANIZATION_ACTION_ICONS[action],
    label: t(ORGANIZATION_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getOrganizationInitialValues = (
  organization: OrganizationFieldsFragment
): OrganizationFormFields => {
  const id = organization.id ?? '';
  const { dissolutionDate, foundingDate } = organization;
  return {
    adminUsers: organization.adminUsers?.length
      ? organization.adminUsers.map((o) => o?.username as string)
      : [],
    affiliatedOrganizations:
      (organization.affiliatedOrganizations as string[]) ?? [],
    classification: organization.classification ?? '',
    dataSource: organization.dataSource ?? '',
    dissolutionDate: dissolutionDate ? new Date(dissolutionDate) : null,
    foundingDate: foundingDate ? new Date(foundingDate) : null,
    id,
    internalType: organization.isAffiliated
      ? ORGANIZATION_INTERNAL_TYPE.AFFILIATED
      : ORGANIZATION_INTERNAL_TYPE.NORMAL,
    name: organization.name ?? '',
    originId: id.split(':')[1] ?? '',
    parentOrganization: organization.parentOrganization ?? '',
    regularUsers: organization.regularUsers?.length
      ? organization.regularUsers.map((o) => o?.username as string)
      : [],
    replacedBy: '',
    subOrganizations: (organization.subOrganizations as string[]) ?? [],
  };
};

export const getOrganizationPayload = (
  formValues: OrganizationFormFields
): CreateOrganizationMutationInput => {
  const {
    dissolutionDate,
    foundingDate,
    id,
    originId,
    parentOrganization,
    ...restFormValues
  } = formValues;

  const dataSource = formValues.dataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;

  return {
    ...restFormValues,
    dataSource,
    dissolutionDate: dissolutionDate
      ? formatDate(dissolutionDate, 'yyyy-MM-dd')
      : null,
    foundingDate: foundingDate ? formatDate(foundingDate, 'yyyy-MM-dd') : null,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    originId,
    parentOrganization: parentOrganization || undefined,
  };
};

/* istanbul ignore next */
export const clearOrganizationQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: OrganizationQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'organization',
    args,
  });

/* istanbul ignore next */
export const clearOrganizationsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'organizations',
  });
