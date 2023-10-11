/* eslint-disable max-len */
/* eslint-disable no-console */
import { TimeInputProps } from 'hds-react';
import React from 'react';
import { axe } from 'vitest-axe';

import {
  arrowDownKeyPressHelper,
  arrowLeftKeyPressHelper,
  arrowRightKeyPressHelper,
  arrowUpKeyPressHelper,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import TimeInput from '../TimeInput';

const defaultProps: TimeInputProps = {
  hoursLabel: 'Hours',
  id: 'time-input',
  label: 'timer',
  minutesLabel: 'Minutes',
};

const renderComponent = (props?: Partial<TimeInputProps>) =>
  render(<TimeInput {...defaultProps} {...props} />);

const getElement = (key: 'hoursInput' | 'minutesInput') => {
  switch (key) {
    case 'hoursInput':
      return screen.getByLabelText(defaultProps.hoursLabel, {
        selector: 'input',
      });
    case 'minutesInput':
      return screen.getByLabelText(defaultProps.minutesLabel, {
        selector: 'input',
      });
  }
};

test('should set correct inital values', () => {
  renderComponent({ value: '12:45' });

  const hoursInput = getElement('hoursInput');
  const minutesInput = getElement('minutesInput');

  expect(hoursInput).toHaveValue('12');
  expect(minutesInput).toHaveValue('45');
});

describe('<TimeInput /> spec', () => {
  it('renders the component', () => {
    const { container } = renderComponent();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('should not have basic accessibility issues', async () => {
    const { container } = renderComponent();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should use value property as input value', async () => {
    const { container } = renderComponent({ value: '12:45' });

    const hoursInput = getElement('hoursInput');
    const minutesInput = getElement('minutesInput');

    expect(hoursInput).toHaveValue('12');
    expect(minutesInput).toHaveValue('45');
    expect(container.querySelector('#time-input')).toHaveValue('12:45');
  });

  it('should use defaultValue property as input value', async () => {
    const { container } = renderComponent({ defaultValue: '12:45' });

    const hoursInput = getElement('hoursInput');
    const minutesInput = getElement('minutesInput');

    expect(hoursInput).toHaveValue('12');
    expect(minutesInput).toHaveValue('45');
    expect(container.querySelector('#time-input')).toHaveValue('12:45');
  });

  it('should increase and decrease hour and minutes', async () => {
    const { container } = renderComponent({ defaultValue: '12:45' });

    const hoursInput = getElement('hoursInput');
    const minutesInput = getElement('minutesInput');

    expect(hoursInput).toHaveValue('12');
    arrowDownKeyPressHelper(hoursInput);
    expect(hoursInput).toHaveValue('11');
    arrowUpKeyPressHelper(hoursInput);
    arrowUpKeyPressHelper(hoursInput);
    expect(hoursInput).toHaveValue('13');

    expect(minutesInput).toHaveValue('45');
    arrowDownKeyPressHelper(minutesInput);
    expect(minutesInput).toHaveValue('44');
    arrowUpKeyPressHelper(minutesInput);
    arrowUpKeyPressHelper(minutesInput);
    expect(minutesInput).toHaveValue('46');

    expect(container.querySelector('#time-input')).toHaveValue('13:46');
  });

  it('should update time value when numeric hours and minutes are typed', async () => {
    const { container } = renderComponent();

    await userEvent.type(getElement('hoursInput'), '12');
    await userEvent.type(getElement('minutesInput'), '00');

    expect(container.querySelector('#time-input')).toHaveValue('12:00');
  });

  it('should update time value when numeric hours and minutes are typed', async () => {
    const { container } = renderComponent();

    const hoursInput = getElement('hoursInput');
    await userEvent.type(hoursInput, '1');
    await userEvent.type(getElement('minutesInput'), '5');
    await userEvent.click(hoursInput);

    expect(container.querySelector('#time-input')).toHaveValue('01:05');
  });

  it('should move focus to minutes input when numeric hours is typed', async () => {
    renderComponent();

    await userEvent.type(getElement('hoursInput'), '12');
    expect(getElement('minutesInput')).toHaveFocus();
  });

  it('should move focus with arrow keys', async () => {
    renderComponent();

    const hoursInput = getElement('hoursInput');
    const minutesInput = getElement('minutesInput');

    await userEvent.click(hoursInput);
    expect(hoursInput).toHaveFocus();

    arrowRightKeyPressHelper(hoursInput);
    expect(minutesInput).toHaveFocus();

    arrowLeftKeyPressHelper(minutesInput);
    expect(hoursInput).toHaveFocus();
  });

  it('should set focus hours input by clicking container element', async () => {
    renderComponent();

    const div = screen.getByRole('group');
    const hoursInput = getElement('hoursInput');

    await userEvent.click(div);
    expect(hoursInput).toHaveFocus();
  });

  it('should not update hours value when non-numeric string is typed', async () => {
    renderComponent();

    const hoursInput = getElement('hoursInput');
    await userEvent.type(hoursInput, 'test');
    expect(hoursInput).toHaveValue('');
  });

  it('should not update minutes value when non-numeric string is typed', async () => {
    renderComponent();

    const minutesInput = getElement('hoursInput');
    await userEvent.type(minutesInput, 'test');
    expect(minutesInput).toHaveValue('');
  });

  it('should remove colon from time value when both minutes and hours are missing', async () => {
    const { container } = renderComponent({ defaultValue: '00:00' });

    await userEvent.type(getElement('hoursInput'), '{backspace}');
    await userEvent.type(getElement('minutesInput'), '{backspace}');
    expect(container.querySelector('#time-input')).toHaveValue('');
  });

  it('should console.warn if both value and default value is defined', async () => {
    console.warn = vi.fn();
    renderComponent({
      defaultValue: '12:00',
      value: '12:00',
    });

    expect(console.warn).toBeCalledWith(
      'Use either defaultValue (for uncontrolled components) or value (for controlled components) in HDS TimeInput component.'
    );
  });
});
