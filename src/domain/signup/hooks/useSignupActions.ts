import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  RegistrationFieldsFragment,
  SendMessageMutationInput,
  SignupFieldsFragment,
  SignupInput,
  UpdateSignupMutationInput,
  useDeleteSignupMutation,
  useSendMessageMutation,
  useUpdateSignupMutation,
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
import { useSignupGroupFormContext } from '../../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupGroupFormFields } from '../../signupGroup/types';
import { SEND_MESSAGE_FORM_NAME, SIGNUP_ACTIONS } from '../constants';
import { SendMessageFormFields } from '../types';
import {
  getUpdateSignupPayload,
  omitSensitiveDataFromSignupPayload,
} from '../utils';

interface Props {
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
}

type UseSignupActionsState = {
  deleteSignup: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: SIGNUP_ACTIONS | false;
  sendMessage: (options: {
    callbacks?: MutationCallbacks;
    signupGroups?: string[];
    signups?: string[];
    values: SendMessageFormFields;
  }) => Promise<void>;
  updateSignup: (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};
const useSignupActions = ({
  registration,
  signup,
}: Props): UseSignupActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const { closeModal } = useSignupGroupFormContext();

  const [saving, setSaving] = useMountedState<SIGNUP_ACTIONS | false>(false);

  const [deleteSignupMutation] = useDeleteSignupMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [updateSignupMutation] = useUpdateSignupMutation();

  const savingFinished = () => {
    setSaving(false);
  };

  const { handleError } = useHandleError<
    SendMessageMutationInput | Partial<SignupInput | UpdateSignupMutationInput>,
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

  const deleteSignup = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(SIGNUP_ACTIONS.DELETE);

      await deleteSignupMutation({
        variables: { id: getValue(signup?.id, '') },
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

  const updateSignup = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateSignupMutationInput = getUpdateSignupPayload({
      formValues: values,
      id: getValue(signup?.id, ''),
      registration,
    });

    try {
      setSaving(SIGNUP_ACTIONS.UPDATE);

      await updateSignupMutation({
        variables: {
          input: payload,
          id: getValue(signup?.id, ''),
        },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update signup',
        payload: omitSensitiveDataFromSignupPayload(payload),
        savingFinished,
      });
    }
  };

  const sendMessage = async ({
    callbacks,
    signupGroups,
    signups,
    values,
  }: {
    callbacks?: MutationCallbacks;
    signupGroups?: string[];
    signups?: string[];
    values: SendMessageFormFields;
  }) => {
    const payload: SendMessageMutationInput = {
      body: values[SEND_MESSAGE_FORM_NAME].body,
      signupGroups,
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
    deleteSignup,
    saving,
    sendMessage,
    updateSignup,
  };
};

export default useSignupActions;
