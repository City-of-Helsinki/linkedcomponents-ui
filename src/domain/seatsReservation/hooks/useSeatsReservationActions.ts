import { useLocation } from 'react-router';

import {
  CreateSeatsReservationMutationInput,
  RegistrationFieldsFragment,
  SeatsReservation,
  UpdateSeatsReservationMutationInput,
  useCreateSeatsReservationMutation,
  useUpdateSeatsReservationMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import { SIGNUP_MODALS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { SignupFields } from '../../signupGroup/types';
import { getNewSignups } from '../../signupGroup/utils';
import useUser from '../../user/hooks/useUser';
import { getSeatsReservationData, setSeatsReservationData } from '../utils';

type UseSeatsReservationActionsProps = {
  registration: RegistrationFieldsFragment;
  setSignups: (value: SignupFields[]) => void;
  signups: SignupFields[];
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
  registration,
  setSignups,
  signups,
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
    payload?:
      | CreateSeatsReservationMutationInput
      | UpdateSeatsReservationMutationInput;
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
    const payload: CreateSeatsReservationMutationInput = {
      registration: registrationId,
      seats: 1,
    };

    try {
      const { data } = await createSeatsReservationMutation({
        variables: { input: payload },
      });
      const seatsReservation = data?.createSeatsReservation as SeatsReservation;

      setSeatsReservationData(registrationId, seatsReservation);

      /* istanbul ignore else */
      if (setSignups) {
        const newSignups = getNewSignups({
          seatsReservation,
          signups: signups || /* istanbul ignore next */ [],
        });

        setSignups(newSignups);
      }

      if (data?.createSeatsReservation.inWaitlist) {
        setOpenModal(SIGNUP_MODALS.PERSONS_ADDED_TO_WAITLIST);
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

    /* istanbul ignore next */
    if (!reservationData) {
      throw new Error('Reservation data is not stored to session storage');
    }

    const payload: UpdateSeatsReservationMutationInput = {
      code: reservationData?.code as string,
      registration: registrationId,
      seats,
    };

    try {
      const { data } = await updateSeatsReservationMutation({
        variables: { id: reservationData.id, input: payload },
      });
      const seatsReservation = data?.updateSeatsReservation as SeatsReservation;

      const newSignups = getNewSignups({
        seatsReservation,
        signups,
      });

      setSignups(newSignups);
      setSeatsReservationData(registrationId, seatsReservation);

      setSaving(false);
      // Show modal to inform that some of the persons will be added to the waiting list
      if (data?.updateSeatsReservation.inWaitlist) {
        setOpenModal(SIGNUP_MODALS.PERSONS_ADDED_TO_WAITLIST);
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
