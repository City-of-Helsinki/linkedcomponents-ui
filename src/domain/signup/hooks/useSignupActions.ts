import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  CreateSignupsMutationInput,
  RegistrationFieldsFragment,
  SendMessageMutationInput,
  SignupFieldsFragment,
  SignupInput,
  UpdateSignupMutationInput,
  useCreateSignupsMutation,
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
import { getSeatsReservationData } from '../../seatsReservation/utils';
import { useSignupGroupFormContext } from '../../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupGroupFormFields } from '../../signupGroup/types';
import { SEND_MESSAGE_FORM_NAME, SIGNUP_ACTIONS } from '../constants';
import { SendMessageFormFields } from '../types';
import {
  getCreateSignupsPayload,
  getUpdateSignupPayload,
  omitSensitiveDataFromSignupPayload,
  omitSensitiveDataFromSignupsPayload,
} from '../utils';

interface Props {
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
}

type UseSignupActionsState = {
  createSignups: (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
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

  const [createSignupsMutation] = useCreateSignupsMutation();
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

  const cleanAfterUpdate = async (
    id: string,
    callbacks?: MutationCallbacks
  ) => {
    /* istanbul ignore next */
    !isTestEnv && clearSignupQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearSignupsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await callbacks?.onSuccess?.(id);
  };

  const createSignups = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(SIGNUP_ACTIONS.CREATE);

    const reservationData = getSeatsReservationData(registration.id as string);
    const payload = getCreateSignupsPayload({
      formValues: values,
      registration,
      reservationCode: reservationData?.code as string,
    });

    createSignupsMutation({
      onError: (error, options) => {
        handleError({
          callbacks,
          error,
          message: 'Failed to create signups',
          payload: omitSensitiveDataFromSignupsPayload(
            options?.variables as CreateSignupsMutationInput
          ),
          savingFinished,
        });
      },
      onCompleted: (data) => {
        const id = data.createSignups[0].id;
        cleanAfterUpdate(id, callbacks);
      },
      variables: { input: payload },
    });
  };

  const deleteSignup = async (callbacks?: MutationCallbacks) => {
    const id = getValue(signup?.id, '');
    setSaving(SIGNUP_ACTIONS.DELETE);

    deleteSignupMutation({
      onCompleted: () => {
        cleanAfterUpdate(id, callbacks);
      },
      onError:
        /* istanbul ignore next */
        (error) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to cancel signup',
            savingFinished,
          });
        },
      variables: { id },
    });
  };

  const updateSignup = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(SIGNUP_ACTIONS.UPDATE);

    const id = getValue(signup?.id, '');
    const payload: UpdateSignupMutationInput = getUpdateSignupPayload({
      formValues: values,
      hasSignupGroup: Boolean(signup?.signupGroup),
      id,
      registration,
    });

    updateSignupMutation({
      onCompleted: () => {
        cleanAfterUpdate(id, callbacks);
      },
      onError:
        /* istanbul ignore next */
        (error) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to update signup',
            payload: omitSensitiveDataFromSignupPayload(payload),
            savingFinished,
          });
        },
      variables: { input: payload, id },
    });
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
    setSaving(SIGNUP_ACTIONS.SEND_MESSAGE);

    const payload: SendMessageMutationInput = {
      body: values[SEND_MESSAGE_FORM_NAME].body,
      signupGroups,
      signups,
      subject: values[SEND_MESSAGE_FORM_NAME].subject,
    };

    sendMessageMutation({
      onCompleted: () => {
        savingFinished();
        closeModal();
        callbacks?.onSuccess?.();
      },
      onError:
        /* istanbul ignore next */
        (error) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to send message',
            payload,
            savingFinished,
          });
        },
      variables: {
        input: payload,
        registration: getValue(registration.id, ''),
      },
    });
  };

  return {
    createSignups,
    deleteSignup,
    saving,
    sendMessage,
    updateSignup,
  };
};

export default useSignupActions;
