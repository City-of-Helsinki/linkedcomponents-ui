import { ROUTES } from '../../../constants';
import { EventsQueryVariables } from '../../../generated/graphql';
import { EVENT_TYPE } from '../../event/constants';
import { EVENT_SORT_OPTIONS } from '../../events/constants';
import { EVENT_SEARCH_PARAMS } from '../constants';
import { EventSearchParam, EventSearchParams } from '../types';
import {
  addParamsToEventQueryString,
  getEventParamValue,
  getEventSearchQuery,
  getEventsQueryVariables,
  replaceParamsToEventQueryString,
} from '../utils';

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

describe('getEventsQueryVariables', () => {
  const defaultVariables = {
    createPath: undefined,
    end: null,
    eventType: [],
    include: ['in_language', 'location'],
    location: [],
    page: 1,
    pageSize: 10,
    sort: '-last_modified_time',
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

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getEventParamValue({
        param: 'unsupported' as EventSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
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
