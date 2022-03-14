import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  OrganizationFieldsFragment,
  UpdateKeywordSetMutationInput,
  useDeleteOrganizationMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { ORGANIZATION_ACTIONS } from '../constants';
import { clearOrganizationQueries, clearOrganizationsQueries } from '../utils';

export enum ORGANIZATION_MODALS {
  DELETE = 'delete',
}

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface Props {
  organization?: OrganizationFieldsFragment;
}

type UseKeywordUpdateActionsState = {
  closeModal: () => void;
  deleteOrganization: (callbacks?: Callbacks) => Promise<void>;
  openModal: ORGANIZATION_MODALS | null;
  saving: ORGANIZATION_ACTIONS | null;
  setOpenModal: (modal: ORGANIZATION_MODALS | null) => void;
  setSaving: (action: ORGANIZATION_ACTIONS | null) => void;
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

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: Callbacks) => {
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
    callbacks?: Callbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: UpdateKeywordSetMutationInput;
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

  const deleteOrganization = async (callbacks?: Callbacks) => {
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

  return {
    closeModal,
    deleteOrganization,
    openModal,
    saving,
    setOpenModal,
    setSaving,
  };
};

export default useOrganizationUpdateActions;
