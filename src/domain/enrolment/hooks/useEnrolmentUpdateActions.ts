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
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import { EnrolmentFormFields } from '../types';
import {
  clearEnrolmentQueries,
  clearEnrolmentsQueries,
  getEnrolmentPayload,
} from '../utils';

export enum ENROLMENT_MODALS {
  CANCEL = 'cancel',
}

interface Props {
  enrolment?: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentUpdateActionsState = {
  closeModal: () => void;
  cancelEnrolment: (callbacks?: UpdateActionsCallbacks) => Promise<void>;
  openModal: ENROLMENT_MODALS | null;
  saving: ENROLMENT_ACTIONS | false;
  setOpenModal: (modal: ENROLMENT_MODALS | null) => void;
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
  const [openModal, setOpenModal] = useMountedState<ENROLMENT_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<ENROLMENT_ACTIONS | false>(false);

  const [deleteEnrolmentMutation] = useDeleteEnrolmentMutation();
  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

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
    let payload: UpdateEnrolmentMutationInput = {
      id: enrolment?.id as string,
      registration: registration.id as string,
    };

    try {
      setSaving(ENROLMENT_ACTIONS.UPDATE);

      payload = {
        ...getEnrolmentPayload(values, registration),
        id: enrolment?.id as string,
      };

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
    closeModal,
    cancelEnrolment,
    openModal,
    saving,
    setOpenModal,
    updateEnrolment,
  };
};

export default useEnrolmentUpdateActions;
