import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import { IMAGE_ACTION_ICONS, IMAGE_ACTIONS } from '../../constants';

export type ConfirmDeleteImageModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeleteImageModal: React.FC<ConfirmDeleteImageModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={IMAGE_ACTION_ICONS[IMAGE_ACTIONS.DELETE]}
      deleteButtonText={t('image.deleteImageModal.buttonDelete')}
      description={t('image.deleteImageModal.text')}
      heading={t('image.deleteImageModal.title')}
      id={'confirm-image-delete-modal'}
    />
  );
};

export default ConfirmDeleteImageModal;
