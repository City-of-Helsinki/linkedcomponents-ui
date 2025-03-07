/* eslint-disable max-len */
import { useField } from 'formik';
import { ButtonVariant } from 'hds-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { getMaxSeatsAmount } from '../../registration/utils';
import useSeatsReservationActions from '../../seatsReservation/hooks/useSeatsReservationActions';
import { SIGNUP_MODALS } from '../../signup/constants';
import { useSignupServerErrorsContext } from '../../signup/signupServerErrorsContext/hooks/useSignupServerErrorsContext';
import { SIGNUP_GROUP_FIELDS } from '../constants';
import ConfirmDeleteSignupFromFormModal from '../modals/confirmDeleteSignupFromFormModal/ConfirmDeleteSignupFromFormModal';
import { useSignupGroupFormContext } from '../signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupFormFields } from '../types';
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

  const { closeModal, openModal, setOpenModal } = useSignupGroupFormContext();

  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFormFields[]
  >({ name: SIGNUP_GROUP_FIELDS.SIGNUPS });

  const { participantAmount, setParticipantAmount } =
    useSignupGroupFormContext();
  const { saving, updateSeatsReservation } = useSeatsReservationActions({
    registration,
    setSignups,
    signups,
  });

  const { setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const [participantsToDelete, setParticipantsToDelete] = useState(0);

  const handleParticipantAmountChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setParticipantAmount(Number(event.target.value));
  };

  const updateParticipantAmount = () => {
    /* istanbul ignore else */
    if (participantAmount !== signups.length) {
      setServerErrorItems([]);

      updateSeatsReservation(participantAmount, {
        onError: (error) => showServerErrors({ error }, 'seatsReservation'),
      });
    }
  };

  const openDeleteSignupFromFormModal = () => {
    setOpenModal(SIGNUP_MODALS.DELETE_SIGNUP_FROM_FORM);
  };

  const handleUpdateClick = () => {
    if (participantAmount < signups.length) {
      setParticipantsToDelete(signups.length - participantAmount);
      openDeleteSignupFromFormModal();
    } else {
      updateParticipantAmount();
    }
  };

  const maxSeatAmount = useMemo(
    () => getMaxSeatsAmount(registration),
    [registration]
  );

  return (
    <>
      <ConfirmDeleteSignupFromFormModal
        isOpen={openModal === SIGNUP_MODALS.DELETE_SIGNUP_FROM_FORM}
        isSaving={saving}
        onClose={closeModal}
        onConfirm={updateParticipantAmount}
        participantCount={participantsToDelete}
      />
      <div className={styles.participantAmountSelector}>
        <NumberInput
          id="participant-amount-field"
          disabled={disabled}
          label={t(`signup.form.labelParticipantAmount`)}
          min={1}
          max={maxSeatAmount}
          onChange={handleParticipantAmountChange}
          required
          step={1}
          value={participantAmount}
        />
        <div className={styles.buttonWrapper}>
          <Button
            disabled={disabled}
            onClick={handleUpdateClick}
            type="button"
            variant={ButtonVariant.Secondary}
          >
            {t(`signup.form.buttonUpdateParticipantAmount`)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ParticipantAmountSelector;
