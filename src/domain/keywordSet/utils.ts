import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { ROUTES } from '../../constants';
import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../envVariables';
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
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
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
    value: getValue(keyword?.atId, ''),
  };
};

export const getKeywordSetFields = (
  keywordSet: KeywordSetFieldsFragment,
  language: Language
): KeywordSetFields => {
  const id = getValue(keywordSet.id, '');

  return {
    dataSource: getValue(keywordSet.dataSource, ''),
    id,
    keywordSetUrl: `/${language}${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
    name: getLocalisedString(keywordSet.name, language),
    organization: getValue(keywordSet.organization, ''),
    usage: getValue(keywordSet.usage, ''),
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
    if (action === KEYWORD_SET_ACTIONS.CREATE) {
      return t('keywordSetsPage.warningNoRightsToCreate');
    } else {
      return t('keywordSetsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkCanUserDoAction = ({
  action,
}: {
  action: KEYWORD_SET_ACTIONS;
  organization: string;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean => {
  switch (action) {
    case KEYWORD_SET_ACTIONS.EDIT:
      return true;
    case KEYWORD_SET_ACTIONS.CREATE:
    case KEYWORD_SET_ACTIONS.DELETE:
    case KEYWORD_SET_ACTIONS.UPDATE:
      return false;
  }
};
export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organization,
  organizationAncestors,
  t,
  user,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  organization: string;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    organization,
    organizationAncestors,
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
  organization,
  organizationAncestors,
  t,
  user,
}: {
  action: KEYWORD_SET_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organization: string;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    organization,
    organizationAncestors,
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
  const id = getValue(keywordSet.id, '');

  return {
    dataSource: getValue(keywordSet.dataSource, ''),
    id,
    keywords: getValue(keywordSet.keywords, [])
      .map((keyword) => keyword?.atId)
      .filter(skipFalsyType),
    name: getLocalisedObject(keywordSet.name),
    originId: getValue(id.split(':')[1], ''),
    organization: getValue(keywordSet.organization, ''),
    usage: getValue(keywordSet.usage, ''),
  };
};

export const getKeywordSetPayload = (
  formValues: KeywordSetFormFields
): CreateKeywordSetMutationInput => {
  const {
    dataSource: formDataSource,
    originId,
    id,
    ...restFormValues
  } = formValues;
  const dataSource = formDataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;

  return {
    ...restFormValues,
    dataSource,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
    keywords: formValues.keywords.map((atId) => ({ atId })),
  };
};

export const getKeywordSetItemId = (id: string): string =>
  `keyword-set-item-${id}`;
