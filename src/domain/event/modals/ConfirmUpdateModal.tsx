import { IconPen, LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Modal from '../../../common/components/modal/Modal';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';
import styles from './modals.module.scss';

export interface ConfirmUpdateModalProps {
  event: EventFieldsFragment;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ConfirmUpdateModal: React.FC<ConfirmUpdateModalProps> = ({
  event,
  isOpen,
  isSaving,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={true}
      size="m"
      title={t('event.updateEventModal.title')}
      type="info"
    >
      <p>{t('event.updateEventModal.text1')}</p>
      <p>{t('event.updateEventModal.text2')}</p>
      <EventHierarchy event={event} />
      <div className={styles.modalButtonWrapper}>
        <Button
          iconLeft={
            isSaving ? (
              <LoadingSpinner className={styles.loadingSpinner} small={true} />
            ) : (
              <IconPen />
            )
          }
          onClick={handleSave}
          type="button"
        >
          {t('common.save')}
        </Button>
        <Button onClick={handleClose} variant="secondary" type="button">
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmUpdateModal;
