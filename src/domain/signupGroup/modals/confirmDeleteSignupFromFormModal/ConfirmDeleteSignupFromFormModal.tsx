import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';

export type ConfirmDeleteSignupFromFormModalProps = {
  participantCount: number;
} & CommonConfirmModalProps;

const ConfirmDeleteSignupFromFormModal: React.FC<
  ConfirmDeleteSignupFromFormModalProps
> = ({ participantCount, ...props }) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={<p>{t('signup.deleteSignupFromFormModal.text2')}</p>}
      confirmButtonIcon={<IconCross aria-hidden={true} />}
      confirmButtonText={t('signup.deleteSignupFromFormModal.buttonDelete', {
        count: participantCount,
      })}
      description={t('signup.deleteSignupFromFormModal.text1', {
        count: participantCount,
      })}
      heading={t('signup.deleteSignupFromFormModal.title', {
        count: participantCount,
      })}
      id="confirm-participant-delete-modal"
      variant="danger"
    />
  );
};

export default ConfirmDeleteSignupFromFormModal;
