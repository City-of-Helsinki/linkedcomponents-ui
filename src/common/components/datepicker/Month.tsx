import { useMonth } from '@datepicker-react/hooks';
import React from 'react';

import styles from './datepicker.module.scss';
import Day from './Day';

type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;

const Month: React.FC<{
  year: number;
  month: number;
  firstDayOfWeek: FirstDayOfWeek;
}> = ({ year, month, firstDayOfWeek }) => {
  const { days, weekdayLabels } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });
  return (
    <div>
      <div className={styles.weekdayRow}>
        {weekdayLabels.map((dayLabel) => (
          <div key={dayLabel}>{dayLabel}</div>
        ))}
      </div>
      <div className={styles.datesContainer}>
        {days.map((day, index) => {
          if (typeof day === 'object') {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
              />
            );
          }
          return <div key={index} />;
        })}
      </div>
    </div>
  );
};
export default Month;
