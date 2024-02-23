import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  PriceGroupFieldsFragment,
  useDeletePriceGroupMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearPriceGroupQueries,
  clearPriceGroupsQueries,
} from '../../app/apollo/clearCacheUtils';
import { PRICE_GROUP_ACTIONS } from '../constants';

export enum PRICE_GROUP_MODALS {
  DELETE = 'delete',
}

interface Props {
  priceGroup: PriceGroupFieldsFragment;
}

type UsePriceGroupActionsState = {
  closeModal: () => void;
  deletePriceGroup: (callbacks?: MutationCallbacks<number>) => Promise<void>;
  openModal: PRICE_GROUP_MODALS | null;
  saving: PRICE_GROUP_ACTIONS | null;
  setOpenModal: (modal: PRICE_GROUP_MODALS | null) => void;
  setSaving: (action: PRICE_GROUP_ACTIONS | null) => void;
};
const usePriceGroupActions = ({
  priceGroup,
}: Props): UsePriceGroupActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [openModal, setOpenModal] = useMountedState<PRICE_GROUP_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<PRICE_GROUP_ACTIONS | null>(null);

  const [deletePriceGroupMutation] = useDeletePriceGroupMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (
    id: number,
    callbacks?: MutationCallbacks<number>
  ) => {
    /* istanbul ignore next */
    !isTestEnv && clearPriceGroupQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearPriceGroupsQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess(id));
  };

  const { handleError } = useHandleError<never, never, number>();

  const deletePriceGroup = async (callbacks?: MutationCallbacks<number>) => {
    try {
      const id = priceGroup.id;
      setSaving(PRICE_GROUP_ACTIONS.DELETE);

      await deletePriceGroupMutation({ variables: { id } });

      await cleanAfterUpdate(id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete place',
        savingFinished,
      });
    }
  };

  return {
    closeModal,
    deletePriceGroup,
    openModal,
    saving,
    setOpenModal,
    setSaving,
  };
};

export default usePriceGroupActions;
