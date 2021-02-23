import { IconCross, LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Modal from '../../../common/components/modal/Modal';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';
import styles from './modals.module.scss';

export interface ConfirmDeleteModalProps {
  event: EventFieldsFragment;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  event,
  isOpen,
  isSaving,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onDelete();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={true}
      size="m"
      title={t('event.deleteEventModal.title')}
      type="alert"
    >
      <p className={styles.warning}>
        <strong>{t('common.warning')}</strong>
      </p>
      <p>{t('event.deleteEventModal.text1')} </p>
      <p style={{ marginTop: 0 }}>{t('event.deleteEventModal.text2')}</p>
      <p>{t('event.deleteEventModal.text3')}</p>
      <EventHierarchy event={event} />
      <div className={styles.modalButtonWrapper}>
        <Button
          iconLeft={
            isSaving ? (
              <LoadingSpinner className={styles.loadingSpinner} small={true} />
            ) : (
              <IconCross />
            )
          }
          onClick={handleDelete}
          type="button"
          variant="danger"
        >
          {t('event.deleteEventModal.buttonDelete')}
        </Button>
        <Button
          onClick={handleClose}
          theme="black"
          type="button"
          variant="secondary"
        >
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
