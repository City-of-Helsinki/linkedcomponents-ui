import { ROUTES } from '../../../constants';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { EVENT_TYPE } from '../../event/constants';
import {
  REGISTRATION_SEARCH_PARAMS,
  REGISTRATION_SORT_OPTIONS,
} from '../constants';
import { RegistrationSearchParam, RegistrationSearchParams } from '../types';
import {
  addParamsToRegistrationQueryString,
  getRegistrationFields,
  getRegistrationParamValue,
  getRegistrationSearchQuery,
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

describe('getRegistrationFields function', () => {
  it('should return default values if value is not set', () => {
    const {
      currentAttendeeCount,
      currentWaitingAttendeeCapacity,
      enrolmentEndTime,
      enrolmentStartTime,
      id,
      atId,
      maximumAttendeeCount,
      publisher,
      waitingAttendeeCapacity,
    } = getRegistrationFields(
      fakeRegistration({
        currentAttendeeCount: null,
        currentWaitingAttendeeCapacity: null,
        enrolmentEndTime: '',
        enrolmentStartTime: '',
        id: null,
        atId: null,
        maximumAttendeeCount: null,
        publisher: '',
        waitingAttendeeCapacity: null,
      }),
      'fi'
    );

    expect(currentAttendeeCount).toBe(0);
    expect(currentWaitingAttendeeCapacity).toBe(0);
    expect(enrolmentEndTime).toBe(null);
    expect(enrolmentStartTime).toBe(null);
    expect(id).toBe('');
    expect(atId).toBe('');
    expect(maximumAttendeeCount).toBe(0);
    expect(publisher).toBe(null);
    expect(waitingAttendeeCapacity).toBe(0);
  });
});
