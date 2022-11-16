import { Dialog, IconInfoCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';

export interface ReservationTimeExpiredModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
}

const ReservationTimeExpiredModal: React.FC<
  ReservationTimeExpiredModalProps
> = ({ isOpen, onTryAgain }) => {
  const { t } = useTranslation();

  const handleTryAgain = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onTryAgain();
  };

  const id = 'reservation-time-expired-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('enrolment.reservationTimeExpiredModal.title')}
      />
      <Dialog.Content>
        <p id={descriptionId}>
          {t('enrolment.reservationTimeExpiredModal.text')}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={handleTryAgain} type="button" variant="primary">
          {t('enrolment.reservationTimeExpiredModal.buttonTryAgain')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ReservationTimeExpiredModal;
