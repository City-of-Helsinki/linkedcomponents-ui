/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import {
  ORGANIZATION_ACTION_ICONS,
  ORGANIZATION_ACTIONS,
} from '../../constants';

export type ConfirmDeleteOrganizationModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeleteOrganizationModal: React.FC<
  ConfirmDeleteOrganizationModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={ORGANIZATION_ACTION_ICONS[ORGANIZATION_ACTIONS.DELETE]}
      deleteButtonText={t('organization.deleteOrganizationModal.buttonDelete')}
      description={t('organization.deleteOrganizationModal.text')}
      heading={t('organization.deleteOrganizationModal.title')}
      id={'confirm-organization-delete-modal'}
    />
  );
};

export default ConfirmDeleteOrganizationModal;
