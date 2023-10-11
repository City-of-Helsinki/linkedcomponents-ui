import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';

import {
  PlaceFieldsFragment,
  UpdatePlaceMutationInput,
  useDeletePlaceMutation,
  useUpdatePlaceMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearPlaceQueries,
  clearPlacesQueries,
} from '../../app/apollo/clearCacheUtils';
import { PLACE_ACTIONS } from '../constants';
import { PlaceFormFields } from '../types';
import { getPlacePayload } from '../utils';

export enum PLACE_MODALS {
  DELETE = 'delete',
}

interface Props {
  place: PlaceFieldsFragment;
}

type UsePlaceUpdateActionsState = {
  closeModal: () => void;
  deletePlace: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: PLACE_MODALS | null;
  saving: PLACE_ACTIONS | null;
  setOpenModal: (modal: PLACE_MODALS | null) => void;
  setSaving: (action: PLACE_ACTIONS | null) => void;
  updatePlace: (
    values: PlaceFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
};
const usePlaceUpdateActions = ({
  place,
}: Props): UsePlaceUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [openModal, setOpenModal] = useMountedState<PLACE_MODALS | null>(null);
  const [saving, setSaving] = useMountedState<PLACE_ACTIONS | null>(null);

  const [deletePlaceMutation] = useDeletePlaceMutation();
  const [updatePlaceMutation] = useUpdatePlaceMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearPlaceQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearPlacesQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const { handleError } = useHandleError();

  const deletePlace = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(PLACE_ACTIONS.DELETE);

      await deletePlaceMutation({
        variables: { id: getValue(place.id, '') },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete place',
        savingFinished,
      });
    }
  };

  const updatePlace = async (
    values: PlaceFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdatePlaceMutationInput = getPlacePayload(values);

    try {
      setSaving(PLACE_ACTIONS.UPDATE);

      await updatePlaceMutation({ variables: { input: payload } });

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
    deletePlace,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updatePlace,
  };
};

export default usePlaceUpdateActions;
