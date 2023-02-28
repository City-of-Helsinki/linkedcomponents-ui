/* eslint-disable max-len */
import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';

export type ConfirmDeleteRegistrationModalProps = CommonConfirmDeleteModalProps;

const ConfirmDeleteRegistrationModal: React.FC<
  ConfirmDeleteRegistrationModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      deleteButtonIcon={<IconCross aria-hidden />}
      deleteButtonText={t('registration.deleteRegistrationModal.buttonDelete')}
      description={t('registration.deleteRegistrationModal.text')}
      heading={t('registration.deleteRegistrationModal.title')}
      id={'confirm-registration-delete-modal'}
    />
  );
};

export default ConfirmDeleteRegistrationModal;
