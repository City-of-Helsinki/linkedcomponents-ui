import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import isSameDay from 'date-fns/isSameDay';

import {
  EventsQueryVariables,
  EventTypeId,
  PublicationStatus,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import {
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from './constants';

export const eventsPathBuilder = ({
  args,
}: PathBuilderProps<EventsQueryVariables>): string => {
  const {
    adminUser,
    createdBy,
    combinedText,
    division,
    end,
    endsAfter,
    endsBefore,
    eventType,
    inLanguage,
    include,
    isFree,
    keywordAnd,
    keywordNot,
    keyword,
    language,
    location,
    page,
    pageSize,
    publicationStatus,
    publisher,
    showAll,
    sort,
    start,
    startsAfter,
    startsBefore,
    superEvent,
    superEventType,
    text,
    translation,
  } = args;

  const variableToKeyItems = [
    { key: 'admin_user', value: adminUser },
    { key: 'created_by', value: createdBy },
    { key: 'combined_text', value: combinedText },
    { key: 'division', value: division },
    { key: 'end', value: end },
    { key: 'ends_after', value: endsAfter },
    { key: 'ends_before', value: endsBefore },
    {
      key: 'event_type',
      value: eventType?.length ? eventType : Object.values(EventTypeId),
    },
    { key: 'include', value: include },
    { key: 'in_language', value: inLanguage },
    { key: 'is_free', value: isFree },
    { key: 'keyword', value: keyword },
    { key: 'keyword_AND', value: keywordAnd },
    { key: 'keyword!', value: keywordNot },
    { key: 'language', value: language },
    { key: 'location', value: location },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publication_status', value: publicationStatus },
    { key: 'publisher', value: publisher },
    { key: 'show_all', value: showAll },
    { key: 'sort', value: sort },
    { key: 'start', value: start },
    { key: 'starts_after', value: startsAfter },
    { key: 'starts_before', value: startsBefore },
    { key: 'super_event', value: superEvent },
    { key: 'super_event_type', value: superEventType },
    { key: 'text', value: text },
    { key: 'translation', value: translation },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/event/${query}`;
};

export const clearEventsQueries = (
  apolloClient: ApolloClient<NormalizedCacheObject>
): boolean =>
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'events' });

export const getEventsQueryBaseVariables = ({
  adminOrganizations,
  tab,
}: {
  adminOrganizations: string[];
  tab: EVENTS_PAGE_TABS;
}): EventsQueryVariables => {
  const baseVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    include: EVENT_LIST_INCLUDES,
    pageSize: EVENTS_PAGE_SIZE,
    superEvent: 'none',
  };

  switch (tab) {
    case EVENTS_PAGE_TABS.DRAFTS:
      return {
        ...baseVariables,
        createdBy: 'me',
        publicationStatus: PublicationStatus.Draft,
        showAll: true,
      };
    case EVENTS_PAGE_TABS.PUBLISHED:
      return {
        ...baseVariables,
        adminUser: true,
        publisher: adminOrganizations,
        publicationStatus: PublicationStatus.Public,
      };
    case EVENTS_PAGE_TABS.WAITING_APPROVAL:
      return {
        ...baseVariables,
        adminUser: true,
        publisher: adminOrganizations,
        publicationStatus: PublicationStatus.Draft,
      };
  }
};

export const getEventsQuerySkip = (
  tab: EVENTS_PAGE_TABS,
  adminOrganizations: string[]
): boolean => {
  switch (tab) {
    case EVENTS_PAGE_TABS.DRAFTS:
      return false;
    case EVENTS_PAGE_TABS.PUBLISHED:
    case EVENTS_PAGE_TABS.WAITING_APPROVAL:
      return !adminOrganizations.length;
  }
};

export const getEventDateText = (
  endTime: Date | null,
  startTime: Date | null
): string => {
  if (startTime && endTime) {
    return isSameDay(new Date(startTime), new Date(endTime))
      ? formatDate(new Date(startTime))
      : `${formatDate(new Date(startTime))} – ${formatDate(new Date(endTime))}`;
  } else if (startTime) {
    return `${formatDate(new Date(startTime))} –`;
  } else if (endTime) {
    return `– ${formatDate(new Date(endTime))}`;
  }
  return '-';
};
