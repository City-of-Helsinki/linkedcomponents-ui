import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoModal, {
  CommonInfoModalProps,
} from '../../../../common/components/dialog/infoModal/InfoModal';

export type ReservationTimeExpiredModalProps = CommonInfoModalProps;

const ReservationTimeExpiredModal: React.FC<
  ReservationTimeExpiredModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <InfoModal
      {...props}
      closeButtonText={t(
        'enrolment.reservationTimeExpiredModal.buttonTryAgain'
      )}
      description={t('enrolment.reservationTimeExpiredModal.text')}
      heading={t('enrolment.reservationTimeExpiredModal.title')}
      id="reservation-time-expired-modal"
    />
  );
};

export default ReservationTimeExpiredModal;
