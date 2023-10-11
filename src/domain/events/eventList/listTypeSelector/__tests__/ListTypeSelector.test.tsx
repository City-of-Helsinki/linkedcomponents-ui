import { IconInfoCircle } from 'hds-react';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ListTypeSelector from '../ListTypeSelector';

configure({ defaultHidden: true });

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

const renderComponent = (onChange = vi.fn()) =>
  render(
    <ListTypeSelector
      caption={caption}
      name="type-selector"
      onChange={onChange}
      options={options}
      value="type1"
    />
  );

const getComponent = (key: 'caption' | 'type1' | 'type2') => {
  switch (key) {
    case 'caption':
      return screen.getByRole('group', { name: caption });
    case 'type1':
      return screen.getByRole('radio', { name: options[0].label });
    case 'type2':
      return screen.getByRole('radio', { name: options[1].label });
  }
};

test('should render component', () => {
  renderComponent();

  getComponent('caption');
  getComponent('type1');
  getComponent('type2');
});

test('should call onChange', async () => {
  const onChange = vi.fn();
  const user = userEvent.setup();

  renderComponent(onChange);

  const type1Radio = getComponent('type1');
  const type2Radio = getComponent('type2');
  expect(type1Radio).toBeChecked();

  await user.click(type2Radio);
  expect(onChange).toBeCalledWith('type2');
});
