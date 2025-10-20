import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';
import isSameYear from 'date-fns/isSameYear';
import isValid from 'date-fns/isValid';
import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { DATE_FORMAT, DATE_FORMAT_API } from '../../constants';
import {
  EventsQueryVariables,
  EventStatus,
  EventTypeId,
  PublicationStatus,
  SuperEventType,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import formatDate from '../../utils/formatDate';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import { getSearchQuery } from '../../utils/searchUtils';
import skipFalsyType from '../../utils/skipFalsyType';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { EVENT_TYPE } from '../event/constants';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENT_SEARCH_PARAMS,
  EVENT_SORT_OPTIONS,
  EventListOptionsActionTypes,
  EVENTS_PAGE_SIZE,
  EVENTS_PAGE_TABS,
  ExpandedEventsActionTypes,
} from './constants';
import {
  EventListOptionsAction,
  EventListOptionsState,
  EventSearchInitialValues,
  EventSearchParam,
  EventSearchParams,
  ExpandedEventsAction,
} from './types';

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
    eventStatus,
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
    registration,
    registrationAdminUser,
    showAll,
    sort,
    start,
    startsAfter,
    startsBefore,
    superEvent,
    superEventType,
    translation,
    x_full_text,
    x_full_text_language,
  } = args;

  const variableToKeyItems = [
    { key: 'admin_user', value: adminUser },
    { key: 'created_by', value: createdBy },
    { key: 'combined_text', value: combinedText },
    { key: 'division', value: division },
    { key: 'end', value: end },
    { key: 'ends_after', value: endsAfter },
    { key: 'ends_before', value: endsBefore },
    { key: 'event_status', value: eventStatus },
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
    { key: 'registration', value: registration },
    { key: 'registration_admin_user', value: registrationAdminUser },
    { key: 'show_all', value: showAll },
    { key: 'sort', value: sort },
    { key: 'start', value: start },
    { key: 'starts_after', value: startsAfter },
    { key: 'starts_before', value: startsBefore },
    { key: 'super_event', value: superEvent },
    { key: 'super_event_type', value: superEventType },
    { key: 'translation', value: translation },
    { key: 'x_full_text', value: x_full_text },
    { key: 'x_full_text_language', value: x_full_text_language },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/event/${query}`;
};

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
    case EVENTS_PAGE_TABS.OWN_PUBLISHED:
      return {
        ...baseVariables,
        createdBy: 'me',
        publicationStatus: PublicationStatus.Public,
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
        start: 'now',
      };
  }
};

export const getEventsQuerySkip = (
  tab: EVENTS_PAGE_TABS,
  adminOrganizations: string[]
): boolean => {
  switch (tab) {
    case EVENTS_PAGE_TABS.DRAFTS:
    case EVENTS_PAGE_TABS.OWN_PUBLISHED:
      return false;
    case EVENTS_PAGE_TABS.PUBLISHED:
    case EVENTS_PAGE_TABS.WAITING_APPROVAL:
      return !adminOrganizations.length;
  }
};

export const getEventSearchInitialValues = (
  search: string
): EventSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const eventStatus = searchParams
    .getAll(EVENT_SEARCH_PARAMS.EVENT_STATUS)
    .map((s) =>
      Object.values(EventStatus).find(
        (v) => v.toLocaleLowerCase() === s.toLocaleLowerCase()
      )
    )
    .filter(skipFalsyType);
  const page = searchParams.get(EVENT_SEARCH_PARAMS.PAGE);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const publisher = searchParams.getAll(EVENT_SEARCH_PARAMS.PUBLISHER);
  const sort = searchParams.get(EVENT_SEARCH_PARAMS.SORT) as EVENT_SORT_OPTIONS;
  const start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  const fullText = searchParams.get(EVENT_SEARCH_PARAMS.FULL_TEXT);
  const types = searchParams.getAll(EVENT_SEARCH_PARAMS.TYPE) as EVENT_TYPE[];

  return {
    end: end && isValid(new Date(end)) ? new Date(end) : null,
    eventStatus,
    page: Number(page) || 1,
    places,
    publisher,
    sort: Object.values(EVENT_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_EVENT_SORT,
    start: start && isValid(new Date(start)) ? new Date(start) : null,
    types,
    fullText: getValue(fullText, ''),
  };
};

export const getEventsQueryVariables = (
  search: string,
  locale: Language,
  baseVariables?: EventsQueryVariables
): EventsQueryVariables => {
  const searchParams = new URLSearchParams(search);

  let start = null;

  if (searchParams.get(EVENT_SEARCH_PARAMS.START)) {
    start = searchParams.get(EVENT_SEARCH_PARAMS.START);
  } else if (baseVariables?.start) {
    start = baseVariables.start;
  }

  const end = searchParams.get(EVENT_SEARCH_PARAMS.END);
  const places = searchParams.getAll(EVENT_SEARCH_PARAMS.PLACE);
  const publisher = searchParams.getAll(EVENT_SEARCH_PARAMS.PUBLISHER);

  const { eventStatus, page, sort, fullText, types } =
    getEventSearchInitialValues(search);

  return {
    createPath: getPathBuilder(eventsPathBuilder),
    end,
    eventStatus,
    eventType: types.map((type) => capitalize(type)) as EventTypeId[],
    include: EVENT_LIST_INCLUDES,
    location: places,
    page,
    pageSize: EVENTS_PAGE_SIZE,
    publisher,
    sort,
    start,
    x_full_text: fullText,
    x_full_text_language: locale,
  };
};

export const getEventSearchQuery = (
  { end, start, ...rest }: Omit<EventSearchParams, 'sort'>,
  search = ''
): string => {
  const { sort } = getEventSearchInitialValues(search);

  return getSearchQuery({
    ...rest,
    end: end ? formatDate(end, DATE_FORMAT_API) : undefined,
    sort: sort !== DEFAULT_EVENT_SORT ? sort : null,
    start: start ? formatDate(start, DATE_FORMAT_API) : undefined,
  });
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

export const getSuperEventTypeText = (
  superEventType: SuperEventType | null | undefined,
  t: TFunction
) => {
  if (superEventType) {
    const superEventText = t(`event.superEventType.${superEventType}`);
    return `(${superEventText})`;
  }

  return '';
};

const getEventTimeFormat = (language: Language) => {
  const timeFormats = {
    en: 'h:mm aaa',
    fi: 'HH.mm',
    sv: 'HH:mm',
  };
  return timeFormats[language];
};

const formatEventDateAndTime = (date: Date, language: Language) => {
  const timeFormat = getEventTimeFormat(language);
  return formatDate(date, `${DATE_FORMAT}, ${timeFormat}`, language);
};

const formatEventStartAndEndTime = (
  startTime: Date,
  endTime: Date,
  language: Language
) => {
  const timeFormat = getEventTimeFormat(language);
  let startDateStr = formatDate(startTime);
  const endDateStr = formatDate(endTime);

  if (isSameDay(startTime, endTime)) {
    const startTimeStr = formatDate(startTime, timeFormat, language);
    const endTimeStr = formatDate(endTime, timeFormat, language);
    const timeStr = `${startTimeStr} – ${endTimeStr}`;

    return [endDateStr, timeStr].join(', ');
  }

  if (isSameMonth(startTime, endTime)) {
    startDateStr = formatDate(startTime, 'd');
  } else if (isSameYear(startTime, endTime)) {
    startDateStr = formatDate(startTime, 'd.M');
  }
  return `${startDateStr} – ${endDateStr}`;
};

export const getEventTimeStr = ({
  endTime,
  language,
  startTime,
}: {
  endTime: Date | null;
  language: Language;
  startTime: Date | null;
}): string => {
  if (startTime && endTime) {
    return formatEventStartAndEndTime(startTime, endTime, language);
  } else if (startTime) {
    const startDateAndTime = formatEventDateAndTime(startTime, language);

    return `${startDateAndTime} –`;
  } else if (endTime) {
    const endDateAndTime = formatEventDateAndTime(endTime, language);

    return `– ${endDateAndTime}`;
  }
  return '';
};

export const getEventParamValue = ({
  param,
  value,
}: {
  param: EventSearchParam;
  value: string;
}): string => {
  switch (param) {
    case EVENT_SEARCH_PARAMS.END:
    case EVENT_SEARCH_PARAMS.START:
      return formatDate(new Date(value), DATE_FORMAT_API);
    case EVENT_SEARCH_PARAMS.EVENT_STATUS:
    case EVENT_SEARCH_PARAMS.FULL_TEXT:
    case EVENT_SEARCH_PARAMS.FULL_TEXT_LANGUAGE:
    case EVENT_SEARCH_PARAMS.PAGE:
    case EVENT_SEARCH_PARAMS.PLACE:
    case EVENT_SEARCH_PARAMS.PUBLISHER:
    case EVENT_SEARCH_PARAMS.SORT:
    case EVENT_SEARCH_PARAMS.TYPE:
      return value;
    case EVENT_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown event query parameter');
  }
};

export const addParamsToEventQueryString = (
  queryString: string,
  queryParams: Partial<EventSearchParams>
): string => {
  return addParamsToQueryString<EventSearchParams>(
    queryString,
    queryParams,
    getEventParamValue
  );
};

export const replaceParamsToEventQueryString = (
  queryString: string,
  queryParams: Partial<EventSearchParams>
): string => {
  return replaceParamsToQueryString<EventSearchParams>(
    queryString,
    queryParams,
    getEventParamValue
  );
};

export const getEventItemId = (id: string): string => `event-item-${id}`;

export const addExpandedEvent = ({
  dispatchExpandedEventsState,
  id,
}: {
  dispatchExpandedEventsState: React.Dispatch<ExpandedEventsAction>;
  id: string;
}) => {
  dispatchExpandedEventsState({
    type: ExpandedEventsActionTypes.ADD_EXPANDED_EVENT,
    payload: id,
  });
};

export const removeExpandedEvent = ({
  dispatchExpandedEventsState,
  id,
}: {
  dispatchExpandedEventsState: React.Dispatch<ExpandedEventsAction>;
  id: string;
}) => {
  dispatchExpandedEventsState({
    type: ExpandedEventsActionTypes.REMOVE_EXPANDED_EVENT,
    payload: id,
  });
};

export const setEventListOptions = ({
  dispatchListOptionsState,
  listOptions,
}: {
  dispatchListOptionsState: React.Dispatch<EventListOptionsAction>;
  listOptions: Partial<EventListOptionsState>;
}) => {
  dispatchListOptionsState({
    type: EventListOptionsActionTypes.SET_EVENT_LIST_OPTIONS,
    payload: listOptions,
  });
};
