import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
};


export type Query = {
  __typename?: 'Query';
  events: EventsResponse;
  languages: LanguagesResponse;
};


export type QueryEventsArgs = {
  combinedText?: Maybe<Array<Maybe<Scalars['String']>>>;
  division?: Maybe<Array<Maybe<Scalars['String']>>>;
  end?: Maybe<Scalars['String']>;
  endsAfter?: Maybe<Scalars['String']>;
  endsBefore?: Maybe<Scalars['String']>;
  inLanguage?: Maybe<Scalars['String']>;
  include?: Maybe<Array<Maybe<Scalars['String']>>>;
  isFree?: Maybe<Scalars['Boolean']>;
  keyword?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywordAnd?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywordNot?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  location?: Maybe<Array<Maybe<Scalars['String']>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  publisher?: Maybe<Scalars['ID']>;
  sort?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
  startsAfter?: Maybe<Scalars['String']>;
  startsBefore?: Maybe<Scalars['String']>;
  superEvent?: Maybe<Scalars['ID']>;
  superEventType?: Maybe<Array<Maybe<Scalars['String']>>>;
  text?: Maybe<Scalars['String']>;
  translation?: Maybe<Scalars['String']>;
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  meta: Meta;
  data: Array<Maybe<Event>>;
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

export type Division = {
  __typename?: 'Division';
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  ocdId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  id: Scalars['ID'];
  audience: Array<Maybe<InternalIdObject>>;
  audienceMaxAge?: Maybe<Scalars['String']>;
  audienceMinAge?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  datePublished?: Maybe<Scalars['String']>;
  description?: Maybe<LocalisedObject>;
  endTime?: Maybe<Scalars['String']>;
  extensionCourse?: Maybe<ExtensionCourse>;
  externalLinks: Array<Maybe<ExternalLink>>;
  eventStatus?: Maybe<Scalars['String']>;
  images: Array<Maybe<Image>>;
  infoUrl?: Maybe<LocalisedObject>;
  inLanguage: Array<Maybe<Language>>;
  keywords: Array<Maybe<Keyword>>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  location?: Maybe<Place>;
  locationExtraInfo?: Maybe<LocalisedObject>;
  name?: Maybe<LocalisedObject>;
  offers: Array<Maybe<Offer>>;
  provider?: Maybe<LocalisedObject>;
  providerContactInfo?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['ID']>;
  shortDescription?: Maybe<LocalisedObject>;
  startTime?: Maybe<Scalars['String']>;
  subEvents: Array<Maybe<InternalIdObject>>;
  superEvent?: Maybe<InternalIdObject>;
  superEventType?: Maybe<Scalars['String']>;
  internalId?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type ExternalLink = {
  __typename?: 'ExternalLink';
  name?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type ExtensionCourse = {
  __typename?: 'ExtensionCourse';
  enrolmentStartTime?: Maybe<Scalars['String']>;
  enrolmentEndTime?: Maybe<Scalars['String']>;
  maximumAttendeeCapacity?: Maybe<Scalars['Int']>;
  minimumAttendeeCapacity?: Maybe<Scalars['Int']>;
  remainingAttendeeCapacity?: Maybe<Scalars['Int']>;
};

export type Image = {
  __typename?: 'Image';
  id?: Maybe<Scalars['ID']>;
  createdTime?: Maybe<Scalars['String']>;
  cropping?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  license?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  photographerName?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  internalId?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type InternalIdObject = {
  __typename?: 'InternalIdObject';
  internalId?: Maybe<Scalars['String']>;
};

export type Keyword = {
  __typename?: 'Keyword';
  id?: Maybe<Scalars['ID']>;
  aggregate?: Maybe<Scalars['Boolean']>;
  altLabels?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdTime?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deprecated?: Maybe<Scalars['Boolean']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Image>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  nEvents?: Maybe<Scalars['Int']>;
  publisher?: Maybe<Scalars['ID']>;
  internalId?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type Language = {
  __typename?: 'Language';
  id?: Maybe<Scalars['ID']>;
  translationAvailable?: Maybe<Scalars['Boolean']>;
  name?: Maybe<LocalisedObject>;
  internalId?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type LocalisedObject = {
  __typename?: 'LocalisedObject';
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
};

export type Offer = {
  __typename?: 'Offer';
  description?: Maybe<LocalisedObject>;
  infoUrl?: Maybe<LocalisedObject>;
  isFree?: Maybe<Scalars['Boolean']>;
  price?: Maybe<LocalisedObject>;
};

export type Place = {
  __typename?: 'Place';
  id?: Maybe<Scalars['ID']>;
  addressCountry?: Maybe<Scalars['String']>;
  addressLocality?: Maybe<LocalisedObject>;
  addressRegion?: Maybe<Scalars['String']>;
  contactType?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  customData?: Maybe<Scalars['String']>;
  dataSource?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  divisions: Array<Maybe<Division>>;
  email?: Maybe<Scalars['String']>;
  hasUpcomingEvents?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Image>;
  infoUrl?: Maybe<LocalisedObject>;
  lastModifiedTime?: Maybe<Scalars['String']>;
  name?: Maybe<LocalisedObject>;
  nEvents?: Maybe<Scalars['Int']>;
  parent?: Maybe<Scalars['ID']>;
  position?: Maybe<Position>;
  postalCode?: Maybe<Scalars['String']>;
  postOfficeBoxNum?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['ID']>;
  replacedBy?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<LocalisedObject>;
  telephone?: Maybe<LocalisedObject>;
  internalId?: Maybe<Scalars['String']>;
  internalContext?: Maybe<Scalars['String']>;
  internalType?: Maybe<Scalars['String']>;
};

export type Position = {
  __typename?: 'Position';
  coordinates: Array<Maybe<Scalars['Float']>>;
  type?: Maybe<Scalars['String']>;
};

export type ExternalLinkFieldsFragment = (
  { __typename?: 'ExternalLink' }
  & Pick<ExternalLink, 'name' | 'link'>
);

export type ImageFieldsFragment = (
  { __typename?: 'Image' }
  & Pick<Image, 'id' | 'name' | 'url'>
);

export type OfferFieldsFragment = (
  { __typename?: 'Offer' }
  & Pick<Offer, 'isFree'>
  & { description?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, infoUrl?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, price?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )> }
);

export type EventFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'endTime' | 'eventStatus' | 'publisher' | 'startTime'>
  & { description?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, externalLinks: Array<Maybe<(
    { __typename?: 'ExternalLink' }
    & ExternalLinkFieldsFragment
  )>>, images: Array<Maybe<(
    { __typename?: 'Image' }
    & ImageFieldsFragment
  )>>, infoUrl?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, inLanguage: Array<Maybe<(
    { __typename?: 'Language' }
    & LanguageFieldsFragment
  )>>, keywords: Array<Maybe<(
    { __typename?: 'Keyword' }
    & KeywordFieldsFragment
  )>>, location?: Maybe<(
    { __typename?: 'Place' }
    & PlaceFieldsFragment
  )>, name?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, offers: Array<Maybe<(
    { __typename?: 'Offer' }
    & OfferFieldsFragment
  )>>, provider?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, shortDescription?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, superEvent?: Maybe<(
    { __typename?: 'InternalIdObject' }
    & Pick<InternalIdObject, 'internalId'>
  )> }
);

export type EventsQueryVariables = Exact<{
  combinedText?: Maybe<Array<Maybe<Scalars['String']>>>;
  division?: Maybe<Array<Maybe<Scalars['String']>>>;
  end?: Maybe<Scalars['String']>;
  endsAfter?: Maybe<Scalars['String']>;
  endsBefore?: Maybe<Scalars['String']>;
  include?: Maybe<Array<Maybe<Scalars['String']>>>;
  inLanguage?: Maybe<Scalars['String']>;
  isFree?: Maybe<Scalars['Boolean']>;
  keyword?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywordAnd?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywordNot?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  location?: Maybe<Array<Maybe<Scalars['String']>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  publisher?: Maybe<Scalars['ID']>;
  sort?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
  startsAfter?: Maybe<Scalars['String']>;
  startsBefore?: Maybe<Scalars['String']>;
  superEvent?: Maybe<Scalars['ID']>;
  superEventType?: Maybe<Array<Maybe<Scalars['String']>>>;
  text?: Maybe<Scalars['String']>;
  translation?: Maybe<Scalars['String']>;
  createPath?: Maybe<Scalars['Any']>;
}>;


export type EventsQuery = (
  { __typename?: 'Query' }
  & { events: (
    { __typename?: 'EventsResponse' }
    & { meta: (
      { __typename?: 'Meta' }
      & Pick<Meta, 'count' | 'next' | 'previous'>
    ), data: Array<Maybe<(
      { __typename?: 'Event' }
      & EventFieldsFragment
    )>> }
  ) }
);

export type LocalisedFieldsFragment = (
  { __typename?: 'LocalisedObject' }
  & Pick<LocalisedObject, 'en' | 'fi' | 'sv'>
);

export type MetaFieldsFragment = (
  { __typename?: 'Meta' }
  & Pick<Meta, 'count' | 'next' | 'previous'>
);

export type KeywordFieldsFragment = (
  { __typename?: 'Keyword' }
  & Pick<Keyword, 'id' | 'dataSource' | 'hasUpcomingEvents' | 'internalId'>
  & { name?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )> }
);

export type LanguageFieldsFragment = (
  { __typename?: 'Language' }
  & Pick<Language, 'id' | 'internalId'>
  & { name?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )> }
);

export type LanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesQuery = (
  { __typename?: 'Query' }
  & { languages: (
    { __typename?: 'LanguagesResponse' }
    & { meta: (
      { __typename?: 'Meta' }
      & MetaFieldsFragment
    ), data: Array<Maybe<(
      { __typename?: 'Language' }
      & LanguageFieldsFragment
    )>> }
  ) }
);

export type DivisionFieldsFragment = (
  { __typename?: 'Division' }
  & Pick<Division, 'type'>
  & { name?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )> }
);

export type PositionFieldsFragment = (
  { __typename?: 'Position' }
  & Pick<Position, 'coordinates'>
);

export type PlaceFieldsFragment = (
  { __typename?: 'Place' }
  & Pick<Place, 'id' | 'email' | 'hasUpcomingEvents' | 'internalId' | 'postalCode'>
  & { addressLocality?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, divisions: Array<Maybe<(
    { __typename?: 'Division' }
    & DivisionFieldsFragment
  )>>, infoUrl?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, name?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, streetAddress?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, telephone?: Maybe<(
    { __typename?: 'LocalisedObject' }
    & LocalisedFieldsFragment
  )>, position?: Maybe<(
    { __typename?: 'Position' }
    & PositionFieldsFragment
  )> }
);

export const LocalisedFieldsFragmentDoc = gql`
    fragment localisedFields on LocalisedObject {
  en
  fi
  sv
}
    `;
export const ExternalLinkFieldsFragmentDoc = gql`
    fragment externalLinkFields on ExternalLink {
  name
  link
}
    `;
export const ImageFieldsFragmentDoc = gql`
    fragment imageFields on Image {
  id
  name
  url
}
    `;
export const LanguageFieldsFragmentDoc = gql`
    fragment languageFields on Language {
  id
  internalId
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const KeywordFieldsFragmentDoc = gql`
    fragment keywordFields on Keyword {
  id
  dataSource
  hasUpcomingEvents
  internalId
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const DivisionFieldsFragmentDoc = gql`
    fragment divisionFields on Division {
  type
  name {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const PositionFieldsFragmentDoc = gql`
    fragment positionFields on Position {
  coordinates
}
    `;
export const PlaceFieldsFragmentDoc = gql`
    fragment placeFields on Place {
  id
  addressLocality {
    ...localisedFields
  }
  divisions {
    ...divisionFields
  }
  email
  hasUpcomingEvents
  infoUrl {
    ...localisedFields
  }
  internalId
  name {
    ...localisedFields
  }
  postalCode
  streetAddress {
    ...localisedFields
  }
  telephone {
    ...localisedFields
  }
  position {
    ...positionFields
  }
}
    ${LocalisedFieldsFragmentDoc}
${DivisionFieldsFragmentDoc}
${PositionFieldsFragmentDoc}`;
export const OfferFieldsFragmentDoc = gql`
    fragment offerFields on Offer {
  description {
    ...localisedFields
  }
  infoUrl {
    ...localisedFields
  }
  isFree
  price {
    ...localisedFields
  }
}
    ${LocalisedFieldsFragmentDoc}`;
export const EventFieldsFragmentDoc = gql`
    fragment eventFields on Event {
  id
  description {
    ...localisedFields
  }
  endTime
  externalLinks {
    ...externalLinkFields
  }
  eventStatus
  images {
    ...imageFields
  }
  infoUrl {
    ...localisedFields
  }
  inLanguage {
    ...languageFields
  }
  keywords {
    ...keywordFields
  }
  location {
    ...placeFields
  }
  name {
    ...localisedFields
  }
  offers {
    ...offerFields
  }
  provider {
    ...localisedFields
  }
  publisher
  shortDescription {
    ...localisedFields
  }
  superEvent {
    internalId
  }
  startTime
}
    ${LocalisedFieldsFragmentDoc}
${ExternalLinkFieldsFragmentDoc}
${ImageFieldsFragmentDoc}
${LanguageFieldsFragmentDoc}
${KeywordFieldsFragmentDoc}
${PlaceFieldsFragmentDoc}
${OfferFieldsFragmentDoc}`;
export const MetaFieldsFragmentDoc = gql`
    fragment metaFields on Meta {
  count
  next
  previous
}
    `;
export const EventsDocument = gql`
    query Events($combinedText: [String], $division: [String], $end: String, $endsAfter: String, $endsBefore: String, $include: [String], $inLanguage: String, $isFree: Boolean, $keyword: [String], $keywordAnd: [String], $keywordNot: [String], $language: String, $location: [String], $page: Int, $pageSize: Int, $publisher: ID, $sort: String, $start: String, $startsAfter: String, $startsBefore: String, $superEvent: ID, $superEventType: [String], $text: String, $translation: String, $createPath: Any) {
  events(combinedText: $combinedText, division: $division, end: $end, endsAfter: $endsAfter, endsBefore: $endsBefore, include: $include, inLanguage: $inLanguage, isFree: $isFree, keyword: $keyword, keywordAnd: $keywordAnd, keywordNot: $keywordNot, language: $language, location: $location, page: $page, pageSize: $pageSize, publisher: $publisher, sort: $sort, start: $start, startsAfter: $startsAfter, startsBefore: $startsBefore, superEvent: $superEvent, superEventType: $superEventType, text: $text, translation: $translation) @rest(type: "EventsResponse", pathBuilder: $createPath) {
    meta {
      count
      next
      previous
    }
    data {
      ...eventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *      combinedText: // value for 'combinedText'
 *      division: // value for 'division'
 *      end: // value for 'end'
 *      endsAfter: // value for 'endsAfter'
 *      endsBefore: // value for 'endsBefore'
 *      include: // value for 'include'
 *      inLanguage: // value for 'inLanguage'
 *      isFree: // value for 'isFree'
 *      keyword: // value for 'keyword'
 *      keywordAnd: // value for 'keywordAnd'
 *      keywordNot: // value for 'keywordNot'
 *      language: // value for 'language'
 *      location: // value for 'location'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      publisher: // value for 'publisher'
 *      sort: // value for 'sort'
 *      start: // value for 'start'
 *      startsAfter: // value for 'startsAfter'
 *      startsBefore: // value for 'startsBefore'
 *      superEvent: // value for 'superEvent'
 *      superEventType: // value for 'superEventType'
 *      text: // value for 'text'
 *      translation: // value for 'translation'
 *      createPath: // value for 'createPath'
 *   },
 * });
 */
export function useEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>) {
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, baseOptions);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, baseOptions);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const LanguagesDocument = gql`
    query Languages {
  languages @rest(type: "LanguagesResponse", path: "/language", method: "GET") {
    meta {
      ...metaFields
    }
    data {
      ...languageFields
    }
  }
}
    ${MetaFieldsFragmentDoc}
${LanguageFieldsFragmentDoc}`;

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
export function useLanguagesQuery(baseOptions?: Apollo.QueryHookOptions<LanguagesQuery, LanguagesQueryVariables>) {
        return Apollo.useQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, baseOptions);
      }
export function useLanguagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguagesQuery, LanguagesQueryVariables>) {
          return Apollo.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(LanguagesDocument, baseOptions);
        }
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>;
export type LanguagesLazyQueryHookResult = ReturnType<typeof useLanguagesLazyQuery>;
export type LanguagesQueryResult = Apollo.QueryResult<LanguagesQuery, LanguagesQueryVariables>;