/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { PLACE_ACTION_ICONS, PLACE_ACTIONS } from '../../constants';

export type ConfirmDeletePlaceModalProps = CommonConfirmModalProps;

const ConfirmDeletePlaceModal: React.FC<ConfirmDeletePlaceModalProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={PLACE_ACTION_ICONS[PLACE_ACTIONS.DELETE]}
      confirmButtonText={t('place.deletePlaceModal.buttonDelete')}
      description={t('place.deletePlaceModal.text')}
      heading={t('place.deletePlaceModal.title')}
      id={'confirm-place-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeletePlaceModal;
