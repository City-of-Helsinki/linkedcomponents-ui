import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateSignupGroupMutationInput,
  RegistrationFieldsFragment,
  SendMessageMutationInput,
  SignupFieldsFragment,
  UpdateEnrolmentMutationInput,
  useCreateSignupGroupMutation,
  useDeleteEnrolmentMutation,
  useSendMessageMutation,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearSignupQueries,
  clearSignupsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import { getSeatsReservationData } from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS, SEND_MESSAGE_FORM_NAME } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { SendMessageFormFields, SignupGroupFormFields } from '../types';
import { getSignupGroupPayload, getUpdateEnrolmentPayload } from '../utils';

interface Props {
  enrolment?: SignupFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentActionsState = {
  cancelEnrolment: (callbacks?: MutationCallbacks) => Promise<void>;
  createSignupGroup: (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  saving: ENROLMENT_ACTIONS | false;
  sendMessage: (
    values: SendMessageFormFields,
    signups?: string[],
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  updateEnrolment: (
    values: SignupGroupFormFields,
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

  const [createSignupGroupMutation] = useCreateSignupGroupMutation();
  const [deleteEnrolmentMutation] = useDeleteEnrolmentMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearSignupQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearSignupsQueries(apolloClient);

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
    payload?:
      | CreateSignupGroupMutationInput
      | SendMessageMutationInput
      | UpdateEnrolmentMutationInput;
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
        variables: {
          signup: getValue(enrolment?.id, ''),
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

  const createSignupGroup = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(ENROLMENT_ACTIONS.CREATE);

    const reservationData = getSeatsReservationData(
      getValue(registration.id, '')
    );
    const payload: CreateSignupGroupMutationInput = getSignupGroupPayload({
      formValues: values,
      registration,
      reservationCode: getValue(reservationData?.code, ''),
    });

    try {
      const { data } = await createSignupGroupMutation({
        variables: { input: payload },
      });

      /* istanbul ignore else */
      if (data?.createSignupGroup) {
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
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateEnrolmentMutationInput = getUpdateEnrolmentPayload({
      formValues: values,
      id: getValue(enrolment?.id, ''),
      registration,
    });

    try {
      setSaving(ENROLMENT_ACTIONS.UPDATE);

      await updateEnrolmentMutation({
        variables: {
          input: payload,
          signup: getValue(enrolment?.id, ''),
        },
      });

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

  const sendMessage = async (
    values: SendMessageFormFields,
    signups?: string[],
    callbacks?: MutationCallbacks
  ) => {
    const payload: SendMessageMutationInput = {
      body: values[SEND_MESSAGE_FORM_NAME].body,
      signups,
      subject: values[SEND_MESSAGE_FORM_NAME].subject,
    };

    try {
      setSaving(ENROLMENT_ACTIONS.SEND_MESSAGE);

      await sendMessageMutation({
        variables: {
          input: payload,
          registration: getValue(registration.id, ''),
        },
      });

      savingFinished();
      closeModal();
      // Call callback function if defined
      await (callbacks?.onSuccess && callbacks.onSuccess());
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to send message',
        payload,
      });
    }
  };

  return {
    cancelEnrolment,
    createSignupGroup,
    saving,
    sendMessage,
    updateEnrolment,
  };
};

export default useEnrolmentActions;
