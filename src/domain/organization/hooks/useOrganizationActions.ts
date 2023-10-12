import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  OrganizationFieldsFragment,
  UpdateOrganizationMutationInput,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearOrganizationQueries,
  clearOrganizationsQueries,
} from '../../app/apollo/clearCacheUtils';
import { ORGANIZATION_ACTIONS } from '../constants';
import { OrganizationFormFields } from '../types';
import {
  getOrganizationPayload,
  omitSensitiveDataFromOrganizationPayload,
} from '../utils';

export enum ORGANIZATION_MODALS {
  DELETE = 'delete',
}

interface Props {
  organization?: OrganizationFieldsFragment;
}

type UseKeywordUpdateActionsState = {
  closeModal: () => void;
  createOrganization: (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => Promise<void>;
  deleteOrganization: (callbacks?: MutationCallbacks<string>) => Promise<void>;
  openModal: ORGANIZATION_MODALS | null;
  saving: ORGANIZATION_ACTIONS | null;
  setOpenModal: (modal: ORGANIZATION_MODALS | null) => void;
  setSaving: (action: ORGANIZATION_ACTIONS | null) => void;
  updateOrganization: (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => Promise<void>;
};

const useOrganizationUpdateActions = ({
  organization,
}: Props): UseKeywordUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [openModal, setOpenModal] = useMountedState<ORGANIZATION_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<ORGANIZATION_ACTIONS | null>(
    null
  );

  const [createOrganizationMutation] = useCreateOrganizationMutation();
  const [deleteOrganizationMutation] = useDeleteOrganizationMutation();
  const [updateOrganizationMutation] = useUpdateOrganizationMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (
    id: string,
    callbacks?: MutationCallbacks<string>
  ) => {
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const { handleError } = useHandleError<
    UpdateOrganizationMutationInput,
    null
  >();

  const createOrganization = async (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => {
    setSaving(ORGANIZATION_ACTIONS.CREATE);
    const payload = getOrganizationPayload(values);

    try {
      const { data } = await createOrganizationMutation({
        variables: { input: payload },
      });

      await cleanAfterUpdate(data?.createOrganization.id as string, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create organization',
        payload: omitSensitiveDataFromOrganizationPayload(payload),
        savingFinished,
      });
    }
  };

  const deleteOrganization = async (callbacks?: MutationCallbacks<string>) => {
    try {
      const id = getValue(organization?.id, '');
      setSaving(ORGANIZATION_ACTIONS.DELETE);

      await deleteOrganizationMutation({
        variables: { id: getValue(organization?.id, '') },
      });

      await cleanAfterUpdate(id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete organization',
        savingFinished,
      });
    }
  };

  const updateOrganization = async (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks<string>
  ) => {
    const payload: UpdateOrganizationMutationInput =
      getOrganizationPayload(values);

    try {
      setSaving(ORGANIZATION_ACTIONS.UPDATE);

      await updateOrganizationMutation({ variables: { input: payload } });

      await cleanAfterUpdate(values.id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update organization',
        payload: omitSensitiveDataFromOrganizationPayload(payload),
        savingFinished,
      });
    }
  };

  return {
    closeModal,
    createOrganization,
    deleteOrganization,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updateOrganization,
  };
};

export default useOrganizationUpdateActions;
