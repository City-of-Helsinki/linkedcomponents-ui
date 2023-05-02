/* eslint-disable max-len */
import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';

export type ConfirmDeleteRegistrationModalProps = CommonConfirmModalProps;

const ConfirmDeleteRegistrationModal: React.FC<
  ConfirmDeleteRegistrationModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      confirmButtonIcon={<IconCross aria-hidden />}
      confirmButtonText={t('registration.deleteRegistrationModal.buttonDelete')}
      description={t('registration.deleteRegistrationModal.text')}
      heading={t('registration.deleteRegistrationModal.title')}
      id={'confirm-registration-delete-modal'}
      variant="danger"
    />
  );
};

export default ConfirmDeleteRegistrationModal;
