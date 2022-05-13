import { ROUTES } from '../../../constants';
import {
  EventTypeId,
  RegistrationsQueryVariables,
} from '../../../generated/graphql';
import { EVENT_TYPE } from '../../event/constants';
import {
  REGISTRATION_SEARCH_PARAMS,
  REGISTRATION_SORT_OPTIONS,
} from '../constants';
import { RegistrationSearchParam, RegistrationSearchParams } from '../types';
import {
  addParamsToRegistrationQueryString,
  getRegistrationParamValue,
  getRegistrationSearchQuery,
  getRegistrationsQueryVariables,
  registrationsPathBuilder,
  replaceParamsToRegistrationQueryString,
} from '../utils';

describe('addParamsToRegistrationQueryString function', () => {
  const cases: [Partial<RegistrationSearchParams>, string][] = [
    [{ eventType: [EVENT_TYPE.Volunteering] }, '?eventType=volunteering'],
    [{ eventType: [] }, ''],
    [{ page: 3 }, '?page=3'],
    [
      { returnPath: `/fi${ROUTES.REGISTRATIONS}` },
      '?returnPath=%2Fregistrations',
    ],
    [
      { sort: REGISTRATION_SORT_OPTIONS.LAST_MODIFIED_TIME },
      '?sort=last_modified_time',
    ],
    [{ text: 'search' }, '?text=search'],
  ];

  it.each(cases)(
    'should add %p params to search, returns %p',
    (params, expectedResult) => {
      expect(addParamsToRegistrationQueryString('', params)).toBe(
        expectedResult
      );
    }
  );
});

describe('getRegistrationParamValue function', () => {
  it('should get returnPath without locale', () => {
    expect(
      getRegistrationParamValue({
        param: REGISTRATION_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.REGISTRATIONS}`,
      })
    ).toBe(ROUTES.REGISTRATIONS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getRegistrationParamValue({
        param: 'unsupported' as RegistrationSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});

describe('getRegistrationSearchQuery function', () => {
  const defaultParams = {
    [REGISTRATION_SEARCH_PARAMS.TEXT]: 'text',
  };
  const cases: [string, RegistrationSearchParams, string][] = [
    ['', defaultParams, 'text=text'],
    ['', { ...defaultParams, attendeePage: 2 }, 'text=text&attendeePage=2'],
    [
      '',
      { ...defaultParams, enrolmentText: 'text' },
      'text=text&enrolmentText=text',
    ],
    [
      '',
      { ...defaultParams, eventType: [EVENT_TYPE.Volunteering] },
      'text=text&eventType=volunteering',
    ],
    ['', { ...defaultParams, page: 2 }, 'text=text&page=2'],
    [
      '',
      { ...defaultParams, returnPath: `/fi${ROUTES.REGISTRATIONS}` },
      'text=text&returnPath=%2Ffi%2Fregistrations',
    ],
    [
      '?sort=last_modified_time',
      { ...defaultParams },
      'text=text&sort=last_modified_time',
    ],
    ['', { ...defaultParams, waitingPage: 2 }, 'text=text&waitingPage=2'],
    [undefined, { ...defaultParams, text: 'search' }, 'text=search'],
  ];

  it.each(cases)(
    'should get search query %p with params %p, returns %p',
    (search, params, expectedSearch) => {
      expect(getRegistrationSearchQuery(params, search)).toBe(expectedSearch);
    }
  );
});

describe('replaceParamsToRegistrationQueryString', () => {
  const cases: [Partial<RegistrationSearchParams>, string, string][] = [
    [{ attendeePage: 1 }, '?attendeePage=2', '?attendeePage=1'],
    [
      { enrolmentText: 'newText' },
      '?enrolmentText=text',
      '?enrolmentText=newText',
    ],
    [
      { eventType: [EVENT_TYPE.Volunteering, EVENT_TYPE.Course] },
      '?eventType=volunteering',
      '?eventType=volunteering&eventType=course',
    ],
    [{ page: 2 }, '?page=3', '?page=2'],
    [
      { returnPath: `/fi${ROUTES.REGISTRATIONS}` },
      '?returnPath=%2Fsearch',
      '?returnPath=%2Fregistrations',
    ],
    [
      { sort: REGISTRATION_SORT_OPTIONS.LAST_MODIFIED_TIME },
      '?sort=-name',
      '?sort=last_modified_time',
    ],
    [{ text: 'search' }, '?text=text1', '?text=search'],
    [{ waitingPage: 1 }, '?waitingPage=2', '?waitingPage=1'],
  ];

  it.each(cases)(
    'should replace %p params to search %p, returns %p',
    (params, search, expectedResult) => {
      expect(replaceParamsToRegistrationQueryString(search, params)).toBe(
        expectedResult
      );
    }
  );
});

describe('getRegistrationsQueryVariables', () => {
  const defaultVariables: RegistrationsQueryVariables = {
    adminUser: true,
    createPath: undefined,
    eventType: [],
    page: 1,
    pageSize: 10,
    text: '',
  };
  const testCases: [string, RegistrationsQueryVariables][] = [
    ['', defaultVariables],
    [
      '?eventType=general&eventType=course',
      {
        ...defaultVariables,
        eventType: [EventTypeId.General, EventTypeId.Course],
      },
    ],
    ['?page=2', { ...defaultVariables, page: 2 }],
    ['?text=search', { ...defaultVariables, text: 'search' }],
  ];
  it.each(testCases)(
    'should get registrations query variables, search %p',
    (search, expectedVariables) =>
      expect(getRegistrationsQueryVariables(search)).toEqual(expectedVariables)
  );
});

describe('registrationsPathBuilder function', () => {
  const cases: [RegistrationsQueryVariables, string][] = [
    [
      { adminUser: true },
      '/registration/?admin_user=true&event_type=Course,General,Volunteering',
    ],
    [
      { eventType: [EventTypeId.Course, EventTypeId.General] },
      '/registration/?event_type=Course,General',
    ],
    [
      { page: 2 },
      '/registration/?event_type=Course,General,Volunteering&page=2',
    ],
    [
      { pageSize: 10 },
      '/registration/?event_type=Course,General,Volunteering&page_size=10',
    ],
    [
      { text: 'text' },
      '/registration/?event_type=Course,General,Volunteering&text=text',
    ],
  ];

  it.each(cases)(
    'should create registrations request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(registrationsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
