import { IconCalendarCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
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
    event.stopPropagation();

    onCancel();
  };

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
        <LoadingButton
          disabled={isSaving}
          icon={<IconCalendarCross aria-hidden={true} />}
          loading={isSaving}
          onClick={handleCancel}
          type="button"
          variant="danger"
        >
          {t('event.cancelEventModal.buttonCancel')}
        </LoadingButton>

        <Button
          disabled={isSaving}
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
