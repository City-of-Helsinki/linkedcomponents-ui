/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { ROUTES } from '../../../constants';
import { PRICE_GROUP_SEARCH_PARAMS } from '../../priceGroup/constants';
import { PRICE_GROUP_SORT_OPTIONS } from '../constants';
import { PriceGroupSearchParam } from '../types';
import { getBooleanText, getPriceGroupParamValue } from '../utils';

describe('getBooleanText function', () => {
  it.each([
    [false, 'Ei'],
    [true, 'Kyllä'],
  ])('should return correct text, $s ->4s ', (val, expectedText) => {
    expect(getBooleanText(val, i18n.t.bind(i18n))).toBe(expectedText);
  });
});

describe('getPriceGroupParamValue function', () => {
  it('should get page value', () => {
    expect(
      getPriceGroupParamValue({
        param: PRICE_GROUP_SEARCH_PARAMS.PAGE,
        value: '3',
      })
    ).toBe('3');
  });

  it('should get sort value', () => {
    expect(
      getPriceGroupParamValue({
        param: PRICE_GROUP_SEARCH_PARAMS.SORT,
        value: PRICE_GROUP_SORT_OPTIONS.ID,
      })
    ).toBe(PRICE_GROUP_SORT_OPTIONS.ID);
  });

  it('should get text value', () => {
    expect(
      getPriceGroupParamValue({
        param: PRICE_GROUP_SEARCH_PARAMS.TEXT,
        value: 'search',
      })
    ).toBe('search');
  });

  it('should get returnPath without locale', () => {
    expect(
      getPriceGroupParamValue({
        param: PRICE_GROUP_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.PRICE_GROUPS}`,
      })
    ).toBe(ROUTES.PRICE_GROUPS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getPriceGroupParamValue({
        param: 'unsupported' as PriceGroupSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
