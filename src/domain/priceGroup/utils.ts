import { TFunction } from 'i18next';
import { capitalize } from 'lodash';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { ROUTES } from '../../constants';
import {
  OrganizationFieldsFragment,
  PriceGroupFieldsFragment,
  PriceGroupsQueryVariables,
  UpdatePriceGroupMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import { isFinancialAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  PRICE_GROUP_ACTION_ICONS,
  PRICE_GROUP_ACTION_LABEL_KEYS,
  PRICE_GROUP_ACTIONS,
} from './constants';
import {
  PriceGroupFields,
  PriceGroupFormFields,
  PriceGroupOption,
} from './types';

export const getPriceGroupOption = (
  priceGroup: PriceGroupFieldsFragment,
  locale: Language
): PriceGroupOption => ({
  isFree: !!priceGroup.isFree,
  label: capitalize(getLocalisedString(priceGroup.description, locale)),
  value: priceGroup.id.toString(),
});

export const sortPriceGroupOptions = (
  a: PriceGroupOption,
  b: PriceGroupOption
): number => ((a.label ?? '') > (b.label ?? '') ? 1 : -1);

export const priceGroupsPathBuilder = ({
  args,
}: PathBuilderProps<PriceGroupsQueryVariables>): string => {
  const { description, isFree, page, pageSize, publisher, sort } = args;
  const variableToKeyItems = [
    { key: 'description', value: description },
    { key: 'is_free', value: isFree },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
    { key: 'sort', value: sort },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/price_group/${query}`;
};

export const checkCanUserDoPriceGroupAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: PRICE_GROUP_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  /* istanbul ignore next */
  const financialAdminOrganizations = getValue(
    user?.financialAdminOrganizations,
    []
  );
  const isAdminUser = isFinancialAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  if (user?.isSuperuser) {
    return true;
  }

  switch (action) {
    case PRICE_GROUP_ACTIONS.EDIT:
      return true;
    case PRICE_GROUP_ACTIONS.CREATE:
      return publisher ? isAdminUser : !!financialAdminOrganizations.length;
    case PRICE_GROUP_ACTIONS.DELETE:
    case PRICE_GROUP_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const getEditPriceGroupWarning = ({
  action,
  authenticated,
  publisher,
  t,
  userCanDoAction,
}: {
  action: PRICE_GROUP_ACTIONS;
  authenticated: boolean;
  publisher: string;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdatePriceGroup');
  }

  if (!userCanDoAction) {
    if (action === PRICE_GROUP_ACTIONS.CREATE) {
      return t('priceGroupsPage.warningNoRightsToCreate');
    } else if (!publisher) {
      return t('priceGroupsPage.warningNoRightsToEditDefaultPriceGroup');
    } else {
      return t('priceGroupsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export function sonarBranchTest(x: number) {
  if (x > 10) return 'big';
  return 'small';
}

export function sonarBranchTestMoo(x: number) {
  if (x > 10) return 'big';
  return 'small';
}

export const checkIsEditPriceGroupActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: PRICE_GROUP_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoPriceGroupAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditPriceGroupWarning({
    action,
    authenticated,
    publisher,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditPriceGroupButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: PRICE_GROUP_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditPriceGroupActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: PRICE_GROUP_ACTION_ICONS[action],
    label: t(PRICE_GROUP_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getPriceGroupFields = (
  priceGroup: PriceGroupFieldsFragment,
  locale: Language
): PriceGroupFields => {
  const id = getValue(priceGroup.id.toString(), '');

  return {
    id,
    description: getLocalisedString(priceGroup.description, locale),
    isFree: !!priceGroup.isFree,
    priceGroupUrl: `/${locale}${ROUTES.EDIT_PRICE_GROUP.replace(':id', id)}`,
    publisher: getValue(priceGroup.publisher, ''),
  };
};

export const getPriceGroupItemId = (id: string): string =>
  `price-group-item-${id}`;

export const getPriceGroupInitialValues = (
  priceGroup: PriceGroupFieldsFragment
): PriceGroupFormFields => ({
  description: getLocalisedObject(priceGroup.description),
  id: priceGroup.id.toString(),
  isFree: !!priceGroup.isFree,
  publisher: getValue(priceGroup.publisher, ''),
});

export const getPriceGroupPayload = (
  formValues: PriceGroupFormFields
): UpdatePriceGroupMutationInput => {
  const { id, ...restFormValues } = formValues;

  return restFormValues;
};
