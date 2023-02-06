import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  CreateKeywordMutationInput,
  KeywordFieldsFragment,
  UpdateKeywordMutationInput,
  useCreateKeywordMutation,
  useDeleteKeywordMutation,
  useUpdateKeywordMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearKeywordQueries,
  clearKeywordsQueries,
} from '../../app/apollo/clearCacheUtils';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_ACTIONS } from '../constants';
import { KeywordFormFields } from '../types';
import { getKeywordPayload } from '../utils';

export enum KEYWORD_MODALS {
  DELETE = 'delete',
}

interface UseKeywordActionsProps {
  keyword?: KeywordFieldsFragment;
}

type UseKeywordActionsState = {
  closeModal: () => void;
  createKeyword: (
    values: KeywordFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteKeyword: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: KEYWORD_MODALS | null;
  saving: KEYWORD_ACTIONS | null;
  setOpenModal: (modal: KEYWORD_MODALS | null) => void;
  updateKeyword: (
    values: KeywordFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};
const useKeywordActions = ({
  keyword,
}: UseKeywordActionsProps): UseKeywordActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [openModal, setOpenModal] = useMountedState<KEYWORD_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<KEYWORD_ACTIONS | null>(null);

  const [createKeywordMutation] = useCreateKeywordMutation();
  const [deleteKeywordMutation] = useDeleteKeywordMutation();
  const [updateKeywordMutation] = useUpdateKeywordMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearKeywordQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearKeywordsQueries(apolloClient);

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
    payload?: CreateKeywordMutationInput | UpdateKeywordMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        keyword,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const createKeyword = async (
    values: KeywordFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(KEYWORD_ACTIONS.CREATE);
    const payload = getKeywordPayload(values);

    try {
      const { data } = await createKeywordMutation({
        variables: { input: payload },
      });

      /* istanbul ignore else */
      if (data?.createKeyword.id) {
        await cleanAfterUpdate(callbacks);
      }
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create keyword',
        payload,
      });
    }
    setSaving(KEYWORD_ACTIONS.CREATE);
  };

  const deleteKeyword = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(KEYWORD_ACTIONS.DELETE);

      await deleteKeywordMutation({
        variables: { id: keyword?.id as string },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete keyword',
      });
    }
  };

  const updateKeyword = async (
    values: KeywordFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload = getKeywordPayload(values);

    try {
      setSaving(KEYWORD_ACTIONS.UPDATE);

      await updateKeywordMutation({ variables: { input: payload } });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update keyword',
        payload,
      });
    }
  };

  return {
    closeModal,
    createKeyword,
    deleteKeyword,
    openModal,
    saving,
    setOpenModal,
    updateKeyword,
  };
};

export default useKeywordActions;
