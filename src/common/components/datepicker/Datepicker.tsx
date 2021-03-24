import {
  OnDatesChangeProps,
  START_DATE,
  useDatepicker,
} from '@datepicker-react/hooks';
import classNames from 'classnames';
import formatDate from 'date-fns/format';
import isValidDate from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { css } from 'emotion';
import {
  IconAngleLeft,
  IconAngleRight,
  IconCalendar,
  TextInputProps,
} from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import useLocale from '../../../hooks/useLocale';
import InputWrapper from '../inputWrapper/InputWrapper';
import inputStyles from '../inputWrapper/inputWrapper.module.scss';
import { TimeObject } from '../timepicker/types';
import { dateLocales, dateRegex, datetimeRegex } from './constants';
import styles from './datepicker.module.scss';
import DatepickerContext from './datepickerContext';
import Month from './Month';
import MonthNavButton from './MonthNavButton';
import TimesList from './TimesList';

const generateUniqueId = (prefix: string) => {
  return `${prefix}-${uniqueId()}`;
};

export type DatepickerProps = {
  focusedDate?: Date | null;
  icon?: React.ReactElement;
  maxBookingDate?: Date;
  minBookingDate?: Date;
  minuteInterval?: number;
  onBlur?: () => void;
  onChange: (value?: Date | null) => void;
  timeSelector?: boolean;
  value: Date | null;
} & Omit<TextInputProps, 'onBlur' | 'onChange' | 'value'>;

const Datepicker: React.FC<DatepickerProps> = ({
  className,
  disabled,
  errorText,
  focusedDate: _focusedDate,
  helperText,
  hideLabel,
  icon,
  id,
  invalid,
  label,
  labelText,
  maxBookingDate,
  minBookingDate,
  minuteInterval,
  onBlur,
  onChange,
  required,
  style,
  timeSelector,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
  value,
  ...rest
}) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const dateFormat = React.useMemo(
    () => (timeSelector ? DATETIME_FORMAT : DATE_FORMAT),
    [timeSelector]
  );
  const [dateValue, setDateValue] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const container = React.useRef<HTMLDivElement>(null);
  const closeButton = React.useRef<HTMLButtonElement>(null);
  const datepickerContainer = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timesContainer = React.useRef<HTMLDivElement>(null);

  const isComponentFocused = useIsComponentFocused(container);

  const dialogLabelId = React.useMemo(
    () => generateUniqueId('dialog-label'),
    []
  );

  const setNewDateWithTime = (previousDate: Date, newDate: Date) => {
    const hours = previousDate.getHours();
    const minutes = previousDate.getMinutes();

    const date = new Date(newDate);
    date.setHours(hours);
    date.setMinutes(minutes);

    onChange(date);
  };

  const handleDateChange = (data: OnDatesChangeProps) => {
    if (!timeSelector) {
      closeCalendar();
    }

    if (value && data.startDate) {
      setNewDateWithTime(value, data.startDate);
    } else {
      onChange(data.startDate || null);
    }
  };

  const preventArrowKeyScroll = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        break;
    }
  };

  const ensureCalendarIsClosed = React.useCallback(() => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
      onBlur && onBlur();
    }
  }, [isCalendarOpen, onBlur]);

  const ensureCalendarIsOpen = React.useCallback(() => {
    if (!isCalendarOpen) {
      setIsCalendarOpen(true);
    }
  }, [isCalendarOpen]);

  const toggleCalendar = () => {
    if (isCalendarOpen) {
      ensureCalendarIsClosed();
    } else {
      ensureCalendarIsOpen();
    }
  };

  const closeCalendar = React.useCallback(() => {
    inputRef.current?.focus();
    ensureCalendarIsClosed();
  }, [ensureCalendarIsClosed]);

  const handleInputFocus = () => {
    if (!isCalendarOpen) {
      setIsCalendarOpen(true);
    } else {
      setIsCalendarOpen(false);
    }
  };

  const dateIsInValidFormat = (parsedDate: Date, inputValue: string) => {
    const isParsedDateValid =
      isValidDate(parsedDate) && parsedDate.getFullYear() > 1970;
    if (timeSelector) {
      return isParsedDateValid && datetimeRegex.test(inputValue);
    }
    return isParsedDateValid && dateRegex.test(inputValue);
  };

  const handleChange = (dateStr: string) => {
    const parsedDate = parseDate(dateStr, dateFormat, new Date());

    if (isValidDate(parsedDate)) {
      onChange(parsedDate);
    } else if (!dateStr) {
      onChange(null);
    } else if (value) {
      const formattedDate = formatDate(value, dateFormat);
      setDateValue(formattedDate);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = event.target.value;
    const parsedDate = parseDate(event.target.value, dateFormat, new Date());

    setDateValue(eventValue);

    if (dateIsInValidFormat(parsedDate, eventValue)) {
      onChange(parsedDate);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleChange(dateValue);

    if (!isCalendarOpen) {
      setTimeout(() => onBlur && onBlur());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    /* istanbul ignore else  */
    if (e.key === 'Enter') {
      handleChange(dateValue);
    }
  };

  const handleTimeClick = React.useCallback(
    (time: TimeObject): void => {
      const newDate = value ? new Date(value) : new Date();

      newDate.setHours(time.hours);
      newDate.setMinutes(time.minutes);

      closeCalendar();
      onChange(newDate);
    },
    [closeCalendar, onChange, value]
  );

  const {
    activeMonths: [activeMonth],
    firstDayOfWeek,
    focusedDate,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    goToNextMonths,
    goToPreviousMonths,
    onDateHover,
    onDateSelect,
    onDateFocus,
  } = useDatepicker({
    startDate: isValidDate(value) ? value : new Date(),
    endDate: isValidDate(value) ? value : new Date(),
    focusedInput: START_DATE,
    onDatesChange: handleDateChange,
    numberOfMonths: 1,
    maxBookingDate: maxBookingDate,
    minBookingDate: minBookingDate,
  });

  const { month, year } = activeMonth;

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!isComponentFocused()) return;

    switch (event.key) {
      case 'Escape':
        closeCalendar();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        ensureCalendarIsOpen();
        break;
    }
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Node && container.current?.contains(target))) {
      ensureCalendarIsClosed();
    }
  };

  const onDocumentFocusin = () => {
    if (!isComponentFocused()) {
      ensureCalendarIsClosed();
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  // Update formatted input string when date value changes
  React.useEffect(() => {
    if (!value) {
      setDateValue('');
    } else if (value && isValidDate(value)) {
      const formattedDate = formatDate(value, dateFormat);
      setDateValue(formattedDate);
    }
  }, [dateFormat, timeSelector, value]);

  const wrapperProps = {
    className: classNames(className, css(theme.datepicker)),
    disabled,
    errorText,
    hasIcon: true,
    helperText,
    hideLabel,
    id,
    invalid,
    label,
    labelText,
    required,
    style,
    tooltipLabel,
    tooltipText,
    tooltipButtonLabel,
  };

  React.useEffect(() => {
    if (isCalendarOpen && _focusedDate && !value) {
      onDateFocus(_focusedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarOpen]);

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateBlocked,
        isDateFocused,
        isDateHovered,
        isDateSelected,
        isFirstOrLastSelectedDate,
        maxBookingDate,
        minBookingDate,
        onDateFocus,
        onDateHover,
        onDateSelect,
        selectedDate: value,
      }}
    >
      <div
        ref={container}
        className={styles.datepickerWrapper}
        onKeyDown={preventArrowKeyScroll}
      >
        <InputWrapper {...wrapperProps}>
          <input
            {...rest}
            id={id}
            name={id}
            ref={inputRef}
            className={classNames(inputStyles.input, styles.datepickerInput, {
              [styles.invalid]: invalid,
            })}
            disabled={disabled}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            value={dateValue}
          />
          <button
            type="button"
            aria-label={t('common.datepicker.accessibility.buttonCalendar')}
            className={styles.calendarButton}
            disabled={disabled}
            onClick={toggleCalendar}
          >
            {icon || <IconCalendar aria-hidden />}
          </button>
          {isCalendarOpen && (
            <div
              className={styles.datepickerContainer}
              ref={datepickerContainer}
              role="dialog"
              aria-modal="true"
              labelled-by={dialogLabelId}
            >
              <div className={styles.selectorsWrapper}>
                <div>
                  <div className={styles.monthNavigation}>
                    <MonthNavButton
                      onClick={goToPreviousMonths}
                      aria-label={t(
                        'common.datepicker.accessibility.buttonPreviousMonth'
                      )}
                    >
                      <IconAngleLeft aria-hidden />
                    </MonthNavButton>
                    <div
                      className={styles.currentMonth}
                      aria-live="polite"
                      id={dialogLabelId}
                    >
                      {formatDate(new Date(year, month), 'LLLL yyyy', {
                        locale: dateLocales[locale],
                      })}
                    </div>
                    <MonthNavButton
                      onClick={goToNextMonths}
                      aria-label={t(
                        'common.datepicker.accessibility.buttonNextMonth'
                      )}
                    >
                      <IconAngleRight aria-hidden />
                    </MonthNavButton>
                  </div>
                  <div className={styles.daysContainer}>
                    <Month
                      key={`${year}-${month}`}
                      year={year}
                      month={month}
                      firstDayOfWeek={firstDayOfWeek}
                    />
                  </div>
                  <button
                    ref={closeButton}
                    className={styles.closeButton}
                    onClick={ensureCalendarIsClosed}
                    type="button"
                    tabIndex={-1}
                  >
                    {t('common.datepicker.buttonClose')}
                  </button>
                </div>
                {timeSelector && (
                  <TimesList
                    ref={timesContainer}
                    datetime={value}
                    minuteInterval={minuteInterval}
                    onTimeClick={handleTimeClick}
                  />
                )}
              </div>
            </div>
          )}
        </InputWrapper>
      </div>
    </DatepickerContext.Provider>
  );
};

export default Datepicker;
