import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
  UpdateEnrolmentMutationInput,
  useCreateEnrolmentMutation,
  useDeleteEnrolmentMutation,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearEnrolmentQueries,
  clearEnrolmentsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import { getSeatsReservationData } from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { EnrolmentFormFields } from '../types';
import { getEnrolmentPayload, getUpdateEnrolmentPayload } from '../utils';

interface Props {
  enrolment?: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentActionsState = {
  cancelEnrolment: (callbacks?: MutationCallbacks) => Promise<void>;
  createEnrolment: (
    values: EnrolmentFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  saving: ENROLMENT_ACTIONS | false;
  updateEnrolment: (
    values: EnrolmentFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};
const useEnrolmentActions = ({
  enrolment,
  registration,
}: Props): UseEnrolmentActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();

  const { closeModal } = useEnrolmentPageContext();

  const [saving, setSaving] = useMountedState<ENROLMENT_ACTIONS | false>(false);

  const [createEnrolmentMutation] = useCreateEnrolmentMutation();
  const [deleteEnrolmentMutation] = useDeleteEnrolmentMutation();
  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearEnrolmentQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearEnrolmentsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
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
    payload?: CreateEnrolmentMutationInput | UpdateEnrolmentMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        enrolment,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const cancelEnrolment = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(ENROLMENT_ACTIONS.CANCEL);

      await deleteEnrolmentMutation({
        variables: { cancellationCode: enrolment?.cancellationCode as string },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to cancel enrolment',
      });
    }
  };

  const createEnrolment = async (
    values: EnrolmentFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(ENROLMENT_ACTIONS.CREATE);

    const reservationData = getSeatsReservationData(registration.id as string);
    const payload = getEnrolmentPayload({
      formValues: values,
      reservationCode: reservationData?.code as string,
    });

    try {
      const { data } = await createEnrolmentMutation({
        variables: { input: payload, registration: registration.id as string },
      });

      if (data?.createEnrolment) {
        await cleanAfterUpdate(callbacks);
      }
    } catch (error) /* istanbul ignore next */ {
      // Report error to Sentry
      handleError({
        callbacks,
        error,
        message: 'Failed to create enrolment',
        payload,
      });
    }
  };

  const updateEnrolment = async (
    values: EnrolmentFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateEnrolmentMutationInput = getUpdateEnrolmentPayload({
      formValues: values,
      id: enrolment?.id as string,
      registration,
    });

    try {
      setSaving(ENROLMENT_ACTIONS.UPDATE);

      await updateEnrolmentMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update enrolment',
        payload,
      });
    }
  };

  return {
    cancelEnrolment,
    createEnrolment,
    saving,
    updateEnrolment,
  };
};

export default useEnrolmentActions;
