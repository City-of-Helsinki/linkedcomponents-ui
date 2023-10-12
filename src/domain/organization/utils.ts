import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';
import omit from 'lodash/omit';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { DATE_FORMAT_API, ROUTES } from '../../constants';
import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../envVariables';
import {
  CreateOrganizationMutationInput,
  OrganizationDocument,
  OrganizationFieldsFragment,
  OrganizationQuery,
  OrganizationQueryVariables,
  OrganizationsDocument,
  OrganizationsQuery,
  OrganizationsQueryVariables,
  UpdateOrganizationMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
import {
  AUTHENTICATION_NOT_NEEDED,
  MAX_OGRANIZATIONS_PAGE_SIZE,
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
  const name = getValue(organization.name, '');

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
  const id = getValue(organization.id, '');

  return {
    affiliatedOrganizations: getValue(
      organization.affiliatedOrganizations?.filter(skipFalsyType),
      []
    ),
    atId: getValue(organization.atId, ''),
    classification: getValue(organization.classification, ''),
    dataSource: getValue(organization.dataSource, ''),
    foundingDate: getDateFromString(organization.foundingDate),
    fullName: getOrganizationFullName(organization, t),
    id: getValue(organization.id, ''),
    name: getValue(organization.name, ''),
    organizationUrl: `/${locale}${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`,
    originId: getValue(id.split(':')[1], ''),
    parentOrganization: getValue(organization.parentOrganization, null),
    subOrganizations: getValue(
      organization.subOrganizations?.filter(skipFalsyType),
      []
    ),
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
export const hasAdminOrganization = (user?: UserFieldsFragment): boolean =>
  !!user?.adminOrganizations.length;

export const hasRegistrationAdminOrganization = (
  user?: UserFieldsFragment
): boolean => !!user?.registrationAdminOrganizations.length;

const _isAdminUserInOrganization = ({
  adminOrganizations,
  id,
  organizationAncestors,
}: {
  adminOrganizations: string[];
  id: string | null;
  organizationAncestors: OrganizationFieldsFragment[];
}) => {
  return Boolean(
    id &&
      (adminOrganizations.includes(id) ||
        adminOrganizations.some((adminOrgId) =>
          organizationAncestors.map((org) => org.id).includes(adminOrgId)
        ))
  );
};

export const isAdminUserInOrganization = ({
  id,
  organizationAncestors,
  user,
}: {
  id: string | null;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean =>
  _isAdminUserInOrganization({
    adminOrganizations: getValue(user?.adminOrganizations, []),
    id,
    organizationAncestors,
  });

export const isRegistrationAdminUserInOrganization = ({
  id,
  organizationAncestors,
  user,
}: {
  id: string | null;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean =>
  _isAdminUserInOrganization({
    adminOrganizations: getValue(user?.registrationAdminOrganizations, []),
    id,
    organizationAncestors,
  });

export const isReqularUserInOrganization = ({
  id,
  user,
}: {
  id: string | null;
  user?: UserFieldsFragment;
}): boolean => {
  const organizationMemberships: string[] = getValue(
    user?.organizationMemberships,
    []
  );

  return Boolean(id && organizationMemberships.includes(id));
};

export const isExternalUserWithoutOrganization = ({
  user,
}: {
  user?: UserFieldsFragment;
}): boolean => {
  return Boolean(user?.isExternal);
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
          child: id,
          createPath: getPathBuilder(organizationsPathBuilder),
          pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
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
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  id: string;
  user?: UserFieldsFragment;
}): boolean => {
  /* istanbul ignore next */
  const isAdminUser = isAdminUserInOrganization({
    id,
    organizationAncestors: [],
    user,
  });
  const adminOrganizations = getValue(user?.adminOrganizations, []);

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
  t,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  authenticated: boolean;
  id: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    id,
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
  t,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  authenticated: boolean;
  id: string;
  onClick: () => void;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    id,
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
  const id = getValue(organization.id, '');
  const { dissolutionDate, foundingDate } = organization;

  return {
    adminUsers: getValue(organization.adminUsers, []).map((o) =>
      getValue(o?.username, '')
    ),
    affiliatedOrganizations: getValue(
      organization.affiliatedOrganizations?.filter(skipFalsyType),
      []
    ),
    classification: getValue(organization.classification, ''),
    dataSource: getValue(organization.dataSource, ''),
    dissolutionDate: getDateFromString(dissolutionDate),
    foundingDate: getDateFromString(foundingDate),
    id,
    internalType: organization.isAffiliated
      ? ORGANIZATION_INTERNAL_TYPE.AFFILIATED
      : ORGANIZATION_INTERNAL_TYPE.NORMAL,
    name: getValue(organization.name, ''),
    originId: getValue(id.split(':')[1], ''),
    parentOrganization: getValue(organization.parentOrganization, ''),
    registrationAdminUsers: getValue(
      organization.registrationAdminUsers,
      []
    ).map((o) => getValue(o?.username, '')),
    regularUsers: getValue(organization.regularUsers, []).map((o) =>
      getValue(o?.username, '')
    ),
    replacedBy: '',
    subOrganizations: getValue(
      organization.subOrganizations?.filter(skipFalsyType),
      []
    ),
  };
};

export const getOrganizationPayload = (
  formValues: OrganizationFormFields
): CreateOrganizationMutationInput => {
  const {
    adminUsers,
    dissolutionDate,
    foundingDate,
    id,
    originId,
    parentOrganization,
    regularUsers,
    ...restFormValues
  } = formValues;

  const dataSource = formValues.dataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;

  return {
    ...restFormValues,
    adminUsers,
    dataSource,
    dissolutionDate: dissolutionDate
      ? formatDate(dissolutionDate, DATE_FORMAT_API)
      : null,
    foundingDate: foundingDate
      ? formatDate(foundingDate, DATE_FORMAT_API)
      : null,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    originId,
    parentOrganization: parentOrganization || undefined,
    regularUsers,
  };
};

export const omitSensitiveDataFromOrganizationPayload = (
  payload: CreateOrganizationMutationInput | UpdateOrganizationMutationInput
): Partial<CreateOrganizationMutationInput | UpdateOrganizationMutationInput> =>
  omit(payload, ['adminUsers', 'registrationAdminUsers', 'regularUsers']);
