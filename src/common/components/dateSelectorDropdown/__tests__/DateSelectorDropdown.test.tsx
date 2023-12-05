import React from 'react';

import {
  escKeyPressHelper,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import DateSelectorDropdown, {
  DateSelectorProps,
} from '../DateSelectorDropdown';

const defaultProps: DateSelectorProps = {
  onChangeDate: vi.fn(),
  value: {
    endDate: new Date('2021-10-15'),
    startDate: new Date('2021-10-08'),
  },
};

const renderComponent = (props?: Partial<DateSelectorProps>) =>
  render(<DateSelectorDropdown {...defaultProps} {...props} />);

const getElement = (
  key: 'clearButton' | 'endDateInput' | 'startDateInput' | 'toggleButton'
) => {
  switch (key) {
    case 'clearButton':
      return screen.getByRole('button', { name: 'Tyhjennä' });
    case 'endDateInput':
      return screen.getByPlaceholderText('Loppuu p.k.vvvv');
    case 'startDateInput':
      return screen.getByPlaceholderText('Alkaa p.k.vvvv');
    case 'toggleButton':
      return screen.getByRole('button', { name: 'Valitse päivämäärät' });
  }
};

test('should open menu by clicking toggle button', async () => {
  const onChangeDate = vi.fn();
  const user = userEvent.setup();

  renderComponent({ onChangeDate });

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  screen.getByText('8.10.2021 - 15.10.2021');
  getElement('endDateInput');
  getElement('startDateInput');
  getElement('clearButton');
});

test('should close menu with esc button', async () => {
  const onChangeDate = vi.fn();
  const user = userEvent.setup();

  renderComponent({ onChangeDate });

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  getElement('clearButton');

  escKeyPressHelper();
  expect(
    screen.queryByRole('button', { name: 'Tyhjennä' })
  ).not.toBeInTheDocument();
  expect(toggleButton).toHaveFocus();
});

test('should clear start and end date by clicking clear button', async () => {
  const onChangeDate = vi.fn();
  const user = userEvent.setup();

  renderComponent({ onChangeDate });

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  const clearButton = getElement('clearButton');
  await user.click(clearButton);

  expect(onChangeDate).toBeCalledWith('endDate', null);
  expect(onChangeDate).toBeCalledWith('startDate', null);
});
