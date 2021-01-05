import { IconInfoCircle } from 'hds-react/icons';
import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import ListTypeSelector from '../ListTypeSelector';

const caption = 'Select type';
const options = [
  {
    icon: <IconInfoCircle />,
    label: 'Type 1',
    value: 'type1',
  },
  {
    icon: <IconInfoCircle />,
    label: 'Type 2',
    value: 'type2',
  },
];

const renderComponent = (onChange = jest.fn()) =>
  render(
    <ListTypeSelector
      caption={caption}
      name="type-selector"
      onChange={onChange}
      options={options}
      value="type1"
    />
  );

const findComponent = (key: 'caption' | 'type1' | 'type2') => {
  switch (key) {
    case 'caption':
      return screen.findByRole('group', { name: caption });
    case 'type1':
      return screen.findByRole('radio', { name: options[0].label });
    case 'type2':
      return screen.findByRole('radio', { name: options[1].label });
  }
};

test('should render component', async () => {
  renderComponent();

  await findComponent('caption');
  await findComponent('type1');
  await findComponent('type2');
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  renderComponent(onChange);

  const type1Radio = await findComponent('type1');
  const type2Radio = await findComponent('type2');
  expect(type1Radio).toBeChecked();

  userEvent.click(type2Radio);
  expect(onChange).toBeCalledWith('type2');
});
