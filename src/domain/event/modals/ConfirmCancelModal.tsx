import { IconCalendarCross, LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Modal from '../../../common/components/modal/Modal';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';
import styles from './modals.module.scss';

export interface ConfirmCancelModalProps {
  event: EventFieldsFragment;
  isOpen: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onClose: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  event,
  isOpen,
  isSaving,
  onCancel,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onCancel();
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={true}
      size="m"
      title={t('event.cancelEventModal.title')}
      type="alert"
    >
      <p>
        <strong>{t('event.cancelEventModal.warning')}</strong>
      </p>
      <p className={styles.warning}>
        <strong>{t('common.warning')}</strong>
      </p>
      <p>{t('event.cancelEventModal.text1')}</p>
      <p>{t('event.cancelEventModal.text2')}</p>
      <EventHierarchy event={event} />
      {Boolean(event.superEventType) && (
        <p>
          <strong>
            {t('event.cancelEventModal.titlePastEventAreNotUpdated')}
          </strong>
          <br />
          {t('event.cancelEventModal.textPastEventAreNotUpdated')}
        </p>
      )}

      <div className={styles.modalButtonWrapper}>
        <Button
          iconLeft={
            isSaving ? (
              <LoadingSpinner className={styles.loadingSpinner} small={true} />
            ) : (
              <IconCalendarCross />
            )
          }
          onClick={handleCancel}
          type="button"
          variant="danger"
        >
          {t('event.cancelEventModal.buttonCancel')}
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

export default ConfirmCancelModal;
