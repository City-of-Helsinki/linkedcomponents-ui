import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  OrganizationFieldsFragment,
  UpdateOrganizationMutationInput,
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { UpdateActionsCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearOrganizationQueries,
  clearOrganizationsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
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
  deleteOrganization: (callbacks?: UpdateActionsCallbacks) => Promise<void>;
  openModal: ORGANIZATION_MODALS | null;
  saving: ORGANIZATION_ACTIONS | null;
  setOpenModal: (modal: ORGANIZATION_MODALS | null) => void;
  setSaving: (action: ORGANIZATION_ACTIONS | null) => void;
  updateOrganization: (
    values: OrganizationFormFields,
    callbacks?: UpdateActionsCallbacks
  ) => Promise<void>;
};

const useOrganizationUpdateActions = ({
  organization,
}: Props): UseKeywordUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
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

  const cleanAfterUpdate = async (callbacks?: UpdateActionsCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearOrganizationsQueries(apolloClient);

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
    payload?: UpdateOrganizationMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        organization,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const deleteOrganization = async (callbacks?: UpdateActionsCallbacks) => {
    try {
      setSaving(ORGANIZATION_ACTIONS.DELETE);

      await deleteOrganizationMutation({
        variables: { id: organization?.id as string },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete organization',
      });
    }
  };

  const updateOrganization = async (
    values: OrganizationFormFields,
    callbacks?: UpdateActionsCallbacks
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
