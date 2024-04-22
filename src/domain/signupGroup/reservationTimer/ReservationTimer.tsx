/* eslint-disable max-len */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useAccessibilityNotificationContext } from '../../../common/components/accessibilityNotificationContext/hooks/useAccessibilityNotificationContext';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useSeatsReservationActions from '../../seatsReservation/hooks/useSeatsReservationActions';
import {
  clearSeatsReservationData,
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../seatsReservation/utils';
import { SIGNUP_MODALS } from '../../signup/constants';
import { useSignupServerErrorsContext } from '../../signup/signupServerErrorsContext/hooks/useSignupServerErrorsContext';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import ReservationTimeExpiringModal from '../modals/reservationTimeExpiringModal/ReservationTimeExpiringModal';
import { useSignupGroupFormContext } from '../signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupFormFields } from '../types';
import { clearCreateSignupGroupFormData } from '../utils';

const EXPIRING_THRESHOLD = 60;

const getTimeParts = (timeLeft: number) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor(timeLeft / 60) % 60;
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds };
};

const getTimeStr = (timeLeft: number) => {
  const { hours, minutes, seconds } = getTimeParts(timeLeft);

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
  setSignups: (value: SignupFormFields[]) => void;
  signups: SignupFormFields[];
}

const ReservationTimer: React.FC<ReservationTimerProps> = ({
  callbacksDisabled,
  disableCallbacks,
  initReservationData,
  registration,
  setSignups,
  signups,
}) => {
  const isExpiringModalAlreadyDisplayed = useRef(false);
  const navigate = useNavigate();
  const { setAccessibilityText } = useAccessibilityNotificationContext();
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
  const { closeModal, openModal, setOpenModal } = useSignupGroupFormContext();
  const { setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const enableTimer = useCallback(() => {
    timerEnabled.current = true;
  }, []);

  const handleTryAgain = () => {
    navigate(0);
  };

  const setTimeLeftAndNotify = (newTimeLeft: number) => {
    setTimeLeft(newTimeLeft);
    const { hours, minutes, seconds } = getTimeParts(newTimeLeft);
    setAccessibilityText(
      [
        t('common.reservationTimer.timeLeft'),
        t('common.reservationTimer.hour', { count: hours }),
        t('common.reservationTimer.minute', { count: minutes }),
        t('common.reservationTimer.second', { count: seconds }),
      ].join(' ')
    );
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
          setTimeLeftAndNotify(getRegistrationTimeLeft(seatsReservation));
        },
      });
    } else if (data) {
      enableTimer();
      setTimeLeftAndNotify(getRegistrationTimeLeft(data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      /* istanbul ignore else */
      if (timerEnabled.current) {
        const data = getSeatsReservationData(registrationId);
        const newTimeLeft = getRegistrationTimeLeft(data);
        setTimeLeft(newTimeLeft);

        /* istanbul ignore else */
        if (!callbacksDisabled) {
          if (!data || isSeatsReservationExpired(data)) {
            disableCallbacks();

            clearCreateSignupGroupFormData(registrationId);
            clearSeatsReservationData(registrationId);

            setOpenModal(SIGNUP_MODALS.RESERVATION_TIME_EXPIRED);
          } else if (
            !isExpiringModalAlreadyDisplayed.current &&
            newTimeLeft <= EXPIRING_THRESHOLD
          ) {
            setOpenModal(SIGNUP_MODALS.RESERVATION_TIME_EXPIRING);
            isExpiringModalAlreadyDisplayed.current = true;
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
      <ReservationTimeExpiringModal
        isOpen={openModal === SIGNUP_MODALS.RESERVATION_TIME_EXPIRING}
        onClose={closeModal}
        timeLeft={timeLeft}
      />
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
