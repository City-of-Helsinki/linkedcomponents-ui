import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import omit from 'lodash/omit';

import {
  ImageFieldsFragment,
  UpdateImageMutationInput,
  useDeleteImageMutation,
  useUpdateImageMutation,
  useUploadImageMutation,
} from '../../../generated/graphql';
import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { MutationCallbacks } from '../../../types';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import {
  clearImageQueries,
  clearImagesQueries,
} from '../../app/apollo/clearCacheUtils';
import { IMAGE_ACTIONS } from '../constants';
import { ImageFormFields } from '../types';
import { getImagePayload } from '../utils';

export enum IMAGE_MODALS {
  ADD_IMAGE = 'addImage',
  DELETE = 'delete',
}

interface Props {
  image?: ImageFieldsFragment;
}

interface UploadImageValues {
  image?: File;
  publisher: string;
  url?: string;
}

type UseImageUpdateActionsState = {
  closeModal: () => void;
  deleteImage: (callbacks?: MutationCallbacks) => Promise<void>;
  openModal: IMAGE_MODALS | null;
  saving: IMAGE_ACTIONS | null;
  setOpenModal: (modal: IMAGE_MODALS | null) => void;
  setSaving: (action: IMAGE_ACTIONS | null) => void;
  updateImage: (
    values: ImageFormFields,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  uploadImage: (
    { image, publisher, url }: UploadImageValues,
    setValues: (image: ImageFieldsFragment) => void
  ) => Promise<void>;
};
const useImageUpdateActions = ({
  image,
}: Props): UseImageUpdateActionsState => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [openModal, setOpenModal] = useMountedState<IMAGE_MODALS | null>(null);
  const [saving, setSaving] = useMountedState<IMAGE_ACTIONS | null>(null);

  const [deleteImageMutation] = useDeleteImageMutation();
  const [updateImageMutation] = useUpdateImageMutation();
  const [uploadImageMutation] = useUploadImageMutation();

  const closeModal = () => {
    setOpenModal(null);
  };

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    /* istanbul ignore next */
    !isTestEnv && clearImageQueries(apolloClient);
    /* istanbul ignore next */
    !isTestEnv && clearImagesQueries(apolloClient);

    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const { handleError } = useHandleError<UpdateImageMutationInput, null>();

  const deleteImage = async (callbacks?: MutationCallbacks) => {
    try {
      setSaving(IMAGE_ACTIONS.DELETE);

      await deleteImageMutation({
        variables: { id: getValue(image?.id, '') },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to delete image',
        savingFinished,
      });
    }
  };

  const updateImage = async (
    values: ImageFormFields,
    callbacks?: MutationCallbacks
  ) => {
    const payload: UpdateImageMutationInput = omit(
      getImagePayload(values),
      'id'
    );

    try {
      setSaving(IMAGE_ACTIONS.UPDATE);

      await updateImageMutation({
        variables: { id: values.id, input: payload },
      });

      await cleanAfterUpdate(callbacks);
    } catch (error) /* istanbul ignore next */ {
      handleError({
        callbacks,
        error,
        message: 'Failed to update image',
        payload,
        savingFinished,
      });
    }
  };

  const uploadImage = async (
    { image, publisher, url }: UploadImageValues,
    setValues: (image: ImageFieldsFragment) => void
  ) => {
    try {
      const data = await uploadImageMutation({
        variables: { input: { image, name: '', publisher, url } },
      });
      cleanAfterUpdate();

      setValues(data.data?.uploadImage as ImageFieldsFragment);
      closeModal();
    } catch (error) /* istanbul ignore next */ {
      handleError({
        error,
        message: 'Failed to upload image',
        savingFinished,
      });
    }
  };

  return {
    closeModal,
    deleteImage,
    openModal,
    saving,
    setOpenModal,
    setSaving,
    updateImage,
    uploadImage,
  };
};

export default useImageUpdateActions;
