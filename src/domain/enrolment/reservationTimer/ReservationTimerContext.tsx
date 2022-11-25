import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  Registration,
  SeatsReservation,
  useCreateSeatsReservationMutation,
} from '../../../generated/graphql';
import { reportError } from '../../app/sentry/utils';
import {
  clearSeatsReservationData,
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_MODALS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import { AttendeeFields } from '../types';
import { clearCreateEnrolmentFormData, getNewAttendees } from '../utils';

export type ReservationTimerContextProps = {
  callbacksDisabled: boolean;
  disableCallbacks: () => void;
  registration: Registration;

  timeLeft: number | null;
};

export const ReservationTimerContext = React.createContext<
  ReservationTimerContextProps | undefined
>(undefined);

interface Props {
  attendees?: AttendeeFields[];
  initializeReservationData: boolean;
  registration: Registration;
  setAttendees?: (value: AttendeeFields[]) => void;
}

export const ReservationTimerProvider: FC<PropsWithChildren<Props>> = ({
  attendees,
  children,
  initializeReservationData,
  registration,
  setAttendees,
}) => {
  const registrationId = useMemo(
    () => registration.id as string,
    [registration]
  );

  const { openModal, setOpenModal } = useEnrolmentPageContext();

  const { user } = useUser();
  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();
  const location = useLocation();
  const navigate = useNavigate();
  const creatingReservationStarted = useRef(false);
  const callbacksDisabled = useRef(false);
  const timerEnabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const enableTimer = useCallback(() => {
    timerEnabled.current = true;
  }, []);

  const [createSeatsReservationMutation] = useCreateSeatsReservationMutation();

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

  const handleTryAgain = () => {
    navigate(0);
  };

  const createSeatsReservation = async () => {
    const payload = { registration: registrationId, seats: 1, waitlist: true };

    try {
      const { data } = await createSeatsReservationMutation({
        variables: { input: payload },
      });
      const seatsReservation = data?.createSeatsReservation as SeatsReservation;

      enableTimer();
      setSeatsReservationData(registrationId, seatsReservation);
      setTimeLeft(getRegistrationTimeLeft(seatsReservation));

      if (setAttendees) {
        const newAttendees = getNewAttendees({
          attendees: attendees || /* istanbul ignore next */ [],
          registration,
          seatsReservation,
        });

        setAttendees(newAttendees);
      }

      if (data?.createSeatsReservation.waitlistSpots) {
        setOpenModal(ENROLMENT_MODALS.PERSONS_ADDED_TO_WAITLIST);
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
        message: 'Failed to reserve seats',
        user,
      });
    }
  };

  React.useEffect(() => {
    const data = getSeatsReservationData(registrationId);

    if (
      initializeReservationData &&
      !creatingReservationStarted.current &&
      !data
    ) {
      creatingReservationStarted.current = true;
      // Clear server errors
      setServerErrorItems([]);

      // useEffect runs twice in React v18.0, so start creating new seats reservation
      // only if creatingReservationStarted is false
      createSeatsReservation();
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
        if (!callbacksDisabled.current) {
          if (!data || isSeatsReservationExpired(data)) {
            disableCallbacks();

            clearCreateEnrolmentFormData(registrationId);
            clearSeatsReservationData(registrationId);

            setOpenModal(ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [disableCallbacks, registrationId, setOpenModal, setTimeLeft, timeLeft]);

  return (
    <ReservationTimerContext.Provider
      value={{
        callbacksDisabled: callbacksDisabled.current,
        disableCallbacks,
        registration,
        timeLeft,
      }}
    >
      <ReservationTimeExpiredModal
        isOpen={openModal === ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED}
        onTryAgain={handleTryAgain}
      />
      {children}
    </ReservationTimerContext.Provider>
  );
};
