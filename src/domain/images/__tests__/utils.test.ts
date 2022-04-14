import { ROUTES } from '../../../constants';
import { IMAGE_SEARCH_PARAMS, IMAGE_SORT_OPTIONS } from '../constants';
import { ImageSearchParam } from '../types';
import { getImageParamValue } from '../utils';

describe('getImageParamValue function', () => {
  it('should get page value', () => {
    expect(
      getImageParamValue({
        param: IMAGE_SEARCH_PARAMS.PAGE,
        value: '3',
      })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getImageParamValue({
        param: IMAGE_SEARCH_PARAMS.SORT,
        value: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
      })
    ).toBe(IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME);
  });

  it('should get text value', () => {
    expect(
      getImageParamValue({
        param: IMAGE_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getImageParamValue({
        param: IMAGE_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.IMAGES}`,
      })
    ).toBe(ROUTES.IMAGES);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getImageParamValue({
        param: 'unsupported' as ImageSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
