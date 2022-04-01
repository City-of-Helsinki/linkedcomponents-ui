import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { useLocation } from 'react-router';

import {
  PlaceFieldsFragment,
  useDeletePlaceMutation,
} from '../../../generated/graphql';
import useMountedState from '../../../hooks/useMountedState';
import { UpdateActionsCallbacks } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import { reportError } from '../../app/sentry/utils';
import useUser from '../../user/hooks/useUser';
import { PLACE_ACTIONS } from '../constants';
import { clearPlaceQueries, clearPlacesQueries } from '../utils';

export enum PLACE_MODALS {
  DELETE = 'delete',
}

interface Props {
  place: PlaceFieldsFragment;
}

type UsePlaceUpdateActionsState = {
  closeModal: () => void;
  deletePlace: (callbacks?: UpdateActionsCallbacks) => Promise<void>;
  openModal: PLACE_MODALS | null;
  saving: PLACE_ACTIONS | null;
  setOpenModal: (modal: PLACE_MODALS | null) => void;
  setSaving: (action: PLACE_ACTIONS | null) => void;
};
const usePlaceUpdateActions = ({
  place,
}: Props): UsePlaceUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { user } = useUser();
  const location = useLocation();
  const [openModal, setOpenModal] = useMountedState<PLACE_MODALS | null>(null);
  const [saving, setSaving] = useMountedState<PLACE_ACTIONS | null>(null);

  const [deletePlaceMutation] = useDeletePlaceMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: UpdateActionsCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearPlaceQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearPlacesQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const handleError = ({
    callbacks,
    error,
    message,
  }: // payload,
  {
    callbacks?: UpdateActionsCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    // payload?: UpdateKeywordMutationInput;
  }) => {
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        // payloadAsString: payload && JSON.stringify(payload),
        place,
      },
      location,
      message,
      user,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const deletePlace = async (callbacks?: UpdateActionsCallbacks) => {
    try {
      setSaving(PLACE_ACTIONS.DELETE);

      await deletePlaceMutation({
        variables: { id: place.id as string },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete place',
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
  };
};

export default usePlaceUpdateActions;
