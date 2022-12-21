import React from 'react';
import { useTranslation } from 'react-i18next';

import { useReservationTimer } from './hooks/useReservationTimer';

const getTimeStr = (timeLeft: number) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor(timeLeft / 60) % 60;
  const seconds = timeLeft % 60;

  return [
    hours,
    ...[minutes, seconds].map((n) => n.toString().padStart(2, '0')),
  ]
    .filter((i) => i)
    .join(':');
};

const ReservationTimer: React.FC = () => {
  const { t } = useTranslation();
  const { timeLeft } = useReservationTimer();

  return (
    <div>
      {t('enrolment.form.timeLeft')}{' '}
      <strong>{timeLeft !== null && getTimeStr(timeLeft)}</strong>
    </div>
  );
};

export default ReservationTimer;
