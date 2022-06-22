import { useField } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { ENROLMENT_FIELDS } from '../constants';
import { AttendeeFields } from '../types';
import {
  getAttendeeCapacityError,
  getAttendeeDefaultInitialValues,
  getFreeAttendeeCapacity,
} from '../utils';
import styles from './participantAmountSelector.module.scss';

interface Props {
  disabled: boolean;
  registration: RegistrationFieldsFragment;
}

const ParticipantAmountSelector: React.FC<Props> = ({
  disabled,
  registration,
}) => {
  const { t } = useTranslation();

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  const [participantAmount, setParticipantAmount] = useState(1);
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
