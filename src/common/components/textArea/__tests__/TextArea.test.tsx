import React from 'react';

import { render } from '../../../../utils/testUtils';
import TextArea from '../TextArea';

const renderComponent = () =>
  render(
    <TextArea
      id="1"
      label="Text area label"
      placeholder="Text area placeholder"
    />
  );

test('should match snapshot', () => {
  const { container } = renderComponent();

  expect(container).toMatchSnapshot();
});
