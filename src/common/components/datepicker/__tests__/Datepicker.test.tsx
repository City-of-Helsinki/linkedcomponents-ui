import userEvent from '@testing-library/user-event';
import formatDate from 'date-fns/format';
import { fi } from 'date-fns/locale';
import { advanceTo } from 'jest-date-mock';
import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import {
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

describe('<Datepicker />', () => {
  it('Datepicker opens when user focuses with tab', () => {
    renderDatepicker({ value: new Date('2020-07-05') });

    userEvent.tab();
    screen.getByText(/heinäkuu 2020/);
  });

  it('should toggle datepicker by clicking toggle button', () => {
    renderDatepicker({ value: new Date('2020-07-05') });

    userEvent.tab();
    screen.getByText(/heinäkuu 2020/);

    const toggleButton = screen.getByRole('button', {
      name: translations.common.datepicker.accessibility.buttonCalendar,
    });

    userEvent.click(toggleButton);
    expect(screen.queryByText(/heinäkuu 2020/)).not.toBeInTheDocument();

    userEvent.click(toggleButton);
    screen.getByText(/heinäkuu 2020/);
  });

  it('show correct day as selected day', () => {
    renderDatepicker({ value: new Date('2020-07-05') });

    userEvent.tab();

    const selectedDateButton = screen.getByRole('button', {
      name: /valitse 05\.07\.2020/i,
    });
    expect(selectedDateButton).toHaveAttribute('tabIndex', '0');
    expect(selectedDateButton).toHaveClass('daySelected');
  });

  it('should change date by typing', async () => {
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({ value: new Date('2020-07-05'), placeholder });

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toHaveValue('05.07.2020');

    userEvent.click(input);
    userEvent.clear(input);
    pressKey({ key: 'Enter' });
    expect(defaultProps.onChange).toBeCalledWith(null);

    userEvent.type(input, '06.07.2020');
    expect(defaultProps.onChange).toBeCalledWith(new Date('2020-07-06'));

    // Should return previous value if typing invalid date
    userEvent.type(input, 'qwerty');
    pressKey({ key: 'Enter' });
    expect(defaultProps.onChange).toHaveBeenLastCalledWith(
      new Date('2020-07-06')
    );
  });

  it('should change date by typing when timeSelector is available', async () => {
    const placeholder = 'Datepicker placeholder';
    renderDatepicker({
      value: null,
      placeholder,
      timeSelector: true,
    });

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toHaveValue('');

    userEvent.click(input);

    userEvent.type(input, '06.07.2020 12.00');
    expect(defaultProps.onChange).toBeCalledWith(new Date('2020-07-06T12:00'));
  });

  it('shows current date correctly when user navigates calendar with keyboard', async () => {
    renderDatepicker({
      minBookingDate: new Date('2020-07-05'),
      maxBookingDate: new Date('2020-07-19'),
      value: new Date('2020-07-05'),
    });
    userEvent.tab();

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
      // minBookingDate should be focused
      {
        key: 'ArrowUp',
        // 05.07.2020
        day: dayButtons[0],
      },
      {
        key: 'ArrowDown',
        // 12.07.2020
        day: dayButtons[1],
      },
      {
        key: 'ArrowDown',
        // 19.07.2020
        day: dayButtons[3],
      },
      // maxBookingDate should be focused
      {
        key: 'ArrowDown',
        // 19.07.2020
        day: dayButtons[3],
      },
      {
        key: 'ArrowUp',
        // 12.07.2020
        day: dayButtons[1],
      },
      {
        key: 'ArrowRight',
        // 13.07.2020
        day: dayButtons[2],
      },
      {
        key: 'ArrowLeft',
        // 12.07.2020
        day: dayButtons[1],
      },
    ];
    for (const { key, day } of userActions) {
      pressKey({ key });
      expect(day).toHaveFocus();
    }
  });

  it('calls onBlur when user hits escape button', async () => {
    const onBlur = jest.fn();
    renderDatepicker({ onBlur });

    userEvent.tab();
    screen.getByText(/kesäkuu 2020/i);
    expect(onBlur).not.toHaveBeenCalled();

    pressKey({ key: 'Escape' });

    expect(onBlur).toHaveBeenCalled();
    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();
  });

  it('calls onBlur when clicking outside element', async () => {
    const onBlur = jest.fn();
    const { container } = renderDatepicker({ onBlur });

    userEvent.tab();
    screen.getByText(/kesäkuu 2020/i);
    expect(onBlur).not.toHaveBeenCalled();

    userEvent.click(container);

    expect(onBlur).toHaveBeenCalled();
    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();
  });

  it('calls onChange handler correctly when user selects a date', async () => {
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

    userEvent.tab();
    screen.getByText(monthRegex);

    userEvent.click(screen.getByRole('button', { name: dateSelectRegex }));

    expect(defaultProps.onChange).toHaveBeenCalledWith(date);
  });

  it('changes month when next or previous month button is clicked', async () => {
    renderDatepicker();

    userEvent.click(screen.getByLabelText(defaultProps.label as string));
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
    userActions.forEach(({ button, text }) => {
      userEvent.click(button);
      screen.getByText(text);
    });
  });
});

describe('<Datepicker timeSelector /> with time selector', () => {
  it('focuses times list with tab', async () => {
    renderDatepicker({ timeSelector: true });

    userEvent.tab();
    screen.getByText(/kesäkuu 2020/i);
    userEvent.tab();

    expect(
      screen.getByLabelText(/Valitse kellonaika nuolinäppäimillä/i)
    ).toHaveFocus();
  });

  it('focuses correct time from time list when user hits down or up arrows', async () => {
    const value = new Date(2020, 5, 20);
    renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value,
    });

    userEvent.tab();
    screen.getByText(/kesäkuu 2020/i);
    userEvent.tab();

    const timeButtons = [
      screen.getByRole('button', { name: /Valitse kellonajaksi 00.00/i }),
      screen.getByRole('button', { name: /Valitse kellonajaksi 00.15/i }),
      screen.getByRole('button', { name: /Valitse kellonajaksi 23.45/i }),
    ];

    const userActions = [
      {
        key: 'ArrowDown',
        // 00.00
        button: timeButtons[0],
      },
      {
        key: 'ArrowDown',
        // 00.15
        button: timeButtons[1],
      },
      {
        key: 'ArrowUp',
        // 00.00
        button: timeButtons[0],
      },
      {
        key: 'ArrowUp',
        // 23.45
        button: timeButtons[2],
      },
    ];

    userActions.forEach(({ key, button }) => {
      pressKey({ key });
      expect(button).toHaveFocus();
    });
  });

  it('calls onChange correctly when selecting date with time', async () => {
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

    userEvent.click(screen.getByLabelText(defaultProps.label as string));
    userEvent.click(screen.getByRole('button', { name: dateSelectRegex }));
    expect(defaultProps.onChange).toHaveBeenCalledWith(testDate);

    rerender({ value: testDate });

    userEvent.click(
      screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
    );

    const expectedDateValue = testDate;
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedDateValue);
  });

  it('calls onChange correctly when selecting only time', async () => {
    renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value: null,
    });
    userEvent.click(screen.getByLabelText(defaultProps.label as string));
    userEvent.click(
      screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
    );

    const expectedDateValue = new Date();
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedDateValue);
  });
});
