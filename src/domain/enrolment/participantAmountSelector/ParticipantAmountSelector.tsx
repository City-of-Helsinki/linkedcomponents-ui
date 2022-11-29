import { useField } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import {
  RegistrationFieldsFragment,
  SeatsReservation,
  useUpdateSeatsReservationMutation,
} from '../../../generated/graphql';
import { reportError } from '../../app/sentry/utils';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_FIELDS, ENROLMENT_MODALS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ConfirmDeleteParticipantModal from '../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { AttendeeFields } from '../types';
import {
  getAttendeeCapacityError,
  getNewAttendees,
  getTotalAttendeeCapacity,
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
  const location = useLocation();
  const { user } = useUser();

  const { closeModal, openModal, setOpenModal } = useEnrolmentPageContext();

  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const [saving, setSaving] = useState(false);
  const [participantsToDelete, setParticipantsToDelete] = useState(0);

  const registrationId = registration.id as string;

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({ name: ENROLMENT_FIELDS.ATTENDEES });

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

  const updateSeatsReservation = async () => {
    const reservationData = getSeatsReservationData(registrationId);
    const payload = {
      code: reservationData?.code as string,
      registration: registrationId,
      seats: participantAmount,
      waitlist: true,
    };

    try {
      const { data } = await updateSeatsReservationMutation({
        variables: { input: payload },
      });
      const seatsReservation = data?.updateSeatsReservation as SeatsReservation;

      const newAttendees = getNewAttendees({
        attendees: attendees,
        registration,
        seatsReservation,
      });

      setAttendees(newAttendees);
      setSeatsReservationData(registrationId, seatsReservation);

      setSaving(false);
      // Show modal to inform that some of the persons will be added to the waiting list
      if (data?.updateSeatsReservation.waitlistSpots) {
        setOpenModal(ENROLMENT_MODALS.PERSONS_ADDED_TO_WAITLIST);
      } else {
        closeModal();
      }
    } catch (error) {
      showServerErrors({ error }, 'seatsReservation');

      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to update reserve seats',
        user,
      });

      setSaving(false);
      closeModal();
    }
  };

  const updateParticipantAmount = () => {
    /* istanbul ignore else */
    if (participantAmount !== attendees.length) {
      setSaving(true);

      setServerErrorItems([]);

      updateSeatsReservation();
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
        onDelete={updateParticipantAmount}
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
