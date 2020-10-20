import { gql, QueryHookOptions, useQuery } from '@apollo/client';

export type Maybe<T> = T | null;

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type LanguagesResponse = {
  __typename?: 'LanguagesResponse';
  data: Array<Language>;
};

export type Language = {
  __typename?: 'EventDetails';
  id: Scalars['ID'];
  translation_available: boolean;
  name: LocalizedObject;
  internalContext?: Maybe<Scalars['String']>;
  internalId?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type LocalizedObject = {
  __typename?: 'LocalizedObject';
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
};

export type Meta = {
  __typename?: 'Meta';
  count: Scalars['Int'];
  next?: Maybe<Scalars['String']>;
  previous?: Maybe<Scalars['String']>;
};

export type LanguageFieldsFragment = { __typename?: 'Language' } & Pick<
  Language,
  'id'
> & {
    name: Maybe<{ __typename?: 'LocalizedObject' } & LocalizedFieldsFragment>;
  };

export type LocalizedFieldsFragment = { __typename?: 'LocalizedObject' } & Pick<
  LocalizedObject,
  'en' | 'fi' | 'sv'
>;

export type MetaFieldsFragment = Meta;

export const LocalizedFieldsFragmentDoc = gql`
  fragment localizedFields on LocalizedObject {
    en
    fi
    sv
  }
`;

export const MetaFieldsFragmentDoc = gql`
  fragment metaFields on Meta {
    count
    next
    previous
  }
`;

export const LanguageFieldsFragmentDoc = gql`
  fragment languageFields on Language {
    id
    name @type(name: "LocalizedObject") {
      ...localizedFields
    }
  }
  ${LocalizedFieldsFragmentDoc}
`;

export const LanguagesDocument = gql`
  query Languages {
    languages
      @rest(type: "LanguagesResponse", path: "/language", method: "GET") {
      meta @type(name: "Meta") {
        ...metaFields
      }
      data @type(name: "Language") {
        ...languageFields
      }
    }
  }
  ${MetaFieldsFragmentDoc}
  ${LanguageFieldsFragmentDoc}
`;

export type LanguagesQueryVariables = {};

export type LanguagesQuery = { __typename?: 'Query' } & {
  languages: { __typename?: 'LanguagesResponse' } & {
    meta: { __typename?: 'Meta' } & Pick<Meta, 'count' | 'next' | 'previous'>;
    data: Array<{ __typename?: 'Language' } & LanguageFieldsFragment>;
  };
};

export function useLanguagesQuery(
  baseOptions?: QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>
) {
  return useQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    baseOptions
  );
}
