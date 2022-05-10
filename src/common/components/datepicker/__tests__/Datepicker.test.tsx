import userEvent from '@testing-library/user-event';
import formatDate from 'date-fns/format';
import { fi } from 'date-fns/locale';
import { advanceTo } from 'jest-date-mock';
import React from 'react';

import {
  act,
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import Datepicker, { DatepickerProps } from '../Datepicker';

configure({ defaultHidden: true });

const getTestDate = (daysFromToday = 0): Date => {
  const date = new Date();

  date.setDate(date.getDate() + daysFromToday);
  date.setHours(0, 0, 0, 0);
  return date;
};

const defaultProps: DatepickerProps = {
  id: 'datepicker',
  onChange: jest.fn(),
  onBlur: jest.fn(),
  value: new Date('2020-06-05'),
  label: 'Datepicker',
};

const renderDatepicker = (props?: Partial<DatepickerProps>) => {
  const { rerender, ...rest } = render(
    <Datepicker {...defaultProps} {...props} />
  );

  return {
    rerender: (newProps: Partial<DatepickerProps>) =>
      rerender(<Datepicker {...defaultProps} {...props} {...newProps} />),
    ...rest,
  };
};

const pressKey = ({ key, keyCode }: { key: string; keyCode?: number }) => {
  fireEvent.keyDown(document.activeElement || document.body, {
    key,
    keyCode,
  });
};

advanceTo('2020-07-05');

const getElement = (key: 'toggleButton') => {
  switch (key) {
    case 'toggleButton':
      return screen.getByRole('button', { name: /valitse päivämäärä/i });
  }
};

describe('<Datepicker />', () => {
  it('should toggle datepicker by clicking toggle button', async () => {
    const user = userEvent.setup();
    renderDatepicker({ value: new Date('2020-07-05') });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(/heinäkuu 2020/);

    await act(async () => await user.click(toggleButton));
    expect(screen.queryByText(/heinäkuu 2020/)).not.toBeInTheDocument();

    await act(async () => await user.click(toggleButton));
    screen.getByText(/heinäkuu 2020/);
  });

  it('show correct day as selected day', async () => {
    const user = userEvent.setup();
    renderDatepicker({ value: new Date('2020-07-05') });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));

    const selectedDateButton = screen.getByRole('button', {
      name: /valitse 05\.07\.2020/i,
    });
    expect(selectedDateButton).toHaveAttribute('tabIndex', '0');
    expect(selectedDateButton).toHaveClass('daySelected');
  });

  it('should change date by typing', async () => {
    const user = userEvent.setup();
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({ value: new Date('2020-07-05'), placeholder });

    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toHaveValue('05.07.2020');

    await act(async () => await user.clear(input));
    await act(async () => await pressKey({ key: 'Enter' }));
    expect(defaultProps.onChange).toBeCalledWith(null);

    await act(async () => await user.type(input, '06.07.2020'));
    expect(defaultProps.onChange).toBeCalledWith(new Date('2020-07-06'));

    // Should return previous value if typing invalid date
    await act(async () => await user.type(input, '......'));
    await act(async () => await pressKey({ key: 'Enter' }));
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(
      new Date('2020-07-06')
    );
  });

  it('should change date by typing when timeSelector is available', async () => {
    const user = userEvent.setup();
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({
      value: null,
      placeholder,
      timeSelector: true,
    });

    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toHaveValue('');

    await act(async () => await user.type(input, '06.07.2020 12.00'));
    expect(defaultProps.onChange).toBeCalledWith(new Date('2020-07-06T12:00'));
  });

  it('shows current date correctly when user navigates calendar with keyboard', async () => {
    const user = userEvent.setup();
    renderDatepicker({
      minBookingDate: new Date('2020-07-05'),
      maxBookingDate: new Date('2020-07-19'),
      value: new Date('2020-07-05'),
    });
    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));

    const currentDayButton = screen.getByRole('button', {
      name: /valitse 05\.07\.2020/i,
    });

    // selected date receives focus asynchronously, lets wait it to happen
    await waitFor(() => expect(currentDayButton).toHaveFocus());

    const dayButtons = [
      screen.getByRole('button', { name: /valitse 05\.07\.2020/i }),
      screen.getByRole('button', { name: /valitse 12\.07\.2020/i }),
      screen.getByRole('button', { name: /valitse 13\.07\.2020/i }),
      screen.getByRole('button', { name: /valitse 19\.07\.2020/i }),
    ];
    const userActions = [
      { key: 'ArrowUp', day: dayButtons[0] },
      { key: 'ArrowDown', day: dayButtons[1] },
      { key: 'ArrowDown', day: dayButtons[3] },
      { key: 'ArrowDown', day: dayButtons[3] },
      { key: 'ArrowUp', day: dayButtons[1] },
      { key: 'ArrowRight', day: dayButtons[2] },
      { key: 'ArrowLeft', day: dayButtons[1] },
    ];
    for (const { key, day } of userActions) {
      await act(async () => await pressKey({ key }));
      expect(day).toHaveFocus();
    }
  });

  it('should open calendar with ArrowDown button', async () => {
    const user = userEvent.setup();
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({ placeholder });

    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText(placeholder);
    await act(async () => await user.click(input));
    await act(async () => await pressKey({ key: 'ArrowDown' }));

    screen.getByText(/kesäkuu 2020/i);
  });

  it('should open calendar with ArrowUp button', async () => {
    const user = userEvent.setup();
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({ placeholder });

    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText(placeholder);
    await act(async () => await user.click(input));
    await act(async () => await pressKey({ key: 'ArrowUp' }));

    screen.getByText(/kesäkuu 2020/i);
  });

  it('calls onBlur when user hits escape button', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    renderDatepicker({ onBlur });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(/kesäkuu 2020/i);
    expect(onBlur).not.toHaveBeenCalled();

    await act(async () => await pressKey({ key: 'Escape' }));
    expect(onBlur).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument()
    );
  });

  it('calls onBlur when clicking outside element', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    const { container } = renderDatepicker({ onBlur });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));

    screen.getByText(/kesäkuu 2020/i);
    expect(onBlur).not.toHaveBeenCalled();

    await act(async () => await user.click(container));

    expect(onBlur).toHaveBeenCalled();
    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();
  });

  it('calls onChange handler correctly when user selects a date', async () => {
    const user = userEvent.setup();
    const date = getTestDate(10);
    renderDatepicker({ value: null });

    const monthRegex = new RegExp(
      formatDate(date, 'LLLL yyyy', { locale: fi }),
      'i'
    );
    const dateSelectRegex = new RegExp(
      `Valitse ${formatDate(date, 'dd.MM.yyyy')}`,
      'i'
    );

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(monthRegex);

    await act(
      async () =>
        await user.click(screen.getByRole('button', { name: dateSelectRegex }))
    );

    expect(defaultProps.onChange).toHaveBeenCalledWith(date);
  });

  it('changes month when next or previous month button is clicked', async () => {
    const user = userEvent.setup();
    renderDatepicker();

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(/kesäkuu 2020/i);

    const nextMonthButton = screen.getByRole('button', {
      name: /seuraava kuukausi/i,
    });
    const previousMonthButton = screen.getByRole('button', {
      name: /edellinen kuukausi/i,
    });
    const userActions = [
      { button: previousMonthButton, text: /toukokuu 2020/i },
      { button: nextMonthButton, text: /kesäkuu 2020/i },
      { button: nextMonthButton, text: /heinäkuu 2020/i },
    ];
    for (const { button, text } of userActions) {
      await act(async () => await user.click(button));
      screen.getByText(text);
    }
  });

  it('should set focus to focusedDate', async () => {
    const user = userEvent.setup();
    const focusedDate = new Date('2022-01-01');
    renderDatepicker({ focusedDate, value: null });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    await screen.findByText(/tammikuu 2022/i);

    const dayButton = screen.getByRole('button', {
      name: /valitse 01\.01\.2022/i,
    });
    expect(dayButton).toHaveFocus();
  });
});

describe('<Datepicker timeSelector /> with time selector', () => {
  it('focuses times list with tab', async () => {
    const user = userEvent.setup();
    renderDatepicker({ timeSelector: true });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(/kesäkuu 2020/i);

    await act(async () => await user.tab());
    expect(
      screen.getByLabelText(/Valitse kellonaika nuolinäppäimillä/i)
    ).toHaveFocus();
  });

  it('focuses correct time from time list when user hits down or up arrows', async () => {
    const user = userEvent.setup();
    const value = new Date(2020, 5, 20);
    renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value,
    });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    screen.getByText(/kesäkuu 2020/i);

    await act(async () => await user.tab());

    const timeButtons = [
      screen.getByRole('button', { name: /Valitse kellonajaksi 00.00/i }),
      screen.getByRole('button', { name: /Valitse kellonajaksi 00.15/i }),
      screen.getByRole('button', { name: /Valitse kellonajaksi 23.45/i }),
    ];

    const userActions = [
      { key: 'ArrowDown', button: timeButtons[0] },
      { key: 'ArrowDown', button: timeButtons[1] },
      { key: 'ArrowUp', button: timeButtons[0] },
      { key: 'ArrowUp', button: timeButtons[2] },
    ];

    for (const { button, key } of userActions) {
      await act(async () => await pressKey({ key }));
      expect(button).toHaveFocus();
    }
  });

  it('calls onChange correctly when selecting date with time', async () => {
    const user = userEvent.setup();
    const value = getTestDate(1);
    const { rerender } = renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value,
    });
    const testDate = getTestDate(5);
    const dateSelectRegex = new RegExp(
      `Valitse ${formatDate(testDate, 'dd.MM.yyyy')}`,
      'i'
    );

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    await act(
      async () =>
        await user.click(screen.getByRole('button', { name: dateSelectRegex }))
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith(testDate);

    rerender({ value: testDate });

    await act(
      async () =>
        await user.click(
          screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
        )
    );

    const expectedDateValue = testDate;
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedDateValue);
  });

  it('calls onChange correctly when selecting only time', async () => {
    const user = userEvent.setup();
    renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value: null,
    });

    const toggleButton = getElement('toggleButton');
    await act(async () => await user.click(toggleButton));
    await act(
      async () =>
        await user.click(
          screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
        )
    );

    const expectedDateValue = new Date();
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedDateValue);
  });
});
