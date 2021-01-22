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
  onCancel: () => void;
  onClose: () => void;
}

const ConfirmUpdateModal: React.FC<Props> = ({
  event,
  isOpen,
  onCancel,
  onClose,
}) => {
  const { t } = useTranslation();

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
      <div className={styles.modalButtonWrapper}>
        <Button onClick={onCancel} type="button" variant="danger">
          {t('event.cancelEventModal.buttonCancel')}
        </Button>
        <Button onClick={onClose} type="button" variant="secondary">
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmUpdateModal;
