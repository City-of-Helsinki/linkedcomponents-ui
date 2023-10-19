import { renderHook } from '@testing-library/react';
import { Formik } from 'formik';
import React, { PropsWithChildren } from 'react';

import useSingleSelectFieldProps, {
  UseSingleSelectFieldPropsProps,
} from '../useSingleSelectFieldProps';

const defaultProps: UseSingleSelectFieldPropsProps = {
  disabled: false,
  name: 'name',
  onBlur: vi.fn(),
  onChange: vi.fn(),
  value: '',
};

const renderSingleSelectFieldPropsHook = (
  props?: Partial<UseSingleSelectFieldPropsProps>
) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <Formik initialValues={{ name: '' }} onSubmit={vi.fn()}>
      {children}
    </Formik>
  );

  return renderHook(
    () =>
      useSingleSelectFieldProps({
        ...defaultProps,
        ...props,
      }),
    { wrapper }
  );
};

describe('useSingleSelectFieldProps', () => {
  it('should call onChange if hook is not disabled', async () => {
    const onChange = vi.fn();
    const { result } = renderSingleSelectFieldPropsHook({
      disabled: false,
      onChange,
    });

    result.current.handleChange(null);

    expect(onChange).toBeCalledWith({ target: { id: 'name', value: null } });
  });

  it('should not call onChange if hook is disabled', async () => {
    const onChange = vi.fn();
    const { result } = renderSingleSelectFieldPropsHook({
      disabled: true,
      onChange,
    });

    result.current.handleChange(null);

    expect(onChange).not.toBeCalledWith({
      target: { id: 'name', value: null },
    });
  });
});
