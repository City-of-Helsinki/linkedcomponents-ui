import {
  OnDatesChangeProps,
  START_DATE,
  useDatepicker,
} from '@datepicker-react/hooks';
import { ClassNames } from '@emotion/react';
import formatDate from 'date-fns/format';
import isValidDate from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import {
  IconAngleLeft,
  IconAngleRight,
  IconCalendar,
  TextInputProps,
} from 'hds-react';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DATE_FORMAT, DATETIME_FORMAT } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import useLocale from '../../../hooks/useLocale';
import { TimeObject } from '../../../types';
import TextInput from '../textInput/TextInput';
import { dateLocales, dateRegex, datetimeRegex } from './constants';
import styles from './datepicker.module.scss';
import DatePickerContext from './datepickerContext';
import Month from './month/Month';
import MonthNavButton from './monthNavButton/MonthNavButton';
import TimesList from './timesList/TimesList';

export type DatepickerProps = {
  focusedDate?: Date | null;
  icon?: React.ReactElement;
  maxBookingDate?: Date;
  minBookingDate?: Date;
  minuteInterval?: number;
  onBlur?: () => void;
  onChange: (value: Date | null) => void;
  timeSelector?: boolean;
  value: Date | null;
} & Omit<TextInputProps, 'onBlur' | 'onChange' | 'value'>;

const DatePicker: React.FC<DatepickerProps> = ({
  focusedDate: _focusedDate,
  icon,
  maxBookingDate,
  minBookingDate,
  minuteInterval,
  onBlur,
  onChange,
  timeSelector,
  value,
  ...textInputProps
}) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isFocused = React.useRef(false);

  const dateFormat = React.useMemo(
    () => (timeSelector ? DATETIME_FORMAT : DATE_FORMAT),
    [timeSelector]
  );
  const [inputValue, setInputValue] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const datepickerContainer = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timesContainer = useRef<HTMLDivElement>(null);

  const isComponentFocused = useIsComponentFocused(container);

  const dialogLabelId = useIdWithPrefix({ prefix: 'dialog-label-' });

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
      onChange(data.startDate);
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

  const ensureCalendarIsClosed = useCallback(() => {
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

  const toggleCalendar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCalendarOpen(!isCalendarOpen);
  };

  const closeCalendar = useCallback(() => {
    inputRef.current?.focus();
    ensureCalendarIsClosed();
  }, [ensureCalendarIsClosed]);

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

    /* istanbul ignore else */
    if (isValidDate(parsedDate)) {
      onChange(parsedDate);
    } else if (!dateStr) {
      onChange(null);
    } else if (value) {
      const formattedDate = formatDate(value, dateFormat);
      setInputValue(formattedDate);
    }
  };

  const handleInputChange = (value: string) => {
    const disallowedCharacters = /[^0-9.\s]+/g;
    const newValue = value.replace(disallowedCharacters, '');

    setInputValue(newValue);
    const parsedDate = parseDate(value, dateFormat, new Date());

    if (dateIsInValidFormat(parsedDate, value)) {
      onChange(parsedDate);
    }
  };

  const handleInputBlur = () => {
    handleChange(inputValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    /* istanbul ignore else  */
    if (e.key === 'Enter') {
      handleChange(inputValue);
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

      if (isFocused.current) {
        isFocused.current = false;
        onBlur && onBlur();
      }
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
    /* istanbul ignore else */
    if (!value) {
      setInputValue('');
    } else if (value && isValidDate(value)) {
      const formattedDate = formatDate(value, dateFormat);
      setInputValue(formattedDate);
    }
  }, [dateFormat, timeSelector, value]);

  React.useEffect(() => {
    if (isCalendarOpen) {
      if (_focusedDate && !value) {
        onDateFocus(_focusedDate);
      } else if (value) {
        onDateFocus(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarOpen]);

  return (
    <DatePickerContext.Provider
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
      <ClassNames>
        {({ css, cx }) => (
          <div
            ref={container}
            onFocus={() => (isFocused.current = true)}
            className={cx(styles.datepickerWrapper, css(theme.datepicker))}
            onKeyDown={preventArrowKeyScroll}
          >
            <TextInput
              {...textInputProps}
              buttonIcon={<IconCalendar aria-hidden />}
              buttonAriaLabel={t('common.datepicker.accessibility.buttonOpen')}
              onButtonClick={toggleCalendar}
              onChange={(event) => {
                handleInputChange(event.target.value);
              }}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              value={inputValue}
              ref={inputRef}
              inputMode="numeric"
            >
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
            </TextInput>
          </div>
        )}
      </ClassNames>
    </DatePickerContext.Provider>
  );
};

export default DatePicker;
