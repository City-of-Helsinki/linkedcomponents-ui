import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { IMAGE_ACTION_ICONS, IMAGE_ACTIONS } from '../../constants';

export type ConfirmDeleteImageModalProps = CommonConfirmModalProps;

const ConfirmDeleteImageModal: React.FC<ConfirmDeleteImageModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={IMAGE_ACTION_ICONS[IMAGE_ACTIONS.DELETE]}
      confirmButtonText={t('image.deleteImageModal.buttonDelete')}
      description={t('image.deleteImageModal.text')}
      heading={t('image.deleteImageModal.title')}
      id={'confirm-image-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeleteImageModal;
