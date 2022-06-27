import { useField } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { ENROLMENT_FIELDS } from '../constants';
import EnrolmentPageContext from '../enrolmentPageContext/EnrolmentPageContext';
import { AttendeeFields } from '../types';
import {
  getAttendeeCapacityError,
  getAttendeeDefaultInitialValues,
  getEnrolmentReservationData,
  getFreeAttendeeCapacity,
  updateEnrolmentReservationData,
} from '../utils';
import styles from './participantAmountSelector.module.scss';

interface Props {
  disabled: boolean;
}

const ParticipantAmountSelector: React.FC<Props> = ({ disabled }) => {
  const { t } = useTranslation();

  const { registration } = useContext(EnrolmentPageContext);

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  const [participantAmount, setParticipantAmount] = useState(
    Math.max(
      getEnrolmentReservationData(registration.id as string)?.participants ?? 0,
      1
    )
  );
  const freeCapacity = getFreeAttendeeCapacity(registration);

  const handleParticipantAmountChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setParticipantAmount(Number(event.target.value));
  };

  const attendeeCapacityError = getAttendeeCapacityError(
    registration,
    participantAmount,
    t
  );

  const attendeeInitialValues = React.useMemo(
    () => getAttendeeDefaultInitialValues(registration),
    [registration]
  );

  const handleUpdateParticipantAmount = () => {
    /* istanbul ignore next */
    if (participantAmount !== attendees.length) {
      const filledAttendees = attendees.filter(
        (a) => !isEqual(a, attendeeInitialValues)
      );
      const newAttendees = [
        ...filledAttendees,
        ...Array(Math.max(participantAmount - filledAttendees.length, 0)).fill(
          attendeeInitialValues
        ),
      ].slice(0, participantAmount);

      setAttendees(newAttendees);
      // TODO: Update reservation from API when BE is ready
      updateEnrolmentReservationData(registration, newAttendees.length);
    }
  };

  return (
    <div className={styles.participantAmountSelector}>
      <NumberInput
        id="participant-amount-field"
        disabled={disabled}
        errorText={attendeeCapacityError}
        invalid={!!attendeeCapacityError}
        label={t(`enrolment.form.labelParticipantAmount`)}
        min={1}
        max={freeCapacity}
        onChange={handleParticipantAmountChange}
        required
        step={1}
        value={participantAmount}
      />
      <div className={styles.buttonWrapper}>
        <Button
          disabled={disabled || !!attendeeCapacityError}
          onClick={handleUpdateParticipantAmount}
          type="button"
          variant="secondary"
        >
          {t(`enrolment.form.buttonUpdateParticipantAmount`)}
        </Button>
      </div>
    </div>
  );
};

export default ParticipantAmountSelector;
