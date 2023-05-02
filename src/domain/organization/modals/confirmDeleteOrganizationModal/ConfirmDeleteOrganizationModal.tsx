/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import {
  ORGANIZATION_ACTION_ICONS,
  ORGANIZATION_ACTIONS,
} from '../../constants';

export type ConfirmDeleteOrganizationModalProps = CommonConfirmModalProps;

const ConfirmDeleteOrganizationModal: React.FC<
  ConfirmDeleteOrganizationModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={ORGANIZATION_ACTION_ICONS[ORGANIZATION_ACTIONS.DELETE]}
      confirmButtonText={t('organization.deleteOrganizationModal.buttonDelete')}
      description={t('organization.deleteOrganizationModal.text')}
      heading={t('organization.deleteOrganizationModal.title')}
      id={'confirm-organization-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeleteOrganizationModal;
