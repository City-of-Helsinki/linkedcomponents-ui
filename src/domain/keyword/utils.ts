import { ApolloClient } from '@apollo/client';

import {
  Keyword,
  KeywordDocument,
  KeywordQuery,
  KeywordQueryVariables,
  KeywordsQueryVariables,
} from '../../generated/graphql';
import queryBuilder from '../../utils/queryBuilder';

interface KeywordPathBuilderProps {
  args: KeywordQueryVariables;
}

interface KeywordsPathBuilderProps {
  args: KeywordsQueryVariables;
}

export const keywordPathBuilder = ({ args }: KeywordPathBuilderProps) => {
  const { id } = args;

  return `/keyword/${id}/`;
};

export const keywordsPathBuilder = ({ args }: KeywordsPathBuilderProps) => {
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

export const getKeywordFromCache = async (
  id: string,
  apolloClient: ApolloClient<object>
): Promise<Keyword | null> => {
  try {
    const { data: keywordData } = await apolloClient.query<KeywordQuery>({
      query: KeywordDocument,
      variables: { id, createPath: keywordPathBuilder },
    });

    return keywordData.keyword;
  } catch (e) {
    return null;
  }
};
