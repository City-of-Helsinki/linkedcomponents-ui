import { renderHook, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { PropsWithChildren } from 'react';

import useMultiSelectFieldProps, {
  UseMultiSelectFieldPropsProps,
} from '../useMultiSelectFieldProps';

const defaultProps: UseMultiSelectFieldPropsProps = {
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
      onChange,
    });

    result.current.handleChange([]);

    await waitFor(() =>
      expect(onChange).toBeCalledWith({ target: { id: 'name', value: [] } })
    );
  });
});
