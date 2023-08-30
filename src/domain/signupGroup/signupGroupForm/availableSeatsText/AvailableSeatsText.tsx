import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../../generated/graphql';
import {
  getFreeAttendeeCapacity,
  getFreeWaitingListCapacity,
  isAttendeeCapacityUsed,
} from '../../../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../../reserveSeats/utils';

type Props = {
  registration: RegistrationFieldsFragment;
};
const AvailableSeatsText: FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const freeWaitingListCapacity = getFreeWaitingListCapacity(registration);

  const reservedSeats = useMemo(() => {
    const data = getSeatsReservationData(registration.id as string);
    return data && !isSeatsReservationExpired(data) ? data.seats : 0;
  }, [registration.id]);

  return (
    <>
      {typeof freeAttendeeCapacity === 'number' && !attendeeCapacityUsed && (
        <p>
          {t('enrolment.form.freeAttendeeCapacity')}{' '}
          <strong>{freeAttendeeCapacity + reservedSeats}</strong>
        </p>
      )}
      {attendeeCapacityUsed && typeof freeWaitingListCapacity === 'number' && (
        <p>
          {t('enrolment.form.freeWaitingListCapacity')}{' '}
          <strong>{freeWaitingListCapacity + reservedSeats}</strong>
        </p>
      )}
    </>
  );
};

export default AvailableSeatsText;
