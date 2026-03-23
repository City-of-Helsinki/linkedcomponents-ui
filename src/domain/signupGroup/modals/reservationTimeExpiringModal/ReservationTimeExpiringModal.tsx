import React, { useMemo } from 'react';
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

  const reReadDescription = useMemo(
    () =>
      timeLeft !== null &&
      timeLeft > 0 &&
      timeLeft <= 40 &&
      timeLeft % 10 === 0,
    [timeLeft]
  );

  return (
    <InfoModal
      {...props}
      closeButtonText={t('signup.reservationTimeExpiringModal.buttonClose')}
      description={t('signup.reservationTimeExpiringModal.text', {
        count: timeLeft as number,
      })}
      reReadDescription={reReadDescription}
      heading={t('signup.reservationTimeExpiringModal.title')}
      id="reservation-time-expiring-modal"
    />
  );
};

export default ReservationTimeExpiringModal;
