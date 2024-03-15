/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { PRICE_GROUP_ACTION_ICONS, PRICE_GROUP_ACTIONS } from '../../constants';

export type ConfirmDeletePriceGroupModalProps = CommonConfirmModalProps;

const ConfirmDeletePriceGroupModal: React.FC<
  ConfirmDeletePriceGroupModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={PRICE_GROUP_ACTION_ICONS[PRICE_GROUP_ACTIONS.DELETE]}
      confirmButtonText={t('priceGroup.deletePriceGroupModal.buttonDelete')}
      description={t('priceGroup.deletePriceGroupModal.text')}
      heading={t('priceGroup.deletePriceGroupModal.title')}
      id={'confirm-price-group-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeletePriceGroupModal;
