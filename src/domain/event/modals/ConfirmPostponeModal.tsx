import { Dialog, IconCalendarClock, IconInfoCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import styles from '../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';

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

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handlePostpone = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onPostpone();
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
        title={t('event.postponeEventModal.title')}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
        <p id={descriptionId}>{t('event.postponeEventModal.text1')}</p>
        <p>{t('event.postponeEventModal.text2')}</p>
        <EventHierarchy event={event} />
        {Boolean(event.superEventType) && (
          <p>
            <strong>
              {t('event.postponeEventModal.titlePastEventAreNotUpdated')}
            </strong>
            <br />
            {t('event.postponeEventModal.textPastEventAreNotUpdated')}
          </p>
        )}
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={<IconCalendarClock aria-hidden={true} />}
          loading={isSaving}
          onClick={handlePostpone}
          type="button"
        >
          {t('event.postponeEventModal.buttonPostpone')}
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

export default ConfirmPostponeModal;
