import { FirstDayOfWeek, useMonth } from '@datepicker-react/hooks';
import React from 'react';

import styles from './datepicker.module.scss';
import Day from './Day';

const Month: React.FC<{
  firstDayOfWeek: FirstDayOfWeek;
  month: number;
  year: number;
}> = ({ year, month, firstDayOfWeek }) => {
  const { days, weekdayLabels } = useMonth({
    firstDayOfWeek,
    month,
    year,
  });

  return (
    <div>
      <div className={styles.weekdayRow}>
        {weekdayLabels.map((dayLabel) => (
          <div key={dayLabel}>{dayLabel}</div>
        ))}
      </div>
      <div className={styles.datesContainer}>
        {days.map((day, index) =>
          typeof day === 'object' ? (
            <Day
              key={day.date.toString()}
              date={day.date}
              dayLabel={day.dayLabel}
            />
          ) : (
            <div key={index} />
          )
        )}
      </div>
    </div>
  );
};
export default Month;
