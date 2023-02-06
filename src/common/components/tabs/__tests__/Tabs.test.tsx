import React from 'react';

import {
  arrowLeftKeyPressHelper,
  arrowRightKeyPressHelper,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import TabPanel from '../tabPanel/TabPanel';
import Tabs from '../Tabs';

configure({ defaultHidden: true });

const options = [
  {
    isCompleted: true,
    label: 'Tab 1',
    value: 'tab1',
  },
  {
    isCompleted: false,
    label: 'Tab 2',
    value: 'tab2',
  },
  {
    isCompleted: false,
    label: 'Tab 3',
    value: 'tab3',
  },
];

const getElement = (
  key: 'panel1' | 'panel2' | 'panel3' | 'tab1' | 'tab2' | 'tab3'
) => {
  switch (key) {
    case 'panel1':
      return screen.getByRole('tabpanel', { name: 'Tab 1' });
    case 'panel2':
      return screen.getByRole('tabpanel', { name: 'Tab 2' });
    case 'panel3':
      return screen.getByRole('tabpanel', { name: 'Tab 2' });
    case 'tab1':
      return screen.getByRole('tab', { name: 'Tab 1' });
    case 'tab2':
      return screen.getByRole('tab', { name: 'Tab 2' });
    case 'tab3':
      return screen.getByRole('tab', { name: 'Tab 3' });
  }
};

const renderComponent = (onChange = jest.fn()) =>
  render(
    <Tabs activeTab="tab1" name="tabs" onChange={onChange} options={options}>
      <TabPanel>Panel 1</TabPanel>
      <TabPanel>Panel 2</TabPanel>
      <TabPanel>Panel 3</TabPanel>
    </Tabs>
  );

test('renders the component', () => {
  const { container } = renderComponent();

  getElement('panel1');
  getElement('tab1');
  getElement('tab2');
  getElement('tab3');

  expect(
    screen.queryByRole('tabpanel', { name: 'Tab 2' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('tabpanel', { name: 'Tab 3' })
  ).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test('should call onKeyDown and change focused tab', async () => {
  const user = userEvent.setup();
  renderComponent();

  const tab1 = getElement('tab1');
  const tab2 = getElement('tab2');
  const tab3 = getElement('tab3');
  await user.click(tab1);
  expect(tab1).toHaveFocus();

  arrowRightKeyPressHelper(tab1);
  expect(tab2).toHaveFocus();
  arrowRightKeyPressHelper(tab2);
  expect(tab3).toHaveFocus();
  arrowLeftKeyPressHelper(tab3);
  expect(tab2).toHaveFocus();
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  renderComponent(onChange);

  const tab1 = getElement('tab1');
  const tab2 = getElement('tab2');
  await user.click(tab1);
  expect(tab1).toHaveFocus();

  await user.click(tab2);
  expect(tab2).toHaveFocus();
  expect(onChange).toBeCalledWith('tab2');
});
