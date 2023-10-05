import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  CreateSignupGroupMutationInput,
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
  UpdateSignupGroupMutationInput,
  useCreateSignupGroupMutation,
  useDeleteSignupGroupMutation,
  useUpdateSignupGroupMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearSignupGroupQueries,
  clearSignupGroupsQueries,
  clearSignupQueries,
  clearSignupsQueries,
} from '../../app/apollo/clearCacheUtils';
import { getSeatsReservationData } from '../../seatsReservation/utils';
import { SignupGroupFormFields } from '../../signupGroup/types';
import {
  getSignupGroupPayload,
  getUpdateSignupGroupPayload,
} from '../../signupGroup/utils';
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import { useSignupGroupFormContext } from '../signupGroupFormContext/hooks/useSignupGroupFormContext';

interface Props {
  signupGroup?: SignupGroupFieldsFragment;
  registration: RegistrationFieldsFragment;
}

type UseSignupGroupActionsState = {
  createSignupGroup: (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteSignupGroup: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: SIGNUP_GROUP_ACTIONS | null;
  updateSignupGroup: (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};

const useSignupGroupActions = ({
  registration,
  signupGroup,
}: Props): UseSignupGroupActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;

  const [saving, setSaving] = useMountedState<SIGNUP_GROUP_ACTIONS | null>(
    null
  );

  const { closeModal } = useSignupGroupFormContext();

  const { handleError } = useHandleError<
    CreateSignupGroupMutationInput,
    SignupGroupFieldsFragment
  >();

  const [createSignupGroupMutation] = useCreateSignupGroupMutation();
  const [deleteSignupGroupMutation] = useDeleteSignupGroupMutation();
  const [updateSignupGroupMutation] = useUpdateSignupGroupMutation();

  const savingFinished = () => {
    setSaving(null);
    closeModal();
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearSignupGroupQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearSignupGroupsQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearSignupQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearSignupsQueries(apolloClient);

    savingFinished();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const createSignupGroup = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(SIGNUP_GROUP_ACTIONS.CREATE);

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
        message: 'Failed to create signup group',
        payload,
        savingFinished,
      });
    }
  };

  const deleteSignupGroup = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(SIGNUP_GROUP_ACTIONS.DELETE);

      await deleteSignupGroupMutation({
        variables: { id: getValue(signupGroup?.id, '') },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete signup group',
        savingFinished,
      });
    }
  };

  const updateSignupGroup = async (
    values: SignupGroupFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateSignupGroupMutationInput = getUpdateSignupGroupPayload(
      {
        formValues: values,
        registration,
      }
    );

    try {
      setSaving(SIGNUP_GROUP_ACTIONS.UPDATE);

      await updateSignupGroupMutation({
        variables: {
          input: payload,
          id: getValue(signupGroup?.id, ''),
        },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update signup group',
        payload,
        savingFinished,
      });
    }
  };

  return {
    createSignupGroup,
    deleteSignupGroup,
    saving,
    updateSignupGroup,
  };
};

export default useSignupGroupActions;
