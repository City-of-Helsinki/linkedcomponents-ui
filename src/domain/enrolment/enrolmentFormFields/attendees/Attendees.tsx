/* eslint-disable max-len */
import { FieldArray, useField } from 'formik';
import React, { useState } from 'react';
import { useLocation } from 'react-router';

import {
  RegistrationFieldsFragment,
  SeatsReservation,
  useUpdateSeatsReservationMutation,
} from '../../../../generated/graphql';
import { reportError } from '../../../app/sentry/utils';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../../reserveSeats/utils';
import useUser from '../../../user/hooks/useUser';
import { ENROLMENT_FIELDS } from '../../constants';
import { useEnrolmentServerErrorsContext } from '../../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ConfirmDeleteParticipantModal from '../../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { AttendeeFields } from '../../types';
import { getNewAttendees } from '../../utils';
import Attendee from './attendee/Attendee';
import styles from './attendees.module.scss';

const getAttendeePath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
}

const Attendees: React.FC<Props> = ({ disabled, registration }) => {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const { user } = useUser();

  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const registrationId = registration.id as string;

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({ name: ENROLMENT_FIELDS.ATTENDEES });

  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  const updateSeatsReservation = async (
    participantAmount: number,
    indexToRemove: number
  ) => {
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
        attendees: attendees.filter((_, index) => index !== indexToRemove),
        registration,
        seatsReservation,
      });

      setAttendees(newAttendees);

      setSeatsReservationData(registrationId, seatsReservation);

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

  return (
    <div className={styles.accordions}>
      <FieldArray
        name={ENROLMENT_FIELDS.ATTENDEES}
        render={() => (
          <div>
            {attendees.map((attendee, index) => {
              const openModal = () => {
                setOpenModalIndex(index);
              };

              const deleteParticipant = async () => {
                setSaving(true);
                // Clear server errors
                setServerErrorItems([]);

                await updateSeatsReservation(attendees.length - 1, index);
              };

              return (
                <React.Fragment key={index}>
                  <ConfirmDeleteParticipantModal
                    isOpen={openModalIndex === index}
                    isSaving={saving}
                    onClose={closeModal}
                    onDelete={deleteParticipant}
                    participantCount={1}
                  />
                  <Attendee
                    attendee={attendee}
                    attendeePath={getAttendeePath(index)}
                    disabled={disabled}
                    index={index}
                    onDelete={openModal}
                    showDelete={attendees.length > 1}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default Attendees;
