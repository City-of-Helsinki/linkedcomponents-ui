/* eslint-disable max-len */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { RegistrationFieldsFragment } from '../../../generated/graphql';
import { SIGNUP_MODALS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../../enrolment/enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useSeatsReservationActions from '../../seatsReservation/hooks/useSeatsReservationActions';
import {
  clearSeatsReservationData,
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../seatsReservation/utils';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import { SignupFields } from '../types';
import { clearCreateSignupGroupFormData } from '../utils';

const getTimeStr = (timeLeft: number) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor(timeLeft / 60) % 60;
  const seconds = timeLeft % 60;

  return [
    hours,
    ...[minutes, seconds].map((n) => n.toString().padStart(2, '0')),
  ]
    .filter((i) => i)
    .join(':');
};

interface ReservationTimerProps {
  callbacksDisabled: boolean;
  disableCallbacks: () => void;
  initReservationData: boolean;
  registration: RegistrationFieldsFragment;
  setSignups: (value: SignupFields[]) => void;
  signups: SignupFields[];
}

const ReservationTimer: React.FC<ReservationTimerProps> = ({
  callbacksDisabled,
  disableCallbacks,
  initReservationData,
  registration,
  setSignups,
  signups,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const creatingReservationStarted = useRef(false);
  const timerEnabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const registrationId = useMemo(
    () => registration.id as string,
    [registration]
  );

  const { createSeatsReservation } = useSeatsReservationActions({
    registration,
    setSignups,
    signups,
  });
  const { openModal, setOpenModal } = useEnrolmentPageContext();
  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const enableTimer = useCallback(() => {
    timerEnabled.current = true;
  }, []);

  const handleTryAgain = () => {
    navigate(0);
  };

  React.useEffect(() => {
    const data = getSeatsReservationData(registrationId);

    /* istanbul ignore else */
    if (initReservationData && !creatingReservationStarted.current && !data) {
      creatingReservationStarted.current = true;
      // Clear server errors
      setServerErrorItems([]);

      // useEffect runs twice in React v18.0, so start creating new seats reservation
      // only if creatingReservationStarted is false
      createSeatsReservation({
        onError: (error) => showServerErrors({ error }, 'seatsReservation'),
        onSuccess: () => {
          const seatsReservation = getSeatsReservationData(registrationId);

          enableTimer();
          setTimeLeft(getRegistrationTimeLeft(seatsReservation));
        },
      });
    } else if (data) {
      enableTimer();
      setTimeLeft(getRegistrationTimeLeft(data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      /* istanbul ignore else */
      if (timerEnabled.current) {
        const data = getSeatsReservationData(registrationId);
        setTimeLeft(getRegistrationTimeLeft(data));

        /* istanbul ignore else */
        if (!callbacksDisabled) {
          if (!data || isSeatsReservationExpired(data)) {
            disableCallbacks();

            clearCreateSignupGroupFormData(registrationId);
            clearSeatsReservationData(registrationId);

            setOpenModal(SIGNUP_MODALS.RESERVATION_TIME_EXPIRED);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    callbacksDisabled,
    disableCallbacks,
    registrationId,
    setOpenModal,
    setTimeLeft,
    timeLeft,
  ]);

  return (
    <>
      <ReservationTimeExpiredModal
        isOpen={openModal === SIGNUP_MODALS.RESERVATION_TIME_EXPIRED}
        onClose={handleTryAgain}
      />

      <div>
        {t('signup.form.timeLeft')}{' '}
        <strong>{timeLeft !== null && getTimeStr(timeLeft)}</strong>
      </div>
    </>
  );
};

export default ReservationTimer;
