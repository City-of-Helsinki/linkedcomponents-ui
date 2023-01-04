import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateKeywordSetMutationInput,
  KeywordSetFieldsFragment,
  UpdateKeywordSetMutationInput,
  useCreateKeywordSetMutation,
  useDeleteKeywordSetMutation,
  useUpdateKeywordSetMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearKeywordSetQueries,
  clearKeywordSetsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import useUserOrganization from '../../user/hooks/useUserOrganization';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { KeywordSetFormFields } from '../types';
import { getKeywordSetPayload } from '../utils';

export enum KEYWORD_SET_MODALS {
  DELETE = 'delete',
}

interface UseKeywordActionsProps {
  keywordSet?: KeywordSetFieldsFragment;
}

type UseKeywordActionsState = {
  closeModal: () => void;
  createKeywordSet: (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteKeywordSet: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: KEYWORD_SET_MODALS | null;
  saving: KEYWORD_SET_ACTIONS | null;
  setOpenModal: (modal: KEYWORD_SET_MODALS | null) => void;
  updateKeywordSet: (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};

const useKeywordSetActions = ({
  keywordSet,
}: UseKeywordActionsProps): UseKeywordActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const { organization: userOrganization } = useUserOrganization(user);
  const location = useLocation();
  const [openModal, setOpenModal] = useMountedState<KEYWORD_SET_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<KEYWORD_SET_ACTIONS | null>(null);

  const [createKeywordSetMutation] = useCreateKeywordSetMutation();
  const [deleteKeywordSetMutation] = useDeleteKeywordSetMutation();
  const [updateKeywordSetMutation] = useUpdateKeywordSetMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearKeywordSetQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearKeywordSetsQueries(apolloClient);

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
    payload?: CreateKeywordSetMutationInput | UpdateKeywordSetMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        keywordSet,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const createKeywordSet = async (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(KEYWORD_SET_ACTIONS.CREATE);
    const payload = getKeywordSetPayload(values, userOrganization);

    try {
      const { data } = await createKeywordSetMutation({
        variables: { input: payload },
      });

      if (data?.createKeywordSet.id) {
        cleanAfterUpdate(callbacks);
      }
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create keyword set',
        payload,
      });
    }
  };

  const deleteKeywordSet = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(KEYWORD_SET_ACTIONS.DELETE);

      await deleteKeywordSetMutation({
        variables: { id: keywordSet?.id as string },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete keyword set',
      });
    }
  };

  const updateKeywordSet = async (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateKeywordSetMutationInput = getKeywordSetPayload(
      values,
      userOrganization
    );

    try {
      setSaving(KEYWORD_SET_ACTIONS.UPDATE);

      await updateKeywordSetMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update keyword set',
        payload,
      });
    }
  };

  return {
    closeModal,
    createKeywordSet,
    deleteKeywordSet,
    openModal,
    saving,
    setOpenModal,
    updateKeywordSet,
  };
};

export default useKeywordSetActions;
