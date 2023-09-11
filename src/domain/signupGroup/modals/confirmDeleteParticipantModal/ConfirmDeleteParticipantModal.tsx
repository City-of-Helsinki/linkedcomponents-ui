import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';

export type ConfirmDeleteParticipantModalProps = {
  participantCount: number;
} & CommonConfirmModalProps;

const ConfirmDeleteParticipantModal: React.FC<
  ConfirmDeleteParticipantModalProps
> = ({ participantCount, ...props }) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={<p>{t('signup.deleteParticipantModal.text2')}</p>}
      confirmButtonIcon={<IconCross aria-hidden={true} />}
      confirmButtonText={t('signup.deleteParticipantModal.buttonDelete', {
        count: participantCount,
      })}
      description={t('signup.deleteParticipantModal.text1', {
        count: participantCount,
      })}
      heading={t('signup.deleteParticipantModal.title', {
        count: participantCount,
      })}
      id="confirm-participant-delete-modal"
      variant="danger"
    />
  );
};

export default ConfirmDeleteParticipantModal;
