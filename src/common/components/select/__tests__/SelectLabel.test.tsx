import { render } from '@testing-library/react';
import React from 'react';

import SelectLabel from '../SelectLabel';

test('should match snapshot', () => {
  const { container } = render(<SelectLabel text="Label text" nEvents={10} />);
  expect(container.innerHTML).toMatchSnapshot();
});
