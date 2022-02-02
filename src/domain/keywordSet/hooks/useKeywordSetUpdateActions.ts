import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  KeywordSetFieldsFragment,
  UpdateKeywordSetMutationInput,
  useUpdateKeywordSetMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import {
  clearKeywordSetQueries,
  clearKeywordSetsQueries,
} from '../../keywordSets/utils';
import useUser from '../../user/hooks/useUser';
import { KEYWORD_SET_ACTIONS } from '../constants';
import { KeywordSetFormFields } from '../types';
import { getKeywordSetPayload } from '../utils';

export enum KEYWORD_SET_MODALS {
  DELETE = 'delete',
}

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

interface Props {
  keywordSet?: KeywordSetFieldsFragment;
}

type UseKeywordUpdateActionsState = {
  closeModal: () => void;
  openModal: KEYWORD_SET_MODALS | null;
  saving: KEYWORD_SET_ACTIONS | null;
  setOpenModal: (modal: KEYWORD_SET_MODALS | null) => void;
  setSaving: (action: KEYWORD_SET_ACTIONS | null) => void;
  updateKeywordSet: (
    values: KeywordSetFormFields,
    callbacks?: Callbacks
  ) => Promise<void>;
};

const useKeywordSetUpdateActions = ({
  keywordSet,
}: Props): UseKeywordUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [openModal, setOpenModal] = useMountedState<KEYWORD_SET_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<KEYWORD_SET_ACTIONS | null>(null);

  const [updateKeywordSetMutation] = useUpdateKeywordSetMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: Callbacks) => {
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
        keywordSet,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const updateKeywordSet = async (
    values: KeywordSetFormFields,
    callbacks?: Callbacks
  ) => {
    const payload: UpdateKeywordSetMutationInput = getKeywordSetPayload(values);

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
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updateKeywordSet,
  };
};

export default useKeywordSetUpdateActions;
