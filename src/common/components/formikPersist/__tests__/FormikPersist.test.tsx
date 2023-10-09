/* eslint-disable max-len */
import { act, render, waitFor } from '@testing-library/react';
import { Formik, FormikProps } from 'formik';
import * as React from 'react';
import { vi } from 'vitest';

import Persist from '../FormikPersist';

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

const formName = 'form-name';

const defaultState = {
  values: { name: 'Name from local storage' },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  submitCount: 0,
  initialValues: { name: 'Test name' },
  initialErrors: {},
  initialTouched: {},
  isValid: true,
  dirty: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnMount: false,
};

test('attempts to rehydrate on mount', async () => {
  let injected: Partial<FormikProps<{ name: string }>> = {};

  Storage.prototype.getItem = vi.fn().mockReturnValueOnce(
    JSON.stringify({
      ...defaultState,
      values: { name: 'Name from local storage' },
    })
  );
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  render(
    <Formik initialValues={{ name: 'Test name' }} onSubmit={vi.fn()}>
      {(props: FormikProps<{ name: string }>) => {
        injected = props;

        return (
          <div>
            <Persist name={formName} debounceTime={0}>
              Content
            </Persist>
          </div>
        );
      }}
    </Formik>
  );

  expect(Storage.prototype.getItem).toHaveBeenCalled();

  expect(injected.values?.name).toEqual('Name from local storage');

  act(() => {
    injected.setValues?.({ name: 'changed value' });
  });

  expect(injected.values?.name).toEqual('changed value');

  await waitFor(() => {
    expect(setItemSpy).toHaveBeenCalledWith(
      formName,
      JSON.stringify({ ...defaultState, values: { name: 'changed value' } })
    );
  });
});

test('attempts to rehydrate on mount if session storage is true on props', async () => {
  let injected: Partial<FormikProps<{ name: string }>> = {};

  Storage.prototype.getItem = vi.fn().mockReturnValueOnce(
    JSON.stringify({
      ...defaultState,
      values: { name: 'Name from session storage' },
    })
  );
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

  render(
    <Formik initialValues={{ name: 'Test name' }} onSubmit={vi.fn()}>
      {(props: FormikProps<{ name: string }>) => {
        injected = props;

        return (
          <div>
            <Persist name={formName} debounceTime={0} isSessionStorage={true}>
              Content
            </Persist>
          </div>
        );
      }}
    </Formik>
  );

  expect(sessionStorage.getItem).toHaveBeenCalled();

  expect(injected.values?.name).toEqual('Name from session storage');

  act(() => {
    injected.setValues?.({ name: 'changed value' });
  });

  expect(injected.values?.name).toEqual('changed value');

  await waitFor(() => {
    expect(setItemSpy).toHaveBeenCalledWith(
      formName,
      JSON.stringify({ ...defaultState, values: { name: 'changed value' } })
    );
  });
});
