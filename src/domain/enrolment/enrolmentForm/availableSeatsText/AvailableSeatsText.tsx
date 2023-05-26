import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { RegistrationFieldsFragment } from '../../../../generated/graphql';
import {
  getFreeAttendeeCapacity,
  getFreeWaitingListCapacity,
  isAttendeeCapacityUsed,
} from '../../../registration/utils';

type Props = {
  registration: RegistrationFieldsFragment;
};
const AvailableSeatsText: FC<Props> = ({ registration }) => {
  const { t } = useTranslation();

  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const freeWaitingListCapacity = getFreeWaitingListCapacity(registration);

  return (
    <>
      {typeof freeAttendeeCapacity === 'number' && !attendeeCapacityUsed && (
        <p>
          {t('enrolment.form.freeAttendeeCapacity')}{' '}
          <strong>{freeAttendeeCapacity}</strong>
        </p>
      )}
      {attendeeCapacityUsed && typeof freeWaitingListCapacity === 'number' && (
        <p>
          {t('enrolment.form.freeWaitingListCapacity')}{' '}
          <strong>{freeWaitingListCapacity}</strong>
        </p>
      )}
    </>
  );
};

export default AvailableSeatsText;
