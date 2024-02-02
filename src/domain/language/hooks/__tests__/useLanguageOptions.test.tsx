import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import { createCache } from '../../../app/apollo/apolloClient';
import {
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
} from '../../__mocks__/language';
import useLanguageOptions, {
  UseLanguageOptionsProps,
} from '../useLanguageOptions';

const mocks = [mockedLanguagesResponse, mockedServiceLanguagesResponse];

const getHookWrapper = (props?: UseLanguageOptionsProps) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );
  const { result } = renderHook(() => useLanguageOptions(props), {
    wrapper,
  });
  return { result };
};

test('should return language options', async () => {
  const { result } = getHookWrapper();

  await waitFor(() => expect(result.current.length).toBeTruthy());

  expect(result.current).toEqual([
    { label: 'Suomi', value: 'fi' },
    { label: 'Ruotsi', value: 'sv' },
    { label: 'Englanti', value: 'en' },
    { label: 'Arabia', value: 'ar' },
    { label: 'Espanja', value: 'es' },
    { label: 'Kiina', value: 'zh_hans' },
    { label: 'Persia', value: 'fa' },
    { label: 'Ranska', value: 'fr' },
    { label: 'Somali', value: 'so' },
    { label: 'Turkki', value: 'tr' },
    { label: 'Venäjä', value: 'ru' },
    { label: 'Viro', value: 'et' },
  ]);
});

test('should return service language options', async () => {
  const { result } = getHookWrapper({ variables: { serviceLanguage: true } });

  await waitFor(() => expect(result.current.length).toBeTruthy());

  expect(result.current).toEqual([
    { label: 'Suomi', value: 'fi' },
    { label: 'Ruotsi', value: 'sv' },
    { label: 'Englanti', value: 'en' },
  ]);
});
