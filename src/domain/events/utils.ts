import { ApolloClient } from '@apollo/client';
import capitalize from 'lodash/capitalize';

import {
  EventsQueryVariables,
  EventTypeId,
  PublicationStatus,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import { store } from '../app/store/store';
import { EVENT_TYPE } from '../event/constants';
import { getEventSearchInitialValues } from '../eventSearch/utils';
import { setEventListOptions } from './actions';
import {
  EVENT_LIST_INCLUDES,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
} from './constants';

export const eventsPathBuilder = ({
  args,
}: PathBuilderProps<EventsQueryVariables>) => {
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
      value: eventType
        ?.filter((type) =>
          (Object.values(EVENT_TYPE) as string[]).includes(
            (type as string).toLowerCase()
          )
        )
        .map((type) => capitalize(type as string)),
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

export const clearEventsQueries = (apolloClient: ApolloClient<object>) => {
  apolloClient.cache.evict({ id: 'ROOT_QUERY', fieldName: 'events' });
};

/* instanbul ignore next */
export const clearEventQuery = (
  apolloClient: ApolloClient<object>,
  eventId: string
) => {
  apolloClient.cache.evict({ id: `Event:${eventId}` });
};

export const getEventsQueryVariables = ({
  adminOrganizations,
  search = '',
  tab,
}: {
  adminOrganizations: string[];
  search?: string;
  tab: EVENTS_PAGE_TABS;
}) => {
  const { text, types } = getEventSearchInitialValues(search);

  const baseVariables = {
    createPath: getPathBuilder(eventsPathBuilder),
    eventType: types as EventTypeId[],
    include: EVENT_LIST_INCLUDES,
    pageSize: EVENTS_PAGE_SIZE,
    superEvent: 'none',
    text,
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
) => {
  switch (tab) {
    case EVENTS_PAGE_TABS.DRAFTS:
      return false;
    case EVENTS_PAGE_TABS.PUBLISHED:
    case EVENTS_PAGE_TABS.WAITING_APPROVAL:
      return !adminOrganizations.length;
  }
};

export const resetEventListPage = () => {
  store.dispatch(setEventListOptions({ page: 1 }));
};
