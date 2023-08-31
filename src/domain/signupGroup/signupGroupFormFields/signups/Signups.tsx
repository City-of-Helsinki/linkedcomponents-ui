/* eslint-disable max-len */
import { FieldArray, useField } from 'formik';
import React, { useState } from 'react';
import { useLocation } from 'react-router';

import {
  RegistrationFieldsFragment,
  SeatsReservation,
  SignupGroupFieldsFragment,
  UpdateSeatsReservationMutationInput,
  useUpdateSeatsReservationMutation,
} from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import { reportError } from '../../../app/sentry/utils';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../../seatsReservation/utils';
import { useSignupServerErrorsContext } from '../../../signup/signupServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useUser from '../../../user/hooks/useUser';
import { SIGNUP_GROUP_FIELDS } from '../../constants';
import ConfirmDeleteParticipantModal from '../../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { SignupFields } from '../../types';
import { getNewSignups } from '../../utils';
import Signup from './signup/Signup';
import styles from './signups.module.scss';

const getSignupPath = (index: number) =>
  `${SIGNUP_GROUP_FIELDS.SIGNUPS}[${index}]`;

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const Signups: React.FC<Props> = ({ disabled, registration, signupGroup }) => {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const { user } = useUser();

  const { setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const registrationId = getValue(registration.id, '');

  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFields[]
  >({ name: SIGNUP_GROUP_FIELDS.SIGNUPS });

  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  const updateSeatsReservation = async (
    participantAmount: number,
    indexToRemove: number
  ) => {
    const reservationData = getSeatsReservationData(registrationId);

    /* istanbul ignore next */
    if (!reservationData) {
      throw new Error('Reservation data is not stored to session storage');
    }

    const payload: UpdateSeatsReservationMutationInput = {
      code: reservationData.code,
      registration: registrationId,
      seats: participantAmount,
    };
    try {
      const { data } = await updateSeatsReservationMutation({
        variables: { id: reservationData.id, input: payload },
      });
      const seatsReservation = data?.updateSeatsReservation as SeatsReservation;
      const newSignups = getNewSignups({
        seatsReservation,
        signups: signups.filter((_, index) => index !== indexToRemove),
      });

      setSignups(newSignups);

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
        name={SIGNUP_GROUP_FIELDS.SIGNUPS}
        render={() => (
          <div>
            {signups.map((signup, index) => {
              const openModal = () => {
                setOpenModalIndex(index);
              };

              const deleteParticipant = async () => {
                setSaving(true);
                // Clear server errors
                setServerErrorItems([]);

                await updateSeatsReservation(signups.length - 1, index);
              };

              return (
                <React.Fragment key={index}>
                  <ConfirmDeleteParticipantModal
                    isOpen={openModalIndex === index}
                    isSaving={saving}
                    onClose={closeModal}
                    onConfirm={deleteParticipant}
                    participantCount={1}
                  />
                  <Signup
                    disabled={disabled}
                    index={index}
                    onDelete={openModal}
                    registration={registration}
                    showDelete={!signupGroup && signups.length > 1}
                    signup={signup}
                    signupPath={getSignupPath(index)}
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

export default Signups;
