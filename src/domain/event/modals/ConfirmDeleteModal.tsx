import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../common/components/button/Button';
import Modal from '../../../common/components/modal/Modal';
import { EventFieldsFragment } from '../../../generated/graphql';
import EventHierarchy from '../eventHierarchy/EventHierarchy';
import styles from './modals.module.scss';

interface Props {
  event: EventFieldsFragment;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmUpdateModal: React.FC<Props> = ({
  event,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

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
      <p>
        <div>{t('event.deleteEventModal.text1')} </div>
        <div>{t('event.deleteEventModal.text2')}</div>
      </p>
      <p>{t('event.deleteEventModal.text3')}</p>
      <EventHierarchy event={event} />
      <div className={styles.modalButtonWrapper}>
        <Button onClick={onDelete} type="button" variant="danger">
          {t('event.deleteEventModal.buttonDelete')}
        </Button>
        <Button
          onClick={onClose}
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

export default ConfirmUpdateModal;
