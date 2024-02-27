import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  PriceGroupFieldsFragment,
  UpdatePriceGroupMutationInput,
  useCreatePriceGroupMutation,
  useDeletePriceGroupMutation,
  useUpdatePriceGroupMutation,
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
import { PriceGroupFormFields } from '../types';
import { getPriceGroupPayload } from '../utils';

export enum PRICE_GROUP_MODALS {
  DELETE = 'delete',
}

interface Props {
  priceGroup?: PriceGroupFieldsFragment;
}

type UsePriceGroupActionsState = {
  closeModal: () => void;
  createPriceGroup: (
    values: PriceGroupFormFields,
    callbacks?: MutationCallbacks<number>
  ) => Promise<void>;
  deletePriceGroup: (callbacks?: MutationCallbacks<number>) => Promise<void>;
  openModal: PRICE_GROUP_MODALS | null;
  saving: PRICE_GROUP_ACTIONS | null;
  setOpenModal: (modal: PRICE_GROUP_MODALS | null) => void;
  setSaving: (action: PRICE_GROUP_ACTIONS | null) => void;
  updatePriceGroup: (
    values: PriceGroupFormFields,
    callbacks?: MutationCallbacks<number>
  ) => Promise<void>;
};
const usePriceGroupActions = ({
  priceGroup,
}: Props): UsePriceGroupActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [openModal, setOpenModal] = useMountedState<PRICE_GROUP_MODALS | null>(
    null
  );
  const [saving, setSaving] = useMountedState<PRICE_GROUP_ACTIONS | null>(null);

  const [createPriceGroupMutation] = useCreatePriceGroupMutation();
  const [deletePriceGroupMutation] = useDeletePriceGroupMutation();
  const [updatePriceGroupMutation] = useUpdatePriceGroupMutation();

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

  const { handleError } = useHandleError<
    UpdatePriceGroupMutationInput,
    never,
    number
  >();

  const createPriceGroup = async (
    values: PriceGroupFormFields,
    callbacks?: MutationCallbacks<number>
  ) => {
    setSaving(PRICE_GROUP_ACTIONS.CREATE);
    const payload = getPriceGroupPayload(values);

    try {
      const { data } = await createPriceGroupMutation({
        variables: { input: payload },
      });

      await cleanAfterUpdate(data?.createPriceGroup.id as number, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to create price group',
        payload,
        savingFinished,
      });
    }
  };

  const deletePriceGroup = async (callbacks?: MutationCallbacks<number>) => {
    try {
      const id = priceGroup?.id as number;
      setSaving(PRICE_GROUP_ACTIONS.DELETE);

      await deletePriceGroupMutation({ variables: { id } });

      await cleanAfterUpdate(id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete price group',
        savingFinished,
      });
    }
  };

  const updatePriceGroup = async (
    values: PriceGroupFormFields,
    callbacks?: MutationCallbacks<number>
  ) => {
    const id = priceGroup?.id as number;
    const payload: UpdatePriceGroupMutationInput = getPriceGroupPayload(values);

    try {
      setSaving(PRICE_GROUP_ACTIONS.UPDATE);

      await updatePriceGroupMutation({ variables: { input: payload } });

      await cleanAfterUpdate(id, callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update price group',
        payload,
        savingFinished,
      });
    }
  };

  return {
    closeModal,
    createPriceGroup,
    deletePriceGroup,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updatePriceGroup,
  };
};

export default usePriceGroupActions;
