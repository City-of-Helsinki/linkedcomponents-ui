import { renderHook } from '@testing-library/react';

import useVatOptions from '../useVatOptions';

const getHookWrapper = () => renderHook(useVatOptions);

it('should return vat options', async () => {
  const { result } = getHookWrapper();

  expect(result.current).toEqual([
    { label: '25,5 %', value: '25.50' },
    { label: '14 %', value: '14.00' },
    { label: '10 %', value: '10.00' },
    { label: '0 %', value: '0.00' },
  ]);
});
