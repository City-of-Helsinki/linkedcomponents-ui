import { ROUTES } from '../../../constants';
import { PLACE_SEARCH_PARAMS, PLACE_SORT_OPTIONS } from '../constants';
import { PlaceSearchParam } from '../types';
import { getPlaceParamValue } from '../utils';

describe('getPlaceParamValue function', () => {
  it('should get page value', () => {
    expect(
      getPlaceParamValue({ param: PLACE_SEARCH_PARAMS.PAGE, value: '3' })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getPlaceParamValue({
        param: PLACE_SEARCH_PARAMS.SORT,
        value: PLACE_SORT_OPTIONS.ID,
      })
    ).toBe(PLACE_SORT_OPTIONS.ID);
  });

  it('should get text value', () => {
    expect(
      getPlaceParamValue({ param: PLACE_SEARCH_PARAMS.TEXT, value: 'search' })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getPlaceParamValue({
        param: PLACE_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.PLACES}`,
      })
    ).toBe(ROUTES.PLACES);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getPlaceParamValue({
        param: 'unsupported' as PlaceSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
