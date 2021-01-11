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
  value: new Date(2020, 5, 5),
  labelText: 'Datepicker',
};

const renderDatepicker = (props?: Partial<DatepickerProps>) => {
  const { rerender, ...rest } = render(
    <Datepicker {...defaultProps} {...props} />
  );

  return {
    ...defaultProps,
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

advanceTo(new Date(2020, 6, 5));

describe('<Datepicker />', () => {
  it('Datepicker opens when user focuses with tab', () => {
    renderDatepicker({ value: new Date(2020, 6, 5) });

    userEvent.tab();

    expect(screen.queryByText(/heinäkuu 2020/)).toBeInTheDocument();
  });

  it('should toggle datepicker by clicking toggle button', () => {
    renderDatepicker({ value: new Date(2020, 6, 5) });

    userEvent.tab();

    expect(screen.queryByText(/heinäkuu 2020/)).toBeInTheDocument();
    const toggleButton = screen.getByRole('button', {
      name: translations.common.datepicker.accessibility.buttonCalendar,
    });

    userEvent.click(toggleButton);
    expect(screen.queryByText(/heinäkuu 2020/)).not.toBeInTheDocument();

    userEvent.click(toggleButton);
    expect(screen.queryByText(/heinäkuu 2020/)).toBeInTheDocument();
  });

  it('show correct day as selected day', () => {
    renderDatepicker({ value: new Date(2020, 6, 5) });

    userEvent.tab();

    const selectedDateButton = screen.getByRole('button', {
      name: /valitse 05\.07\.2020/i,
    });
    expect(selectedDateButton).toHaveAttribute('tabIndex', '0');
    expect(selectedDateButton).toHaveClass('daySelected');
  });

  it('should change date by typing', async () => {
    const placeholder = 'Datepicker placeholder';
    const onChange = jest.fn();
    renderDatepicker({ value: new Date(2020, 6, 5), onChange, placeholder });

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toHaveValue('05.07.2020');

    userEvent.click(input);
    userEvent.clear(input);
    pressKey({ key: 'Enter' });
    expect(onChange).toBeCalledWith(null);

    userEvent.type(input, '06.07.2020');
    expect(onChange).toBeCalledWith(new Date(2020, 6, 6));

    // Should return previous value if typing invalid date
    userEvent.type(input, 'qwerty');
    pressKey({ key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith(new Date(2020, 6, 6));
  });

  it('should change date by typing when timeSelector is available', async () => {
    const placeholder = 'Datepicker placeholder';
    const onChange = jest.fn();
    renderDatepicker({
      value: null,
      onChange,
      placeholder,
      timeSelector: true,
    });

    const input = screen.getByPlaceholderText(placeholder);

    expect(input).toHaveValue('');

    userEvent.click(input);

    userEvent.type(input, '06.07.2020 12.00');
    expect(onChange).toBeCalledWith(new Date(2020, 6, 6, 12, 0));
  });

  it('shows current date correctly when user navigates calendar with keyboard', async () => {
    renderDatepicker({
      minBookingDate: new Date(2020, 6, 5),
      maxBookingDate: new Date(2020, 6, 19),
      value: new Date(2020, 6, 5),
    });
    userEvent.tab();

    const currentDayButton = screen.getByRole('button', {
      name: /valitse 05\.07\.2020/i,
    });

    // selected date receives focus asynchronously, lets wait it to happen
    await waitFor(() => expect(currentDayButton).toHaveFocus());

    const userActions = [
      // minBookingDate should be focused
      {
        key: 'ArrowUp',
        name: /valitse 05\.07\.2020/i,
      },
      {
        key: 'ArrowDown',
        name: /valitse 12\.07\.2020/i,
      },
      {
        key: 'ArrowDown',
        name: /valitse 19\.07\.2020/i,
      },
      // maxBookingDate should be focused
      {
        key: 'ArrowDown',
        name: /valitse 19\.07\.2020/i,
      },
      {
        key: 'ArrowUp',
        name: /valitse 12\.07\.2020/i,
      },
      {
        key: 'ArrowRight',
        name: /valitse 13\.07\.2020/i,
      },
      {
        key: 'ArrowLeft',
        name: /valitse 12\.07\.2020/i,
      },
    ];
    userActions.forEach(async ({ key, name }) => {
      pressKey({ key });
      expect(screen.queryByRole('button', { name })).toHaveFocus();
    });
  });

  it('calls onBlur when user hits escape button', async () => {
    const onBlur = jest.fn();
    renderDatepicker({ onBlur });

    userEvent.tab();

    expect(onBlur).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(screen.queryByText(/kesäkuu 2020/i)).toBeInTheDocument()
    );

    pressKey({ key: 'Escape' });

    expect(onBlur).toHaveBeenCalled();
    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();
  });

  it('calls onBlur when clicking outside element', async () => {
    const onBlur = jest.fn();
    const { container } = renderDatepicker({ onBlur });

    userEvent.tab();

    expect(onBlur).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(screen.queryByText(/kesäkuu 2020/i)).toBeInTheDocument()
    );

    userEvent.click(container);

    expect(onBlur).toHaveBeenCalled();
    expect(screen.queryByText(/kesäkuu 2020/i)).not.toBeInTheDocument();
  });

  it('calls onChange handler correctly when user selects a date', async () => {
    const date = getTestDate(10);
    const { onChange } = renderDatepicker({ value: null });

    const monthRegex = new RegExp(
      formatDate(date, 'LLLL yyyy', { locale: fi }),
      'i'
    );
    const dateSelectRegex = new RegExp(
      `Valitse ${formatDate(date, 'dd.MM.yyyy')}`,
      'i'
    );

    userEvent.tab();

    await waitFor(() =>
      expect(screen.queryByText(monthRegex)).toBeInTheDocument()
    );

    userEvent.click(
      screen.getByRole('button', {
        name: dateSelectRegex,
      })
    );

    expect(onChange).toHaveBeenCalledWith(date);
  });

  it('changes month when next or previous month button is clicked', () => {
    const { labelText } = renderDatepicker();

    userEvent.click(screen.getByLabelText(labelText || ''));
    expect(screen.queryByText(/kesäkuu 2020/i)).toBeInTheDocument();

    const userActions = [
      {
        name: /edellinen kuukausi/i,
        text: /toukokuu 2020/i,
      },
      {
        name: /seuraava kuukausi/i,
        text: /kesäkuu 2020/i,
      },
      {
        name: /seuraava kuukausi/i,
        text: /heinäkuu 2020/i,
      },
    ];
    userActions.forEach(({ name, text }) => {
      userEvent.click(screen.getByRole('button', { name }));
      expect(screen.queryByText(text)).toBeInTheDocument();
    });
  });
});

describe('<Datepicker timeSelector /> with time selector', () => {
  it('focuses times list with tab', async () => {
    renderDatepicker({ timeSelector: true });

    userEvent.tab();
    await waitFor(() =>
      expect(screen.queryByText(/kesäkuu 2020/i)).toBeInTheDocument()
    );

    userEvent.tab();
    expect(
      screen.queryByLabelText(/Valitse kellonaika nuolinäppäimillä/i)
    ).toHaveFocus();
  });

  it('focuses correct time from time list when user hits down or up arrows', async () => {
    const value = new Date(2020, 5, 20);
    const { onChange } = renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value,
    });

    userEvent.tab();
    await waitFor(() =>
      expect(screen.queryByText(/kesäkuu 2020/i)).toBeInTheDocument()
    );
    userEvent.tab();

    const userActions = [
      {
        key: 'ArrowDown',
        name: /Valitse kellonajaksi 00.00/i,
      },
      {
        key: 'ArrowDown',
        name: /Valitse kellonajaksi 00.15/i,
      },
      {
        key: 'ArrowUp',
        name: /Valitse kellonajaksi 00.00/i,
      },
      {
        key: 'ArrowUp',
        name: /Valitse kellonajaksi 23.45/i,
      },
    ];

    userActions.forEach(({ key, name }) => {
      pressKey({ key });
      expect(screen.getByRole('button', { name })).toHaveFocus();
    });
    // couldn't get enter key working here
    // maybe related: https://github.com/testing-library/react-testing-library/issues/269
    fireEvent.click(
      screen.getByRole('button', { name: /Valitse kellonajaksi 23.45/i })
    );

    const expectedDateValue = new Date(value);
    expectedDateValue.setHours(23);
    expectedDateValue.setMinutes(45);

    expect(onChange).toHaveBeenCalledWith(expectedDateValue);
  });

  it('calls onChange correctly when selecting date with time', async () => {
    const value = getTestDate(1);
    const { labelText, onChange, rerender } = renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value,
    });
    const testDate = getTestDate(5);
    const dateSelectRegex = new RegExp(
      `Valitse ${formatDate(testDate, 'dd.MM.yyyy')}`,
      'i'
    );

    userEvent.click(screen.getByLabelText(labelText || ''));
    userEvent.click(screen.getByRole('button', { name: dateSelectRegex }));
    expect(onChange).toHaveBeenCalledWith(testDate);

    rerender({ value: testDate });

    userEvent.click(
      screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
    );

    const expectedDateValue = testDate;
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(onChange).toHaveBeenCalledWith(expectedDateValue);
  });

  it('calls onChange correctly when selecting time', async () => {
    const { labelText, onChange } = renderDatepicker({
      timeSelector: true,
      minuteInterval: 15,
      value: null,
    });
    userEvent.click(screen.getByLabelText(labelText || ''));
    userEvent.click(
      screen.getByRole('button', { name: /Valitse kellonajaksi 12.15/i })
    );

    const expectedDateValue = new Date();
    expectedDateValue.setHours(12);
    expectedDateValue.setMinutes(15);

    expect(onChange).toHaveBeenCalledWith(expectedDateValue);
  });
});
