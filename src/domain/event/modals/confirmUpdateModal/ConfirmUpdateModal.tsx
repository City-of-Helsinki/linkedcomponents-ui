import { Dialog, IconInfoCircle, IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

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

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onSave();
  };

  const id = 'confirm-event-postpone-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="primary"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconInfoCircle aria-hidden={true} />}
        title={t('event.updateEventModal.title')}
      />
      <Dialog.Content>
        <p id={descriptionId}>{t('event.updateEventModal.text1')}</p>
        <p>{t('event.updateEventModal.text2')}</p>
        <EventHierarchy event={event} />
        <p>
          <strong>
            {t('event.updateEventModal.titlePastEventAreNotUpdated')}
          </strong>
          <br />
          {t('event.updateEventModal.textPastEventAreNotUpdated')}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={<IconPen aria-hidden={true} />}
          loading={isSaving}
          onClick={handleSave}
          type="button"
        >
          {t('common.save')}
        </LoadingButton>

        <Button
          disabled={isSaving}
          onClick={handleClose}
          variant="secondary"
          type="button"
        >
          {t('common.cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmUpdateModal;
