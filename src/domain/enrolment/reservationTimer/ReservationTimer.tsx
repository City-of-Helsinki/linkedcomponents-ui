/* eslint-disable no-undef */
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getUnixTime from '../../../utils/getUnixTime';
import unixTimeToMs from '../../../utils/unixTimeToMs';
import { ENROLMENT_TIME_IN_MINUTES } from '../constants';
import {
  getEnrolmentReservationData,
  getRegistrationTimeLeft,
  setEnrolmentReservationData,
} from '../utils';

interface Props {
  registration: RegistrationFieldsFragment;
}

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

const ReservationTimer: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    const data = getEnrolmentReservationData(registration.id as string);
    // TODO: Get this data from the API when BE part is implemented
    if (!data || isPast(unixTimeToMs(data.expires))) {
      const now = new Date();

      setEnrolmentReservationData(registration.id as string, {
        expires: getUnixTime(addMinutes(now, ENROLMENT_TIME_IN_MINUTES)),
        participants: 1,
        session: '',
        started: getUnixTime(now),
      });
    }

    setTimeLeft(getRegistrationTimeLeft(registration));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRegistrationTimeLeft(registration));
    }, 1000);

    return () => clearInterval(interval);
  }, [registration, timeLeft]);

  return (
    <div>
      {t('enrolment.form.timeLeft')} <strong>{getTimeStr(timeLeft)}</strong>
    </div>
  );
};

export default ReservationTimer;
