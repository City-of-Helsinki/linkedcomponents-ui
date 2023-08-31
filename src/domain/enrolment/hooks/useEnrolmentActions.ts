import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  CreateSignupGroupMutationInput,
  RegistrationFieldsFragment,
  SendMessageMutationInput,
  SignupFieldsFragment,
  UpdateEnrolmentMutationInput,
  useDeleteEnrolmentMutation,
  useSendMessageMutation,
  useUpdateEnrolmentMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearSignupQueries,
  clearSignupsQueries,
} from '../../app/apollo/clearCacheUtils';
import { useSignupPageContext } from '../../signup/signupPageContext/hooks/useSignupPageContext';
import { SignupGroupFormFields } from '../../signupGroup/types';
import { SEND_MESSAGE_FORM_NAME, SIGNUP_ACTIONS } from '../constants';
import { SendMessageFormFields } from '../types';
import { getUpdateEnrolmentPayload } from '../utils';

interface Props {
  enrolment?: SignupFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseEnrolmentActionsState = {
  cancelEnrolment: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: SIGNUP_ACTIONS | false;
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

  const { closeModal } = useSignupPageContext();

  const [saving, setSaving] = useMountedState<SIGNUP_ACTIONS | false>(false);

  const [deleteEnrolmentMutation] = useDeleteEnrolmentMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [updateEnrolmentMutation] = useUpdateEnrolmentMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const { handleError } = useHandleError<
    | CreateSignupGroupMutationInput
    | SendMessageMutationInput
    | UpdateEnrolmentMutationInput,
    SignupFieldsFragment
  >();

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

  const cancelEnrolment = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(SIGNUP_ACTIONS.CANCEL);

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
        message: 'Failed to cancel signup',
        savingFinished,
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
      setSaving(SIGNUP_ACTIONS.UPDATE);

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
        savingFinished,
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
      setSaving(SIGNUP_ACTIONS.SEND_MESSAGE);

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
        savingFinished,
      });
    }
  };

  return {
    cancelEnrolment,
    saving,
    sendMessage,
    updateEnrolment,
  };
};

export default useEnrolmentActions;
