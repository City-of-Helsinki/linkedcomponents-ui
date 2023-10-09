import { renderHook } from '@testing-library/react';
import { Formik } from 'formik';
import React, { PropsWithChildren } from 'react';
import { vi } from 'vitest';

import useMultiSelectFieldProps, {
  UseMultiSelectFieldPropsProps,
} from '../useMultiSelectFieldProps';

const defaultProps: UseMultiSelectFieldPropsProps = {
  disabled: false,
  name: 'name',
  onBlur: vi.fn(),
  onChange: vi.fn(),
  value: [],
};

const renderMultiSelectFieldPropsHook = (
  props?: Partial<UseMultiSelectFieldPropsProps>
) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <Formik initialValues={{ name: '' }} onSubmit={vi.fn()}>
      {children}
    </Formik>
  );

  return renderHook(
    () =>
      useMultiSelectFieldProps({
        ...defaultProps,
        ...props,
      }),
    { wrapper }
  );
};

describe('useMultiSelectFieldProps', () => {
  it('should call onChange if hook is not disabled', async () => {
    const onChange = vi.fn();
    const { result } = renderMultiSelectFieldPropsHook({
      disabled: false,
      onChange,
    });

    result.current.handleChange([]);

    expect(onChange).toBeCalledWith({ target: { id: 'name', value: [] } });
  });

  it('should not call onChange if hook is disabled', async () => {
    const onChange = vi.fn();
    const { result } = renderMultiSelectFieldPropsHook({
      disabled: true,
      onChange,
    });

    result.current.handleChange([]);

    expect(onChange).not.toBeCalledWith({ target: { id: 'name', value: [] } });
  });
});
