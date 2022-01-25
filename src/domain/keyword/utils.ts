import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../constants';
import {
  Keyword,
  KeywordDocument,
  KeywordFieldsFragment,
  KeywordQuery,
  KeywordQueryVariables,
  KeywordsQueryVariables,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import {
  AUTHENTICATION_NOT_NEEDED,
  KEYWORD_ACTION_ICONS,
  KEYWORD_ACTION_LABEL_KEYS,
  KEYWORD_ACTIONS,
} from './constants';
import { KeywordFields } from './types';

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
  };
};

// TODO: Check user permissions
export const checkCanUserDoAction = ({
  action,
  user,
}: {
  action: KEYWORD_ACTIONS;
  user?: UserFieldsFragment;
}): boolean => {
  switch (action) {
    case KEYWORD_ACTIONS.CREATE:
    case KEYWORD_ACTIONS.DELETE:
    case KEYWORD_ACTIONS.EDIT:
    case KEYWORD_ACTIONS.UPDATE:
      return true;
  }
};

export const getEditEnrolmentWarning = ({
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
  t,
  user,
}: {
  action: KEYWORD_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({ action, user });

  const warning = getEditEnrolmentWarning({
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
  t,
  user,
}: {
  action: KEYWORD_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
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
