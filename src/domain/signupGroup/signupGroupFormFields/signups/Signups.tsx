/* eslint-disable max-len */
import { FieldArray, useField } from 'formik';
import React, { useState } from 'react';

import {
  RegistrationFieldsFragment,
  SeatsReservation,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  UpdateSeatsReservationMutationInput,
  useUpdateSeatsReservationMutation,
} from '../../../../generated/graphql';
import useHandleError from '../../../../hooks/useHandleError';
import { featureFlagUtils } from '../../../../utils/featureFlags';
import getValue from '../../../../utils/getValue';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../../seatsReservation/utils';
import { useSignupServerErrorsContext } from '../../../signup/signupServerErrorsContext/hooks/useSignupServerErrorsContext';
import { SIGNUP_GROUP_FIELDS } from '../../constants';
import ConfirmDeleteSignupFromFormModal from '../../modals/confirmDeleteSignupFromFormModal/ConfirmDeleteSignupFromFormModal';
import { useSignupGroupFormContext } from '../../signupGroupFormContext/hooks/useSignupGroupFormContext';
import TotalPrice from '../../totalPrice/TotalPrice';
import { SignupFormFields } from '../../types';
import { getNewSignups } from '../../utils';
import Signup from './signup/Signup';
import styles from './signups.module.scss';

const getSignupPath = (index: number) =>
  `${SIGNUP_GROUP_FIELDS.SIGNUPS}[${index}]`;

interface Props {
  disabled?: boolean;
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}

const Signups: React.FC<Props> = ({
  disabled,
  registration,
  signup,
  signupGroup,
}) => {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { setParticipantAmount } = useSignupGroupFormContext();
  const { setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const registrationId = getValue(registration.id, '');

  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFormFields[]
  >({ name: SIGNUP_GROUP_FIELDS.SIGNUPS });

  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  const { handleError } = useHandleError();

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
      setParticipantAmount(newSignups.length);
      setSeatsReservationData(registrationId, seatsReservation);

      setSaving(false);
      closeModal();
    } catch (error) {
      showServerErrors({ error }, 'seatsReservation');

      handleError({
        error,
        message: 'Failed to update reserve seats',
        payload,
        savingFinished: () => {
          setSaving(false);
          closeModal();
        },
      });
    }
  };
  const isEditingMode = Boolean(signup || signupGroup);

  return (
    <>
      <div className={styles.accordions}>
        <FieldArray
          name={SIGNUP_GROUP_FIELDS.SIGNUPS}
          render={() => (
            <div>
              {signups.map((signupValues, index) => {
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
                  <React.Fragment key={signupValues.id || `signup-${index}`}>
                    <ConfirmDeleteSignupFromFormModal
                      isOpen={openModalIndex === index}
                      isSaving={saving}
                      onClose={closeModal}
                      onConfirm={deleteParticipant}
                      participantCount={1}
                    />
                    <Signup
                      disabled={disabled}
                      index={index}
                      isEditingMode={isEditingMode}
                      onDelete={openModal}
                      registration={registration}
                      showDelete={!signupGroup && signups.length > 1}
                      signup={signupValues}
                      signupPath={getSignupPath(index)}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        />
      </div>
      {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') && (
        <TotalPrice registration={registration} signups={signups} />
      )}
    </>
  );
};

export default Signups;
