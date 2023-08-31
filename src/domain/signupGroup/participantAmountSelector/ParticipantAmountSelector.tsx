/* eslint-disable max-len */
import { useField } from 'formik';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import { ENROLMENT_MODALS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../../enrolment/enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import { getMaxSeatsAmount } from '../../registration/utils';
import useSeatsReservationActions from '../../seatsReservation/hooks/useSeatsReservationActions';
import { getSeatsReservationData } from '../../seatsReservation/utils';
import { SIGNUP_GROUP_FIELDS } from '../constants';
import ConfirmDeleteParticipantModal from '../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { SignupFields } from '../types';
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

  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFields[]
  >({ name: SIGNUP_GROUP_FIELDS.SIGNUPS });

  const { saving, updateSeatsReservation } = useSeatsReservationActions({
    registration,
    setSignups,
    signups,
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

  const openDeleteParticipantModal = () => {
    setOpenModal(ENROLMENT_MODALS.DELETE);
  };

  const handleUpdateClick = () => {
    if (participantAmount < signups.length) {
      setParticipantsToDelete(signups.length - participantAmount);
      openDeleteParticipantModal();
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
            variant="secondary"
          >
            {t(`signup.form.buttonUpdateParticipantAmount`)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ParticipantAmountSelector;
