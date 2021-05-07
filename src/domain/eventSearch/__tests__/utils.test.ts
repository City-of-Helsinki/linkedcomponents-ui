import { ROUTES } from '../../../constants';
import { EVENT_TYPE } from '../../event/constants';
import { EVENT_SORT_OPTIONS } from '../../events/constants';
import { EVENT_SEARCH_PARAMS } from '../constants';
import { EventSearchParam, EventSearchParams } from '../types';
import { addParamsToEventQueryString, getEventParamValue } from '../utils';

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
  ];

  test.each(cases)(
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
