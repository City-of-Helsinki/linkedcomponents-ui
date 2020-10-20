import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  languages: LanguagesResponse;
};

export type LanguagesResponse = {
  __typename?: 'LanguagesResponse';
  meta: Meta;
  data: Array<Maybe<Language>>;
};

export type Meta = {
  __typename?: 'Meta';
  count: Scalars['Int'];
  next?: Maybe<Scalars['String']>;
  previous?: Maybe<Scalars['String']>;
};

export type Language = {
  __typename?: 'Language';
  id?: Maybe<Scalars['ID']>;
  translationAvailable?: Maybe<Scalars['Boolean']>;
  name?: Maybe<LocalisedObject>;
  internalContext?: Maybe<Scalars['String']>;
  internalId?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type LocalisedObject = {
  __typename?: 'LocalisedObject';
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
};

export type LocalisedFieldsFragment = { __typename?: 'LocalisedObject' } & Pick<
  LocalisedObject,
  'en' | 'fi' | 'sv'
>;

export type MetaFieldsFragment = { __typename?: 'Meta' } & Pick<
  Meta,
  'count' | 'next' | 'previous'
>;

export type LanguageFieldsFragment = { __typename?: 'Language' } & Pick<
  Language,
  'id'
> & {
    name?: Maybe<{ __typename?: 'LocalisedObject' } & LocalisedFieldsFragment>;
  };

export type LanguagesQueryVariables = Exact<{ [key: string]: never }>;

export type LanguagesQuery = { __typename?: 'Query' } & {
  languages: { __typename?: 'LanguagesResponse' } & {
    meta: { __typename?: 'Meta' } & MetaFieldsFragment;
    data: Array<Maybe<{ __typename?: 'Language' } & LanguageFieldsFragment>>;
  };
};

export const MetaFieldsFragmentDoc = gql`
  fragment metaFields on Meta {
    count
    next
    previous
  }
`;
export const LocalisedFieldsFragmentDoc = gql`
  fragment localisedFields on LocalisedObject {
    en
    fi
    sv
  }
`;
export const LanguageFieldsFragmentDoc = gql`
  fragment languageFields on Language {
    id
    name {
      ...localisedFields
    }
  }
  ${LocalisedFieldsFragmentDoc}
`;
export const LanguagesDocument = gql`
  query Languages {
    languages
      @rest(type: "LanguagesResponse", path: "/language", method: "GET") {
      meta {
        ...metaFields
      }
      data {
        ...languageFields
      }
    }
  }
  ${MetaFieldsFragmentDoc}
  ${LanguageFieldsFragmentDoc}
`;

/**
 * __useLanguagesQuery__
 *
 * To run a query within a React component, call `useLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLanguagesQuery(
  baseOptions?: Apollo.QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>
) {
  return Apollo.useQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    baseOptions
  );
}
export function useLanguagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LanguagesQuery,
    LanguagesQueryVariables
  >
) {
  return Apollo.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    baseOptions
  );
}
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>;
export type LanguagesLazyQueryHookResult = ReturnType<
  typeof useLanguagesLazyQuery
>;
export type LanguagesQueryResult = Apollo.QueryResult<
  LanguagesQuery,
  LanguagesQueryVariables
>;
