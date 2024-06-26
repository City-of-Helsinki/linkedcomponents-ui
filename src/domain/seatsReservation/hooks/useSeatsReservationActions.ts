import {
  CreateSeatsReservationMutationInput,
  RegistrationFieldsFragment,
  SeatsReservation,
  UpdateSeatsReservationMutationInput,
  useCreateSeatsReservationMutation,
  useUpdateSeatsReservationMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import { SIGNUP_MODALS } from '../../signup/constants';
import { useSignupGroupFormContext } from '../../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupFormFields } from '../../signupGroup/types';
import { getNewSignups } from '../../signupGroup/utils';
import { getSeatsReservationData, setSeatsReservationData } from '../utils';

type UseSeatsReservationActionsProps = {
  registration: RegistrationFieldsFragment;
  setSignups: (value: SignupFormFields[]) => void;
  signups: SignupFormFields[];
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
  const [saving, setSaving] = useMountedState(false);

  const { closeModal, setOpenModal } = useSignupGroupFormContext();

  const registrationId = registration.id as string;

  const [createSeatsReservationMutation] = useCreateSeatsReservationMutation();
  const [updateSeatsReservationMutation] = useUpdateSeatsReservationMutation();

  const savingFinished = () => {
    setSaving(false);
  };
  const { handleError } = useHandleError<
    CreateSeatsReservationMutationInput | UpdateSeatsReservationMutationInput,
    null
  >();

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
        savingFinished,
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
      code: reservationData.code,
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
        savingFinished,
      });
    }
  };

  return { createSeatsReservation, saving, updateSeatsReservation };
};

export default useSeatsReservationActions;
