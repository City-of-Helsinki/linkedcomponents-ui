import { useField } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import { getSeatsReservationData } from '../../reserveSeats/utils';
import { ENROLMENT_FIELDS, ENROLMENT_MODALS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useSeatsReservationActions from '../hooks/useSeatsReservationActions';
import ConfirmDeleteParticipantModal from '../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { AttendeeFields } from '../types';
import { getAttendeeCapacityError, getTotalAttendeeCapacity } from '../utils';
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

  const { closeModal, openModal, setOpenModal } = useEnrolmentPageContext();

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({ name: ENROLMENT_FIELDS.ATTENDEES });

  const { saving, updateSeatsReservation } = useSeatsReservationActions({
    attendees,
    registration,
    setAttendees,
  });

  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const [participantsToDelete, setParticipantsToDelete] = useState(0);

  const registrationId = getValue(registration.id, '');

  const [participantAmount, setParticipantAmount] = useState(
    disabled
      ? 1
      : Math.max(
          getSeatsReservationData(registrationId)?.seats ??
            /* istanbul ignore next */ 0,
          1
        )
  );
  const freeCapacity = getTotalAttendeeCapacity(registration);

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

  const updateParticipantAmount = () => {
    /* istanbul ignore else */
    if (participantAmount !== attendees.length) {
      setServerErrorItems([]);

      updateSeatsReservation(participantAmount, {
        onError: (error) => showServerErrors({ error }, 'seatsReservation'),
      });
    }
  };

  const openDeleteParticipantModal = () => {
    setOpenModal(ENROLMENT_MODALS.DELETE);
  };

  const handleUpdateClick = () => {
    if (participantAmount < attendees.length) {
      setParticipantsToDelete(attendees.length - participantAmount);
      openDeleteParticipantModal();
    } else {
      updateParticipantAmount();
    }
  };

  return (
    <>
      <ConfirmDeleteParticipantModal
        isOpen={openModal === ENROLMENT_MODALS.DELETE}
        isSaving={saving}
        onClose={closeModal}
        onConfirm={updateParticipantAmount}
        participantCount={participantsToDelete}
      />
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
            onClick={handleUpdateClick}
            type="button"
            variant="secondary"
          >
            {t(`enrolment.form.buttonUpdateParticipantAmount`)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ParticipantAmountSelector;
