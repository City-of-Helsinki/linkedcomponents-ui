import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoModal, {
  CommonInfoModalProps,
} from '../../../../common/components/dialog/infoModal/InfoModal';

export type PersonsAddedToWaitingListModalProps = CommonInfoModalProps;

const PersonsAddedToWaitingListModal: React.FC<
  PersonsAddedToWaitingListModalProps
> = (props) => {
  const { t } = useTranslation();

  return (
    <InfoModal
      {...props}
      closeButtonText={t(
        'enrolment.personsAddedToWaitingListModal.buttonClose'
      )}
      description={t('enrolment.personsAddedToWaitingListModal.text')}
      heading={t('enrolment.personsAddedToWaitingListModal.title')}
      id="persons-added-to-waiting-list-modal"
    />
  );
};

export default PersonsAddedToWaitingListModal;
