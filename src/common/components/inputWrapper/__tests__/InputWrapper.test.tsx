import { render } from '@testing-library/react';
import React from 'react';

import InputWrapper from '../InputWrapper';

const wrapperProps = {
  helperText: 'helper text',
  label: 'label text',
  id: 'test',
};

it('matched snapshot', () => {
  const { asFragment } = render(
    <InputWrapper {...wrapperProps}>
      <input id="test" />
    </InputWrapper>
  );
  expect(asFragment()).toMatchSnapshot();
});
