import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import {
  CreateKeywordSetMutationInput,
  KeywordFieldsFragment,
  KeywordSetFieldsFragment,
  KeywordSetQueryVariables,
  KeywordSetsQueryVariables,
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import {
  Editability,
  Language,
  OptionType,
  PathBuilderProps,
} from '../../types';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import queryBuilder from '../../utils/queryBuilder';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  KEYWORD_SET_ACTION_ICONS,
  KEYWORD_SET_ACTION_LABEL_KEYS,
  KEYWORD_SET_ACTIONS,
  KEYWORD_SET_DATA_SOURCE,
} from './constants';
import { KeywordSetFields, KeywordSetFormFields } from './types';

export const keywordSetPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetQueryVariables>): string => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${id}/${query}`;
};

export const keywordSetsPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetsQueryVariables>): string => {
  const { include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${query}`;
};

export const getKeywordOption = ({
  keyword,
  locale,
}: {
  keyword?: KeywordFieldsFragment | null;
  locale: Language;
}): OptionType => {
  return {
    label: capitalize(getLocalisedString(keyword?.name, locale)).split(' (')[0],
    value: keyword?.atId ?? '',
  };
};

export const getKeywordSetFields = (
  keywordSet: KeywordSetFieldsFragment,
  language: Language
): KeywordSetFields => {
  const id = keywordSet.id ?? '';

  return {
    id,
    keywordSetUrl: `/${language}${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
    name: getLocalisedString(keywordSet.name, language),
    organization: keywordSet.organization ?? '',
    usage: keywordSet.usage ?? '',
  };
};

export const getEditKeywordSetWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateKeywordSet');
  }

  if (!userCanDoAction) {
    switch (action) {
      case KEYWORD_SET_ACTIONS.CREATE:
        return t('keywordSetsPage.warningNoRightsToCreate');
      default:
        return t('keywordSetsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: KEYWORD_SET_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  /* istanbul ignore next */
  const adminOrganizations = user?.adminOrganizations ?? [];
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case KEYWORD_SET_ACTIONS.EDIT:
      return true;
    case KEYWORD_SET_ACTIONS.CREATE:
      return publisher ? isAdminUser : !!adminOrganizations.length;
    case KEYWORD_SET_ACTIONS.DELETE:
    case KEYWORD_SET_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditKeywordSetWarning({
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
  onClick,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: KEYWORD_SET_ACTION_ICONS[action],
    label: t(KEYWORD_SET_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getKeywordSetInitialValues = (
  keywordSet: KeywordSetFieldsFragment
): KeywordSetFormFields => {
  const id = keywordSet.id ?? '';
  return {
    dataSource: keywordSet.dataSource ?? '',
    id,
    keywords:
      keywordSet.keywords?.map((keyword) => keyword?.atId as string) || [],
    name: getLocalisedObject(keywordSet.name),
    originId: id.split(':')[1] ?? '',
    organization: keywordSet.organization ?? '',
    usage: keywordSet.usage ?? '',
  };
};

export const getKeywordSetPayload = (
  formValues: KeywordSetFormFields
): CreateKeywordSetMutationInput => {
  const { originId, id, ...restFormValues } = formValues;
  const dataSource = formValues.dataSource || KEYWORD_SET_DATA_SOURCE;

  return {
    ...restFormValues,
    dataSource,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    keywords: formValues.keywords.map((atId) => ({ atId })),
  };
};

export const getKeywordSetItemId = (id: string): string =>
  `keyword-set-item-${id}`;
