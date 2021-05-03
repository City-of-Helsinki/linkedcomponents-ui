import React from 'react';

import { render } from '../../../../utils/testUtils';
import Partner from '../Partner';

test('should match snapshot', () => {
  const { container } = render(
    <Partner
      href="www.testurl.com"
      imageUrl={'www.imageurl.com'}
      name="Partner name"
    />
  );

  expect(container).toMatchSnapshot();
});
