import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import omit from 'lodash/omit';

import {
  CreateKeywordSetMutationInput,
  KeywordSetFieldsFragment,
  UpdateKeywordSetMutationInput,
  useCreateKeywordSetMutation,
  useDeleteKeywordSetMutation,
  useUpdateKeywordSetMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearKeywordSetQueries,
  clearKeywordSetsQueries,
} from '../../app/apollo/clearCacheUtils';
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

  const { handleError } = useHandleError<
    CreateKeywordSetMutationInput | UpdateKeywordSetMutationInput,
    null
  >();

  const createKeywordSet = async (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(KEYWORD_SET_ACTIONS.CREATE);
    const payload = getKeywordSetPayload(values);

    try {
      const { data } = await createKeywordSetMutation({
        variables: { input: payload },
      });

      /* istanbul ignore else */
      if (data?.createKeywordSet.id) {
        cleanAfterUpdate(callbacks);
      }
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create keyword set',
        payload,
        savingFinished,
      });
    }
  };

  const deleteKeywordSet = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(KEYWORD_SET_ACTIONS.DELETE);

      await deleteKeywordSetMutation({
        variables: { id: getValue(keywordSet?.id, '') },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete keyword set',
        savingFinished,
      });
    }
  };

  const updateKeywordSet = async (
    values: KeywordSetFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateKeywordSetMutationInput = omit(
      getKeywordSetPayload(values),
      'id'
    );

    try {
      setSaving(KEYWORD_SET_ACTIONS.UPDATE);

      await updateKeywordSetMutation({
        variables: { id: values.id, input: payload },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update keyword set',
        payload,
        savingFinished,
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
