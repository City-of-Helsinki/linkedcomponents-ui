import React from 'react';

import { render } from '../../../../utils/testUtils';
import SingleSelect from '../SingleSelect';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

const renderComponent = () =>
  render(
    <SingleSelect
      texts={{ label: 'Select label' }}
      options={options}
      onChange={vi.fn()}
    />
  );

test('renders the component', async () => {
  const { container } = renderComponent();

  expect(container).toMatchSnapshot();
});
