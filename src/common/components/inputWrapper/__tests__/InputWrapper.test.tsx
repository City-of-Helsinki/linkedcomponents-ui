import { render } from '@testing-library/react';
import React from 'react';

import InputWrapper, { InputWrapperProps } from '../InputWrapper';

const wrapperProps: InputWrapperProps = {
  helperText: 'helper text',
  label: 'label text',
  id: 'test',
  successText: 'Success',
};

it('matched snapshot', () => {
  const { asFragment } = render(
    <InputWrapper {...wrapperProps}>
      <input id="test" />
    </InputWrapper>
  );
  expect(asFragment()).toMatchSnapshot();
});
