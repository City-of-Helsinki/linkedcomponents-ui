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
  WebStoreAccountFieldsFragment,
  WebStoreMerchantFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import { featureFlagUtils } from '../../utils/featureFlags';
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
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
  ORGANIZATION_INTERNAL_TYPE,
} from './constants';
import {
  OrganizationFields,
  OrganizationFormFields,
  WebStoreAccountFormFields,
  WebStoreMerchantFormFields,
} from './types';

export const organizationPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationQueryVariables>): string => {
  const { id, dissolved } = args;

  const variableToKeyItems = [{ key: 'dissolved', value: dissolved }];

  const query = queryBuilder(variableToKeyItems);

  return `/organization/${id}/${query}`;
};

export const organizationsPathBuilder = ({
  args,
}: PathBuilderProps<OrganizationsQueryVariables>): string => {
  const { child, page, pageSize, dissolved } = args;

  const variableToKeyItems = [
    { key: 'child', value: child },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'dissolved', value: dissolved },
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
          dissolved: false,
        },
      });

    return organizationData.organization;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};
export const hasAdminOrganization = (user?: UserFieldsFragment): boolean =>
  !!user?.adminOrganizations.length;

export const hasFinancialAdminOrganization = (
  user?: UserFieldsFragment
): boolean => !!user?.financialAdminOrganizations.length;

export const hasRegistrationAdminOrganization = (
  user?: UserFieldsFragment
): boolean => !!user?.registrationAdminOrganizations?.length;

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

export const isFinancialAdminUserInOrganization = ({
  id,
  organizationAncestors,
  user,
}: {
  id: string | null;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean =>
  _isAdminUserInOrganization({
    adminOrganizations: getValue(user?.financialAdminOrganizations, []),
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
          dissolved: false,
        },
      });

    return organizationsData.organizations.data as OrganizationFieldsFragment[];
  } catch (e) {
    return [];
  }
};

export const checkCanUserDoOrganizationAction = ({
  action,
  id,
  user,
}: {
  action: ORGANIZATION_ACTIONS;
  id: string;
  user?: UserFieldsFragment;
}): boolean => {
  const isAdminUser = isAdminUserInOrganization({
    id,
    organizationAncestors: [],
    user,
  });
  const adminOrganizations = getValue(user?.adminOrganizations, []);

  if (!!user?.isSuperuser) {
    return true;
  }

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

export const checkIsEditOrganizationActionAllowed = ({
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
  const userCanDoAction = checkCanUserDoOrganizationAction({
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

export const getEditOrganizationButtonProps = ({
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
  let { editable, warning } = checkIsEditOrganizationActionAllowed({
    action,
    authenticated,
    id,
    t,
    user,
  });
  // Don't display warning if user is allowed to update or create organization merchants
  if (
    (action === ORGANIZATION_ACTIONS.CREATE ||
      action === ORGANIZATION_ACTIONS.UPDATE) &&
    checkCanUserDoFinancialInfoAction({
      action:
        action === ORGANIZATION_ACTIONS.CREATE
          ? ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_CREATE
          : ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE,
      organizationId: id,
      user,
    })
  ) {
    editable = true;
    warning = '';
  }

  return {
    disabled: !editable,
    icon: ORGANIZATION_ACTION_ICONS[action],
    label: t(ORGANIZATION_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const checkCanUserDoFinancialInfoAction = ({
  action,
  organizationId,
  user,
}: {
  action: ORGANIZATION_FINANCIAL_INFO_ACTIONS;
  organizationId: string;
  user?: UserFieldsFragment;
}): boolean => {
  if (user?.isSuperuser) {
    return true;
  }

  /* istanbul ignore next */
  const isFinancialAdminUser = isFinancialAdminUserInOrganization({
    id: organizationId,
    organizationAncestors: [],
    user,
  });

  switch (action) {
    case ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_CREATE:
      return (
        !!user?.adminOrganizations.length &&
        !!user.financialAdminOrganizations.length
      );
    case ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE:
      return isFinancialAdminUser;
  }
};

export const getEditFinancialInfoWarning = ({
  action,
  organizationId,
  t,
  user,
}: {
  action: ORGANIZATION_FINANCIAL_INFO_ACTIONS;
  organizationId: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): string => {
  if (!checkCanUserDoFinancialInfoAction({ action, organizationId, user })) {
    return t('organizationsPage.warningNoRightsToEditFinancialInfo');
  }

  return '';
};

export const checkIsEditFinancialInfoAllowed = ({
  action,
  organizationId,
  t,
  user,
}: {
  action: ORGANIZATION_FINANCIAL_INFO_ACTIONS;
  organizationId: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const warning = getEditFinancialInfoWarning({
    action,
    organizationId,
    t,
    user,
  });

  return { editable: !warning, warning };
};

export const getWebStoreAccountInitialValues = (
  webStoreAccount: WebStoreAccountFieldsFragment
): WebStoreAccountFormFields => {
  return {
    active: Boolean(webStoreAccount.active),
    balanceProfitCenter: getValue(webStoreAccount.balanceProfitCenter, ''),
    companyCode: getValue(webStoreAccount.companyCode, ''),
    id: getValue(webStoreAccount.id, null),
    internalOrder: getValue(webStoreAccount.internalOrder, ''),
    operationArea: getValue(webStoreAccount.operationArea, ''),
    mainLedgerAccount: getValue(webStoreAccount.mainLedgerAccount, ''),
    profitCenter: getValue(webStoreAccount.profitCenter, ''),
    project: getValue(webStoreAccount.project, ''),
    vatCode: getValue(webStoreAccount.vatCode, ''),
  };
};

export const getWebStoreMerchantInitialValues = (
  webStoreMerchant: WebStoreMerchantFieldsFragment
): WebStoreMerchantFormFields => {
  return {
    active: Boolean(webStoreMerchant.active),
    businessId: getValue(webStoreMerchant.businessId, ''),
    city: getValue(webStoreMerchant.city, ''),
    email: getValue(webStoreMerchant.email, ''),
    id: getValue(webStoreMerchant.id, null),
    merchantId: getValue(webStoreMerchant.merchantId, ''),
    name: getValue(webStoreMerchant.name, ''),
    paytrailMerchantId: getValue(webStoreMerchant.paytrailMerchantId, ''),
    phoneNumber: getValue(webStoreMerchant.phoneNumber, ''),
    streetAddress: getValue(webStoreMerchant.streetAddress, ''),
    termsOfServiceUrl: getValue(webStoreMerchant.termsOfServiceUrl, ''),
    url: getValue(webStoreMerchant.url, ''),
    zipcode: getValue(webStoreMerchant.zipcode, ''),
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
    financialAdminUsers: getValue(organization.financialAdminUsers, []).map(
      (o) => getValue(o?.username, '')
    ),
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
    webStoreAccounts: getValue(
      organization.webStoreAccounts
        ?.filter(skipFalsyType)
        .map((i) => getWebStoreAccountInitialValues(i)),
      []
    ),
    webStoreMerchants: getValue(
      organization.webStoreMerchants
        ?.filter(skipFalsyType)
        .map((i) => getWebStoreMerchantInitialValues(i)),
      []
    ),
  };
};

export const getOrganizationPayload = (
  formValues: OrganizationFormFields,
  user?: UserFieldsFragment
): CreateOrganizationMutationInput => {
  const {
    adminUsers,
    dissolutionDate,
    financialAdminUsers,
    foundingDate,
    id,
    originId,
    parentOrganization,
    regularUsers,
    webStoreAccounts,
    webStoreMerchants,
    ...restFormValues
  } = formValues;

  const dataSource = formValues.dataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;
  const organizationAction = id
    ? ORGANIZATION_ACTIONS.UPDATE
    : ORGANIZATION_ACTIONS.CREATE;

  const financialInfoAction = id
    ? ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE
    : ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_CREATE;

  return {
    ...(checkCanUserDoOrganizationAction({
      action: organizationAction,
      id,
      user,
    })
      ? {
          ...restFormValues,
          adminUsers,
          dataSource,
          dissolutionDate: dissolutionDate
            ? formatDate(dissolutionDate, DATE_FORMAT_API)
            : null,
          financialAdminUsers,
          foundingDate: foundingDate
            ? formatDate(foundingDate, DATE_FORMAT_API)
            : null,
          id: id || (originId ? `${dataSource}:${originId}` : undefined),
          originId,
          parentOrganization: parentOrganization || undefined,
          regularUsers,
        }
      : /* istanbul ignore next */ {}),
    ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
    checkCanUserDoFinancialInfoAction({
      action: financialInfoAction,
      organizationId: id,
      user,
    })
      ? {
          webStoreAccounts: webStoreAccounts.map((wsa) => ({
            ...wsa,
            id: wsa.id ?? undefined,
          })),
          webStoreMerchants: webStoreMerchants.map((wsm) => ({
            ...wsm,
            id: wsm.id ?? undefined,
          })),
        }
      : /* istanbul ignore next */ {}),
  };
};

export const omitSensitiveDataFromOrganizationPayload = (
  payload: CreateOrganizationMutationInput | UpdateOrganizationMutationInput
): Partial<CreateOrganizationMutationInput | UpdateOrganizationMutationInput> =>
  omit(payload, [
    'adminUsers',
    'financialAdminUsers',
    'registrationAdminUsers',
    'regularUsers',
  ]);
