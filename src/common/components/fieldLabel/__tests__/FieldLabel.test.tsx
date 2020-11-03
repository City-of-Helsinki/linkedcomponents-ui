import { render } from '@testing-library/react';
import React from 'react';

import FieldLabel from '../FieldLabel';

it('matched snapshot', () => {
  const { asFragment } = render(
    <FieldLabel
      hidden={true}
      inputId="test"
      label="foo"
      required
      tooltipLabel="Tooltip label"
      tooltipText="Tooltip text"
    />
  );
  expect(asFragment()).toMatchSnapshot();
});
