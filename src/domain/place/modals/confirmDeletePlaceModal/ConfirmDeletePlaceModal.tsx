/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import { PLACE_ACTION_ICONS, PLACE_ACTIONS } from '../../constants';

export type ConfirmDeletePlaceModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeletePlaceModal: React.FC<ConfirmDeletePlaceModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={PLACE_ACTION_ICONS[PLACE_ACTIONS.DELETE]}
      deleteButtonText={t('place.deletePlaceModal.buttonDelete')}
      description={t('place.deletePlaceModal.text')}
      heading={t('place.deletePlaceModal.title')}
      id={'confirm-place-delete-modal'}
    />
  );
};

export default ConfirmDeletePlaceModal;
