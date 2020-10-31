import { useDay } from '@datepicker-react/hooks';
import classNames from 'classnames';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../hooks/useLocale';
import { dateLocales } from './constants';
import styles from './datepicker.module.scss';
import DatepickerContext from './datepickerContext';

const Day: React.FC<{ date: Date; dayLabel: string }> = ({
  date,
  dayLabel,
}) => {
  const dayRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const locale = useLocale();

  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    maxBookingDate,
    minBookingDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
    selectedDate,
  } = useContext(DatepickerContext);

  // after version 2.4.1 days won't focus automatically!!!!
  // https://github.com/tresko/react-datepicker/commit/eae4f52 <-- here is the change
  React.useEffect(() => {
    if (isDateFocused(date)) {
      dayRef.current?.focus();
    }
  }, [dayRef, date, isDateFocused]);

  const { disabledDate, onClick, onMouseEnter, tabIndex } = useDay({
    date,
    focusedDate,
    isDateBlocked,
    isDateFocused,
    isDateHovered,
    isDateSelected,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateHover,
    onDateSelect,
  });

  const getNextDate = (nextDate: Date): Date => {
    if (
      minBookingDate &&
      !isSameDay(nextDate, minBookingDate) &&
      nextDate < minBookingDate
    ) {
      return minBookingDate;
    } else if (
      maxBookingDate &&
      !isSameDay(nextDate, maxBookingDate) &&
      nextDate > maxBookingDate
    ) {
      return maxBookingDate;
    } else {
      return nextDate;
    }
  };

  const focusDate = (nextDate: Date) => {
    onDateFocus(getNextDate(nextDate));
  };

  // @datepicker-react/hooks asslo to set focus to disabled dates, so override onKeyDown function here
  // and prevent it here
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') {
      focusDate(addDays(date, 1));
    } else if (e.key === 'ArrowLeft') {
      focusDate(addDays(date, -1));
    } else if (e.key === 'ArrowUp') {
      focusDate(addDays(date, -7));
    } else if (e.key === 'ArrowDown') {
      focusDate(addDays(date, 7));
    }
  };

  if (!dayLabel) {
    return <div />;
  }

  return (
    <button
      ref={dayRef}
      aria-label={t('common.datepicker.accessibility.selectDate', {
        value: formatDate(date, 'dd.MM.yyyy', { locale: dateLocales[locale] }),
      })}
      className={classNames(styles.dayButton, {
        [styles.dayDisabled]: disabledDate,
        [styles.daySelected]: selectedDate
          ? isSameDay(selectedDate, date)
          : false,
        [styles.dayToday]: isToday(date),
      })}
      onClick={onClick}
      onFocus={() => onDateFocus(date)}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type="button"
    >
      {dayLabel}
    </button>
  );
};

export default Day;
