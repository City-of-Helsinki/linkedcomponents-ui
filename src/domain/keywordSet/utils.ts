import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/menuItem/MenuItem';
import { ROUTES } from '../../constants';
import {
  CreateKeywordSetMutationInput,
  KeywordFieldsFragment,
  KeywordSetFieldsFragment,
  KeywordSetQueryVariables,
  KeywordSetsQueryVariables,
  OrganizationFieldsFragment,
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
import {
  AUTHENTICATION_NOT_NEEDED,
  KEYWORD_SET_ACTION_ICONS,
  KEYWORD_SET_ACTION_LABEL_KEYS,
  KEYWORD_SET_ACTIONS,
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
  const { include, page, pageSize, sort, text } = args;
  const variableToKeyItems = [
    { key: 'include', value: include },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

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
    dataSource: keywordSet.dataSource ?? '',
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
  dataSource,
  userOrganization,
}: {
  action: KEYWORD_SET_ACTIONS;
  dataSource: string;
  userOrganization: OrganizationFieldsFragment | null;
}): boolean => {
  /* istanbul ignore next */
  switch (action) {
    case KEYWORD_SET_ACTIONS.EDIT:
      return true;
    case KEYWORD_SET_ACTIONS.CREATE:
      return !!userOrganization?.dataSource;
    case KEYWORD_SET_ACTIONS.DELETE:
    case KEYWORD_SET_ACTIONS.UPDATE:
      return userOrganization?.dataSource === dataSource;
  }
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  dataSource,
  t,
  userOrganization,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  dataSource: string;
  t: TFunction;
  userOrganization: OrganizationFieldsFragment | null;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    dataSource,
    userOrganization,
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
  dataSource,
  onClick,
  t,
  userOrganization,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  dataSource: string;
  onClick: () => void;
  t: TFunction;
  userOrganization: OrganizationFieldsFragment | null;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    dataSource,
    t,
    userOrganization,
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
  formValues: KeywordSetFormFields,
  userOrganization: OrganizationFieldsFragment | null
): CreateKeywordSetMutationInput => {
  const {
    dataSource: formDataSource,
    originId,
    id,
    ...restFormValues
  } = formValues;
  const dataSource = formDataSource || userOrganization?.dataSource;

  return {
    ...restFormValues,
    dataSource,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    keywords: formValues.keywords.map((atId) => ({ atId })),
  };
};

export const getKeywordSetItemId = (id: string): string =>
  `keyword-set-item-${id}`;
