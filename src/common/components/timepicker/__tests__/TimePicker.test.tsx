import userEvent from '@testing-library/user-event';
import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import {
  arrowDownKeyPressHelper,
  configure,
  enterKeyPressHelper,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import Timepicker, { Props } from '../Timepicker';

configure({ defaultHidden: true });

const id = 'time-picker';
const defaultLabel = 'Timepicker';

const defaultProps = {
  id,
  invalid: false,
  label: defaultLabel,
  onBlur: jest.fn(),
  onChange: jest.fn(),
  value: '',
};

const renderTimepicker = (props?: Partial<Props>) => {
  const { rerender, ...rest } = render(
    <Timepicker {...defaultProps} {...props} />
  );

  return {
    rerender: (newProps?: Partial<Props>) =>
      rerender(<Timepicker {...defaultProps} {...props} {...newProps} />),
    ...rest,
  };
};

it('autocompletes and selects time when user clicks an option', async () => {
  const onChange = jest.fn();
  const { rerender } = renderTimepicker({
    minuteInterval: 15,
    onChange,
  });

  const input = screen.getByRole('textbox', {
    name: defaultLabel,
  });

  userEvent.type(input, '1');
  rerender({ value: '1' });
  userEvent.type(input, '2');
  rerender({ value: '12' });
  expect(input).toHaveValue('12');

  expect(onChange.mock.calls).toEqual([['1'], ['12']]);

  const option = screen.getByRole('option', { name: '12.15' });
  userEvent.click(option);

  await waitFor(() => expect(onChange).toHaveBeenLastCalledWith('12.15'));

  rerender({ value: '12.15' });
  expect(input).toHaveValue('12.15');

  expect(
    screen.queryByRole('option', { name: '12.15' })
  ).not.toBeInTheDocument();
});

it('autocompletes and selects time when user navigates with keyboard', async () => {
  const onChange = jest.fn();
  const { rerender } = renderTimepicker({ minuteInterval: 15, onChange });

  const input = screen.getByRole('textbox', {
    name: defaultLabel,
  });

  expect(screen.getByRole('listbox').children).toHaveLength(0);

  userEvent.tab();

  expect(screen.getByRole('listbox').children).toHaveLength(96);

  userEvent.type(input, '1');
  rerender({ value: '1' });
  userEvent.type(input, '4');
  rerender({ value: '14' });

  arrowDownKeyPressHelper(input);
  arrowDownKeyPressHelper(input);

  expect(screen.getByRole('option', { name: '14.15' })).toHaveAttribute(
    'aria-selected',
    'true'
  );

  enterKeyPressHelper(input);

  await waitFor(() => expect(onChange).toHaveBeenLastCalledWith('14.15'));
  expect(
    screen.queryByRole('option', { name: '14.15' })
  ).not.toBeInTheDocument();

  expect(screen.getByRole('listbox').children.length).toBe(0);
});

it('should call onBlur', async () => {
  const onBlur = jest.fn();
  const value = '12.15';
  const { container } = renderTimepicker({
    onBlur,
    value,
  });

  const input = screen.getByRole('textbox', {
    name: defaultLabel,
  });

  userEvent.click(input);
  expect(onBlur).not.toBeCalled();

  userEvent.click(container);
  expect(onBlur).toBeCalledWith('12.15');
});

it('should toggle menu by clicking toggle button', () => {
  renderTimepicker();

  expect(
    screen.queryByRole('option', { name: '00.00' })
  ).not.toBeInTheDocument();

  const toggleButton = screen.getByRole('button', {
    name: translations.common.timepicker.accessibility.buttonTimeList,
  });

  userEvent.click(toggleButton);
  expect(screen.queryByRole('option', { name: '00.00' })).toBeInTheDocument();

  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('option', { name: '00.00' })
  ).not.toBeInTheDocument();
});
