import { Dialog, IconAlertCircle, IconCalendarCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

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

  const id = 'confirm-event-cancel-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="danger"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconAlertCircle aria-hidden={true} />}
        title={t('event.cancelEventModal.title')}
      />
      <Dialog.Content>
        <p>
          <strong>{t('event.cancelEventModal.warning')}</strong>
        </p>
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
        <p id={descriptionId}>{t('event.cancelEventModal.text1')}</p>
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
      </Dialog.Content>
      <Dialog.ActionButtons>
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
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmCancelModal;
