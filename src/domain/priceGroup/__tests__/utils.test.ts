import { PriceGroupsQueryVariables } from '../../../generated/graphql';
import { PriceGroupOption } from '../types';
import { priceGroupsPathBuilder, sortPriceGroupOptions } from '../utils';

describe('priceGroupsPathBuilder function', () => {
  const cases: [PriceGroupsQueryVariables, string][] = [
    [{ description: 'test' }, '/price_group/?description=test'],
    [{ isFree: false }, '/price_group/?is_free=false'],
    [{ isFree: true }, '/price_group/?is_free=true'],
    [{ page: 3 }, '/price_group/?page=3'],
    [{ pageSize: 10 }, '/price_group/?page_size=10'],
    [{ publisher: 'test' }, '/price_group/?publisher=test'],
  ];

  it.each(cases)(
    'should build correct path, with valiables %p',
    (variables, expectedPath) =>
      expect(priceGroupsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('sortPriceGroupOptions function', () => {
  it('should build price group options', () => {
    const option1: PriceGroupOption = {
      label: 'Price group 1',
      isFree: false,
      value: '1',
    };

    const option2: PriceGroupOption = {
      label: 'Second price group',
      isFree: false,
      value: '2',
    };

    const option3: PriceGroupOption = {
      label: 'Hintaryhmä 3',
      isFree: false,
      value: '3',
    };

    expect([option1, option2, option3].sort(sortPriceGroupOptions)).toEqual([
      option3,
      option1,
      option2,
    ]);
  });
});
