import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { LINKED_EVENTS_SYSTEM_DATA_SOURCE, ROUTES } from '../../constants';
import {
  CreateKeywordMutationInput,
  Keyword,
  KeywordDocument,
  KeywordFieldsFragment,
  KeywordQuery,
  KeywordQueryVariables,
  KeywordsQueryVariables,
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  KEYWORD_ACTION_ICONS,
  KEYWORD_ACTION_LABEL_KEYS,
  KEYWORD_ACTIONS,
} from './constants';
import { KeywordFields, KeywordFormFields } from './types';

export const keywordPathBuilder = ({
  args,
}: PathBuilderProps<KeywordQueryVariables>): string => {
  const { id } = args;

  return `/keyword/${id}/`;
};

export const keywordsPathBuilder = ({
  args,
}: PathBuilderProps<KeywordsQueryVariables>): string => {
  const {
    dataSource,
    freeText,
    hasUpcomingEvents,
    page,
    pageSize,
    showAllKeywords,
    sort,
    text,
  } = args;
  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'free_text', value: freeText },
    { key: 'has_upcoming_events', value: hasUpcomingEvents },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'show_all_keywords', value: showAllKeywords },
    { key: 'sort', value: sort },
    { key: 'text', value: text },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword/${query}`;
};

export const getKeywordQueryResult = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<Keyword | null> => {
  try {
    const { data: keywordData } = await apolloClient.query<KeywordQuery>({
      query: KeywordDocument,
      variables: {
        id,
        createPath: getPathBuilder(keywordPathBuilder),
      },
    });

    return keywordData.keyword;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};

export const getKeywordItemId = (id: string): string => `keyword-item-${id}`;

export const getKeywordFields = (
  keyword: KeywordFieldsFragment,
  language: Language
): KeywordFields => {
  const id = keyword.id ?? '';
  return {
    atId: keyword.atId ?? '',
    id,
    keywordUrl: `/${language}${ROUTES.EDIT_KEYWORD.replace(':id', id)}`,
    name: getLocalisedString(keyword.name, language),
    nEvents: keyword.nEvents ?? 0,
    publisher: keyword.publisher ?? '',
  };
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: KEYWORD_ACTIONS;
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
    case KEYWORD_ACTIONS.EDIT:
      return true;
    case KEYWORD_ACTIONS.CREATE:
      return publisher ? isAdminUser : !!adminOrganizations.length;
    case KEYWORD_ACTIONS.DELETE:
    case KEYWORD_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const getEditKeywordWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: KEYWORD_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateKeyword');
  }

  if (!userCanDoAction) {
    switch (action) {
      case KEYWORD_ACTIONS.CREATE:
        return t('keywordsPage.warningNoRightsToCreate');
      default:
        return t('keywordsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: KEYWORD_ACTIONS;
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

  const warning = getEditKeywordWarning({
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
  action: KEYWORD_ACTIONS;
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
    icon: KEYWORD_ACTION_ICONS[action],
    label: t(KEYWORD_ACTION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getKeywordInitialValues = (
  keyword: KeywordFieldsFragment
): KeywordFormFields => {
  const id = keyword.id ?? '';
  return {
    dataSource: keyword.dataSource ?? '',
    deprecated: !!keyword.deprecated,
    id,
    name: getLocalisedObject(keyword.name),
    originId: id.split(':')[1] ?? '',
    publisher: keyword.publisher ?? '',
    replacedBy: keyword.replacedBy ?? '',
  };
};

export const getKeywordPayload = (
  formValues: KeywordFormFields
): CreateKeywordMutationInput => {
  const { originId, id, ...restFormValues } = formValues;
  const dataSource = formValues.dataSource || LINKED_EVENTS_SYSTEM_DATA_SOURCE;

  return {
    ...restFormValues,
    dataSource,
    id: id || (originId ? `${dataSource}:${originId}` : undefined),
  };
};
