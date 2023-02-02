import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateRegistrationMutationInput,
  RegistrationFieldsFragment,
  UpdateRegistrationMutationInput,
  useCreateRegistrationMutation,
  useDeleteRegistrationMutation,
  useUpdateRegistrationMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import { clearRegistrationsQueries } from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_MODALS } from '../constants';
import { RegistrationFormFields } from '../types';
import { getRegistrationFields, getRegistrationPayload } from '../utils';

interface UseRegistrationActionsProps {
  registration?: RegistrationFieldsFragment | null;
}

type UseRegistrationActionsState = {
  closeModal: () => void;
  createRegistration: (
    values: RegistrationFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteRegistration: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: REGISTRATION_MODALS | null;
  saving: REGISTRATION_ACTIONS | null;
  setOpenModal: (modal: REGISTRATION_MODALS | null) => void;
  updateRegistration: (
    values: RegistrationFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};
const useRegistrationActions = ({
  registration,
}: UseRegistrationActionsProps): UseRegistrationActionsState => {
  const locale = useLocale();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [saving, setSaving] = useMountedState<REGISTRATION_ACTIONS | null>(
    null
  );
  const [openModal, setOpenModal] = useMountedState<REGISTRATION_MODALS | null>(
    null
  );

  const [createRegistrationMutation] = useCreateRegistrationMutation();
  const [updateRegistrationMutation] = useUpdateRegistrationMutation();
  const [deleteRegistrationMutation] = useDeleteRegistrationMutation();

  const savingFinished = () => {
    setSaving(null);
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const cleanAfterUpdate = async (
    callbacks?: MutationCallbacks,
    id?: string
  ) => {
    /* istanbul ignore next */
    !isTestEnv && clearRegistrationsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
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
    payload?: CreateRegistrationMutationInput | UpdateRegistrationMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        registration,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const createRegistration = async (
    values: RegistrationFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(REGISTRATION_ACTIONS.CREATE);

    const payload = getRegistrationPayload(values);

    try {
      const { data } = await createRegistrationMutation({
        variables: { input: payload },
      });

      if (data?.createRegistration.id) {
        await cleanAfterUpdate(callbacks, data?.createRegistration.id);
      }
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create registration',
        payload,
      });
    }
  };

  const deleteRegistration = async (callbacks?: MutationCallbacks) => {
    try {
      const { id } = getRegistrationFields(
        registration as RegistrationFieldsFragment,
        locale
      );

      setSaving(REGISTRATION_ACTIONS.DELETE);
      await deleteRegistrationMutation({ variables: { id } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete registration',
      });
    }
  };

  const updateRegistration = async (
    values: RegistrationFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const { id } = getRegistrationFields(
      registration as RegistrationFieldsFragment,
      locale
    );

    let payload: UpdateRegistrationMutationInput = {
      event: values.event,
      id,
    };

    try {
      setSaving(REGISTRATION_ACTIONS.UPDATE);

      payload = {
        ...getRegistrationPayload(values),
        id,
      };

      await updateRegistrationMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update registration',
        payload,
      });
    }
  };

  return {
    closeModal,
    createRegistration,
    deleteRegistration,
    openModal,
    saving,
    setOpenModal,
    updateRegistration,
  };
};

export default useRegistrationActions;
