import { useDay } from '@datepicker-react/hooks';
import classNames from 'classnames';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
import isNil from 'lodash/isNil';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../../hooks/useLocale';
import { dateLocales } from '../constants';
import styles from '../datepicker.module.scss';
import DatepickerContext from '../datepickerContext';

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
  }, [date, dayRef, isDateFocused]);

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

  // @datepicker-react/hooks allows to set focus to disabled dates, so override onKeyDown function here
  // to prevent moving to disabled dates
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const keysToNumber: { [key: string]: number } = {
      ArrowDown: 7,
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
    };
    const days = keysToNumber[e.key];

    if (!isNil(days)) {
      focusDate(addDays(date, days));
    }
  };

  /* istanbul ignore next */
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
