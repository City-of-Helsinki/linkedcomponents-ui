import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoModal, {
  CommonInfoModalProps,
} from '../../../../common/components/dialog/infoModal/InfoModal';

export type ReservationTimeExpiringModalProps = {
  timeLeft: number | null;
} & CommonInfoModalProps;

const ReservationTimeExpiringModal: React.FC<
  ReservationTimeExpiringModalProps
> = ({ timeLeft, ...props }) => {
  const { t } = useTranslation();

  return (
    <InfoModal
      {...props}
      closeButtonText={t('signup.reservationTimeExpiringModal.buttonClose')}
      description={t('signup.reservationTimeExpiringModal.text', {
        count: timeLeft as number,
      })}
      heading={t('signup.reservationTimeExpiringModal.title')}
      id="reservation-time-expiring-modal"
    />
  );
};

export default ReservationTimeExpiringModal;
