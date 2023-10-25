import React from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../../hooks/useLocale';
import useTimeFormat from '../../../../hooks/useTimeFormat';
import formatDate from '../../../../utils/formatDate';
import styles from './timeText.module.scss';

export type TimeTextProps = {
  startTime: Date | null | undefined;
  endTime: Date | null | undefined;
};

const TimeText: React.FC<TimeTextProps> = ({ startTime, endTime }) => {
  const timeFormat = useTimeFormat();
  const locale = useLocale();
  const { t } = useTranslation();

  if (!startTime && !endTime) {
    return '-';
  }

  const startText =
    startTime &&
    t('eventsPage.datetime', {
      date: formatDate(startTime),
      time: formatDate(startTime, timeFormat, locale),
    });
  const endText =
    endTime &&
    t('eventsPage.datetime', {
      date: formatDate(endTime),
      time: formatDate(endTime, timeFormat, locale),
    });

  return (
    <div aria-label={[startText, endText].join(' – ').trim()}>
      <div className={styles.timeText}>
        {startTime && <span>{startText}</span>}
        <span> – </span>
      </div>
      {endTime && <div className={styles.timeText}>{endText}</div>}
    </div>
  );
};

export default TimeText;
