import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
  UpdateEnrolmentMutationInput,
  useDeleteEnrolmentMutation,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { UpdateActionsCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearEnrolmentQueries,
  clearEnrolmentsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { EnrolmentFormFields } from '../types';
import { getUpdateEnrolmentPayload } from '../utils';

interface Props {
  enrolment?: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentUpdateActionsState = {
  cancelEnrolment: (callbacks?: UpdateActionsCallbacks) => Promise<void>;
  saving: ENROLMENT_ACTIONS | false;
  updateEnrolment: (
    values: EnrolmentFormFields,
    callbacks?: UpdateActionsCallbacks
  ) => Promise<void>;
};
const useEnrolmentUpdateActions = ({
  enrolment,
  registration,
}: Props): UseEnrolmentUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();

  const { closeModal } = useEnrolmentPageContext();

  const [saving, setSaving] = useMountedState<ENROLMENT_ACTIONS | false>(false);

  const [deleteEnrolmentMutation] = useDeleteEnrolmentMutation();
  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const cleanAfterUpdate = async (callbacks?: UpdateActionsCallbacks) => {
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
    callbacks?: UpdateActionsCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: UpdateEnrolmentMutationInput;
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

  const cancelEnrolment = async (callbacks?: UpdateActionsCallbacks) => {
    try {
      setSaving(ENROLMENT_ACTIONS.CANCEL);

      await deleteEnrolmentMutation({
        variables: {
          cancellationCode: enrolment?.cancellationCode as string,
        },
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

  const updateEnrolment = async (
    values: EnrolmentFormFields,
    callbacks?: UpdateActionsCallbacks
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
    saving,
    updateEnrolment,
  };
};

export default useEnrolmentUpdateActions;
