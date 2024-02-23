import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import {
  ImageQueryVariables,
  ImagesQueryVariables,
  KeywordQueryVariables,
  KeywordSetQueryVariables,
  OrganizationQueryVariables,
  PlaceQueryVariables,
  RegistrationQueryVariables,
  SignupQueryVariables,
} from '../../../generated/graphql';

export const clearEventsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'events' });

export const clearImageQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: ImageQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'image',
    args,
  });

export const clearImagesQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: ImagesQueryVariables
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'images', args });

export const clearKeywordQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: KeywordQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'keyword',
    args,
  });

export const clearKeywordsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'keywords',
  });

export const clearKeywordSetQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: KeywordSetQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'keywordSet',
    args,
  });

export const clearKeywordSetsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'keywordSets',
  });

export const clearOrganizationQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: OrganizationQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'organization',
    args,
  });

export const clearOrganizationsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'organizations',
  });

export const clearPlaceQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: PlaceQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'place',
    args,
  });

export const clearPlacesQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'places',
  });

export const clearPriceGroupQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: PlaceQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'priceGroup',
    args,
  });

export const clearPriceGroupsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'priceGroups',
  });

export const clearRegistrationQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: RegistrationQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'registration',
    args,
  });

export const clearRegistrationsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'registrations',
  });

export const clearSignupQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: SignupQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'signup',
    args,
  });

export const clearSignupsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'signups' });

export const clearSignupGroupQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  args?: SignupQueryVariables
): boolean =>
  apolloClient.cache.evict({
    id: 'ROOT_QUERY',
    fieldName: 'signupGroup',
    args,
  });

export const clearSignupGroupsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'signupGroups' });
