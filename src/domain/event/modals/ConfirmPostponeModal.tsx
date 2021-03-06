import { IconCalendarClock, LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Modal from '../../../common/components/modal/Modal';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';
import styles from './modals.module.scss';

export interface ConfirmPostponeModalProps {
  event: EventFieldsFragment;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onPostpone: () => void;
}

const ConfirmPostponeModal: React.FC<ConfirmPostponeModalProps> = ({
  event,
  isOpen,
  isSaving,
  onClose,
  onPostpone,
}) => {
  const { t } = useTranslation();

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClose();
  };

  const handlePostpone = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onPostpone();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={true}
      size="m"
      title={t('event.postponeEventModal.title')}
      type="info"
    >
      <p className={styles.warning}>
        <strong>{t('common.warning')}</strong>
      </p>
      <p>{t('event.postponeEventModal.text1')}</p>
      <p>{t('event.postponeEventModal.text2')}</p>
      <EventHierarchy event={event} />
      <div className={styles.modalButtonWrapper}>
        <Button
          iconLeft={
            isSaving ? (
              <LoadingSpinner className={styles.loadingSpinner} small={true} />
            ) : (
              <IconCalendarClock />
            )
          }
          onClick={handlePostpone}
          type="button"
        >
          {t('event.postponeEventModal.buttonPostpone')}
        </Button>
        <Button onClick={handleClose} variant="secondary" type="button">
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmPostponeModal;
