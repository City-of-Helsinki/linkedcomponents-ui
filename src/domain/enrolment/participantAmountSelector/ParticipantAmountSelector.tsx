import { useField } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import {
  SeatsReservation,
  useUpdateSeatsReservationMutation,
} from '../../../generated/graphql';
import { reportError } from '../../app/sentry/utils';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_FIELDS } from '../constants';
import EnrolmentPageContext from '../enrolmentPageContext/EnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ConfirmDeleteParticipantModal from '../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { AttendeeFields } from '../types';
import {
  getAttendeeCapacityError,
  getAttendeeDefaultInitialValues,
  getFreeAttendeeCapacity,
} from '../utils';
import styles from './participantAmountSelector.module.scss';

interface Props {
  disabled: boolean;
}

const ParticipantAmountSelector: React.FC<Props> = ({ disabled }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useUser();

  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [participantsToDelete, setParticipantsToDelete] = useState(0);

  const { registration } = useContext(EnrolmentPageContext);
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

      const seats = data?.updateSeatsReservation.seats as number;
      const filledAttendees = attendees.filter(
        (a) => !isEqual(a, attendeeInitialValues)
      );
      const newAttendees = [
        ...filledAttendees,
        ...Array(Math.max(seats - filledAttendees.length, 0)).fill(
          attendeeInitialValues
        ),
      ].slice(0, seats);

      setAttendees(newAttendees);
      setSeatsReservationData(
        registrationId,
        data?.updateSeatsReservation as SeatsReservation
      );

      setSaving(false);
      closeModal();
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

  const closeModal = () => {
    setOpenModal(false);
  };

  const openParticipantModal = () => {
    setOpenModal(true);
  };

  const handleUpdateClick = () => {
    if (participantAmount < attendees.length) {
      setParticipantsToDelete(attendees.length - participantAmount);
      openParticipantModal();
    } else {
      updateParticipantAmount();
    }
  };

  return (
    <>
      <ConfirmDeleteParticipantModal
        isOpen={openModal}
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
