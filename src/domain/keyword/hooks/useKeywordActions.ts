import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import omit from 'lodash/omit';

import {
  CreateKeywordMutationInput,
  KeywordFieldsFragment,
  useCreateKeywordMutation,
  useDeleteKeywordMutation,
  useUpdateKeywordMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearKeywordQueries,
  clearKeywordsQueries,
} from '../../app/apollo/clearCacheUtils';
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

  const { handleError } = useHandleError<CreateKeywordMutationInput, null>();

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
        savingFinished,
      });
    }
  };

  const deleteKeyword = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(KEYWORD_ACTIONS.DELETE);

      await deleteKeywordMutation({
        variables: { id: getValue(keyword?.id, '') },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete keyword',
        savingFinished,
      });
    }
  };

  const updateKeyword = async (
    values: KeywordFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload = omit(getKeywordPayload(values), 'id');

    try {
      setSaving(KEYWORD_ACTIONS.UPDATE);

      await updateKeywordMutation({
        variables: { id: values.id, input: payload },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update keyword',
        payload,
        savingFinished,
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
