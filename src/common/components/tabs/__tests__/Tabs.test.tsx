import React from 'react';

import {
  arrowLeftKeyPressHelper,
  arrowRightKeyPressHelper,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import TabPanel from '../TabPanel';
import Tabs from '../Tabs';

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

const findComponent = (
  key: 'panel1' | 'panel2' | 'panel3' | 'tab1' | 'tab2' | 'tab3'
) => {
  switch (key) {
    case 'panel1':
      return screen.findByRole('tabpanel', { name: 'Tab 1' });
    case 'panel2':
      return screen.findByRole('tabpanel', { name: 'Tab 2' });
    case 'panel3':
      return screen.findByRole('tabpanel', { name: 'Tab 2' });
    case 'tab1':
      return screen.findByRole('tab', { name: 'Tab 1' });
    case 'tab2':
      return screen.findByRole('tab', { name: 'Tab 2' });
    case 'tab3':
      return screen.findByRole('tab', { name: 'Tab 3' });
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

test('renders the component', async () => {
  const { container } = renderComponent();

  await findComponent('panel1');
  await findComponent('tab1');
  await findComponent('tab2');
  await findComponent('tab3');
  expect(
    screen.queryByRole('tabpanel', { name: 'Tab 2' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('tabpanel', { name: 'Tab 3' })
  ).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});

test('should call onKeyDown and change focused tab', async () => {
  renderComponent();

  const tab1 = await findComponent('tab1');
  const tab2 = await findComponent('tab2');
  const tab3 = await findComponent('tab3');
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
  renderComponent(onChange);

  const tab1 = await findComponent('tab1');
  const tab2 = await findComponent('tab2');
  expect(tab1).toHaveFocus();

  userEvent.click(tab2);
  expect(tab2).toHaveFocus();
  expect(onChange).toBeCalledWith('tab2');
});
