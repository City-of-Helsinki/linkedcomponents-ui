import { useLocation } from 'react-router';

import {
  RegistrationFieldsFragment,
  SeatsReservation,
  UpdateSeatsReservationMutationInput,
  useCreateSeatsReservationMutation,
  useUpdateSeatsReservationMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_MODALS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { AttendeeFields } from '../types';
import { getNewAttendees } from '../utils';

type UseSeatsReservationActionsProps = {
  attendees: AttendeeFields[];
  registration: RegistrationFieldsFragment;
  setAttendees: (value: AttendeeFields[]) => void;
};

type UseSeatsReservationActionsState = {
  createSeatsReservation: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: boolean;
  updateSeatsReservation: (
    seats: number,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};

const useSeatsReservationActions = ({
  attendees,
  registration,
  setAttendees,
}: UseSeatsReservationActionsProps): UseSeatsReservationActionsState => {
  const location = useLocation();
  const { user } = useUser();
  const [saving, setSaving] = useMountedState(false);

  const { closeModal, setOpenModal } = useEnrolmentPageContext();

  const registrationId = registration.id as string;

  const [createSeatsReservationMutation] = useCreateSeatsReservationMutation();
  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const handleError = ({
    callbacks,
    error,
    message,
    payload,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: UpdateSeatsReservationMutationInput;
  }) => {
    savingFinished();
    closeModal();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payload,
        payloadAsString: JSON.stringify(payload),
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const createSeatsReservation = async (callbacks?: MutationCallbacks) => {
    const payload = { registration: registrationId, seats: 1, waitlist: true };

    try {
      const { data } = await createSeatsReservationMutation({
        variables: { input: payload },
      });
      const seatsReservation = data?.createSeatsReservation as SeatsReservation;

      setSeatsReservationData(registrationId, seatsReservation);

      /* istanbul ignore else */
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
      callbacks?.onSuccess?.();
    } catch (error) {
      handleError({
        callbacks,
        error,
        message: 'Failed to reserve seats',
        payload,
      });
    }
  };

  const updateSeatsReservation = async (
    seats: number,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(true);
    const reservationData = getSeatsReservationData(registrationId);

    const payload = {
      code: reservationData?.code as string,
      registration: registrationId,
      seats,
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
      handleError({
        callbacks,
        error,
        message: 'Failed to update seats reservation',
        payload,
      });
    }
  };

  return { createSeatsReservation, saving, updateSeatsReservation };
};

export default useSeatsReservationActions;
