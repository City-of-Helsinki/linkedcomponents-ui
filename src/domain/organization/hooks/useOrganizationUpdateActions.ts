import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  OrganizationFieldsFragment,
  UpdateOrganizationMutationInput,
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
import { getOrganizationPayload } from '../utils';

export enum ORGANIZATION_MODALS {
  DELETE = 'delete',
}

interface Props {
  organization?: OrganizationFieldsFragment;
}

type UseKeywordUpdateActionsState = {
  closeModal: () => void;
  deleteOrganization: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: ORGANIZATION_MODALS | null;
  saving: ORGANIZATION_ACTIONS | null;
  setOpenModal: (modal: ORGANIZATION_MODALS | null) => void;
  setSaving: (action: ORGANIZATION_ACTIONS | null) => void;
  updateOrganization: (
    values: OrganizationFormFields,
    callbacks?: MutationCallbacks
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

  const [deleteOrganizationMutation] = useDeleteOrganizationMutation();
  const [updateOrganizationMutation] = useUpdateOrganizationMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const { handleError } = useHandleError<
    UpdateOrganizationMutationInput,
    null
  >();

  const deleteOrganization = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(ORGANIZATION_ACTIONS.DELETE);

      await deleteOrganizationMutation({
        variables: { id: getValue(organization?.id, '') },
      });

      await cleanAfterUpdate(callbacks);
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
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateOrganizationMutationInput =
      getOrganizationPayload(values);

    try {
      setSaving(ORGANIZATION_ACTIONS.UPDATE);

      await updateOrganizationMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update organization',
        payload,
        savingFinished,
      });
    }
  };

  return {
    closeModal,
    deleteOrganization,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updateOrganization,
  };
};

export default useOrganizationUpdateActions;
