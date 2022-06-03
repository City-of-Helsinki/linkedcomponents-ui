import { ROUTES } from '../../../constants';
import {
  EventsQueryVariables,
  EventTypeId,
  PublicationStatus,
} from '../../../generated/graphql';
import { EVENT_TYPE } from '../../event/constants';
import {
  DEFAULT_EVENT_SORT,
  EVENT_LIST_INCLUDES,
  EVENT_SEARCH_PARAMS,
  EVENT_SORT_OPTIONS,
} from '../constants';
import { EventSearchParam, EventSearchParams } from '../types';
import {
  addParamsToEventQueryString,
  eventsPathBuilder,
  getEventParamValue,
  getEventSearchQuery,
  getEventsQueryVariables,
  replaceParamsToEventQueryString,
} from '../utils';

describe('eventsPathBuilder function', () => {
  const cases: [EventsQueryVariables, string][] = [
    [
      { adminUser: true },
      '/event/?admin_user=true&event_type=Course,General,Volunteering',
    ],
    [
      { combinedText: ['text1', 'text2'] },
      '/event/?combined_text=text1,text2&event_type=Course,General,Volunteering',
    ],
    [
      { createdBy: 'me' },
      '/event/?created_by=me&event_type=Course,General,Volunteering',
    ],
    [
      { division: ['division1', 'division2'] },
      '/event/?division=division1,division2&event_type=Course,General,Volunteering',
    ],
    [
      { end: '2020-12-12' },
      '/event/?end=2020-12-12&event_type=Course,General,Volunteering',
    ],
    [
      { endsAfter: '14' },
      '/event/?ends_after=14&event_type=Course,General,Volunteering',
    ],
    [
      { endsBefore: '14' },
      '/event/?ends_before=14&event_type=Course,General,Volunteering',
    ],
    [
      { eventType: [EventTypeId.Course, EventTypeId.General] },
      '/event/?event_type=Course,General',
    ],
    [
      { include: ['include1', 'include2'] },
      '/event/?event_type=Course,General,Volunteering&include=include1,include2',
    ],
    [
      { inLanguage: 'fi' },
      '/event/?event_type=Course,General,Volunteering&in_language=fi',
    ],
    [
      { isFree: true },
      '/event/?event_type=Course,General,Volunteering&is_free=true',
    ],
    [
      { isFree: false },
      '/event/?event_type=Course,General,Volunteering&is_free=false',
    ],
    [
      { keyword: ['keyword1', 'keyword2'] },
      '/event/?event_type=Course,General,Volunteering&keyword=keyword1,keyword2',
    ],
    [
      { keywordAnd: ['keyword1', 'keyword2'] },
      '/event/?event_type=Course,General,Volunteering&keyword_AND=keyword1,keyword2',
    ],
    [
      { keywordNot: ['keyword1', 'keyword2'] },
      '/event/?event_type=Course,General,Volunteering&keyword!=keyword1,keyword2',
    ],
    [
      { language: 'fi' },
      '/event/?event_type=Course,General,Volunteering&language=fi',
    ],
    [
      { location: ['location1', 'location2'] },
      '/event/?event_type=Course,General,Volunteering&location=location1,location2',
    ],
    [{ page: 2 }, '/event/?event_type=Course,General,Volunteering&page=2'],
    [
      { pageSize: 10 },
      '/event/?event_type=Course,General,Volunteering&page_size=10',
    ],
    [
      { publicationStatus: PublicationStatus.Draft },
      '/event/?event_type=Course,General,Volunteering&publication_status=draft',
    ],
    [
      { publisher: ['publisher1', 'publisher2'] },
      '/event/?event_type=Course,General,Volunteering&publisher=publisher1,publisher2',
    ],
    [
      { showAll: true },
      '/event/?event_type=Course,General,Volunteering&show_all=true',
    ],
    [
      { sort: 'start' },
      '/event/?event_type=Course,General,Volunteering&sort=start',
    ],
    [
      { start: '2020-12-12' },
      '/event/?event_type=Course,General,Volunteering&start=2020-12-12',
    ],
    [
      { startsAfter: '14' },
      '/event/?event_type=Course,General,Volunteering&starts_after=14',
    ],
    [
      { startsBefore: '14' },
      '/event/?event_type=Course,General,Volunteering&starts_before=14',
    ],
    [
      { superEvent: 'hel:123' },
      '/event/?event_type=Course,General,Volunteering&super_event=hel:123',
    ],
    [
      { superEventType: ['type1', 'type2'] },
      '/event/?event_type=Course,General,Volunteering&super_event_type=type1,type2',
    ],
    [
      { text: 'text' },
      '/event/?event_type=Course,General,Volunteering&text=text',
    ],
    [
      { translation: 'fi' },
      '/event/?event_type=Course,General,Volunteering&translation=fi',
    ],
  ];

  it.each(cases)(
    'should create events request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(eventsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('getEventsQueryVariables', () => {
  const defaultVariables = {
    createPath: undefined,
    end: null,
    eventType: [],
    include: EVENT_LIST_INCLUDES,
    location: [],
    page: 1,
    pageSize: 10,
    sort: DEFAULT_EVENT_SORT,
    start: null,
    text: '',
  };
  const testCases: [string, EventsQueryVariables][] = [
    ['', defaultVariables],
    ['?end=2021-05-27', { ...defaultVariables, end: '2021-05-27' }],
    ['?page=2', { ...defaultVariables, page: 2 }],
    [
      '?place=place:1&place=place:2',
      { ...defaultVariables, location: ['place:1', 'place:2'] },
    ],
    ['?sort=name', { ...defaultVariables, sort: 'name' }],
    ['?start=2021-05-27', { ...defaultVariables, start: '2021-05-27' }],
    ['?text=search', { ...defaultVariables, text: 'search' }],
    [
      '?type=general&type=course',
      { ...defaultVariables, eventType: ['General', 'Course'] },
    ],
  ];
  it.each(testCases)(
    'should get events query variables, search %p',
    (search, expectedVariables) =>
      expect(getEventsQueryVariables(search)).toEqual(expectedVariables)
  );
});

describe('getEventSearchQuery function', () => {
  const defaultParams = {
    [EVENT_SEARCH_PARAMS.TEXT]: 'text',
  };
  const cases: [string, EventSearchParams, string][] = [
    ['', defaultParams, 'text=text'],
    [
      '',
      { ...defaultParams, end: new Date('2021-12-12') },
      'text=text&end=2021-12-12',
    ],
    ['', { ...defaultParams, page: 2 }, 'text=text&page=2'],
    [
      '',
      { ...defaultParams, place: ['place:1', 'place:2'] },
      'text=text&place=place%3A1&place=place%3A2',
    ],
    [
      '',
      { ...defaultParams, returnPath: `/fi${ROUTES.SEARCH}` },
      'text=text&returnPath=%2Ffi%2Fsearch',
    ],
    ['?sort=name', { ...defaultParams }, 'text=text&sort=name'],
    [
      '',
      { ...defaultParams, start: new Date('2021-12-20') },
      'text=text&start=2021-12-20',
    ],
    ['', { ...defaultParams, text: 'search' }, 'text=search'],
    [
      '',
      { ...defaultParams, type: [EVENT_TYPE.Volunteering] },
      'text=text&type=volunteering',
    ],
  ];

  it.each(cases)(
    'should get search query %p with params %p, returns %p',
    (search, params, expectedSearch) => {
      expect(getEventSearchQuery(params, search)).toBe(expectedSearch);
    }
  );
});

describe('getEventParamValue function', () => {
  it('should get returnPath without locale', () => {
    expect(
      getEventParamValue({
        param: EVENT_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.SEARCH}`,
      })
    ).toBe(ROUTES.SEARCH);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getEventParamValue({
        param: 'unsupported' as EventSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});

describe('addParamsToEventQueryString function', () => {
  const cases: [Partial<EventSearchParams>, string][] = [
    [{ end: new Date('2021-12-12') }, '?end=2021-12-12'],
    [{ page: 3 }, '?page=3'],
    [{ place: ['place:1', 'place:2'] }, '?place=place%3A1&place=place%3A2'],
    [{ returnPath: `/fi${ROUTES.SEARCH}` }, '?returnPath=%2Fsearch'],
    [{ sort: EVENT_SORT_OPTIONS.NAME }, '?sort=name'],
    [{ start: new Date('2021-12-20') }, '?start=2021-12-20'],
    [{ text: 'search' }, '?text=search'],
    [{ type: [EVENT_TYPE.Volunteering] }, '?type=volunteering'],
    [{ type: [] }, ''],
  ];

  it.each(cases)(
    'should add %p params to search, returns %p',
    (params, expectedResult) => {
      expect(addParamsToEventQueryString('', params)).toBe(expectedResult);
    }
  );
});

describe('replaceParamsToEventQueryString', () => {
  const cases: [Partial<EventSearchParams>, string, string][] = [
    [{ end: new Date('2021-12-12') }, '?end=2021-05-27-12', '?end=2021-12-12'],
    [{ page: 2 }, '?page=3', '?page=2'],
    [
      { place: ['place:1', 'place:2'] },
      '?place=place%3A1',
      '?place=place%3A1&place=place%3A2',
    ],
    [
      { returnPath: `/fi${ROUTES.SEARCH}` },
      '?returnPath=%2Fevents',
      '?returnPath=%2Fsearch',
    ],
    [{ sort: EVENT_SORT_OPTIONS.NAME }, '?sort=-name', '?sort=name'],
    [
      { start: new Date('2021-12-20') },
      '?start=2021-10-11',
      '?start=2021-12-20',
    ],
    [{ text: 'search' }, '?text=text1', '?text=search'],
    [{ type: [] }, '?type=volunteering', ''],
  ];

  it.each(cases)(
    'should replace %p params to search %p, returns %p',
    (params, search, expectedResult) => {
      expect(replaceParamsToEventQueryString(search, params)).toBe(
        expectedResult
      );
    }
  );
});
