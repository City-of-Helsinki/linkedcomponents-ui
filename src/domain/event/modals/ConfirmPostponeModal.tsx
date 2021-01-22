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
  onPostpone: () => void;
}

const ConfirmUpdateModal: React.FC<Props> = ({
  event,
  isOpen,
  onClose,
  onPostpone,
}) => {
  const { t } = useTranslation();

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
        <Button onClick={onPostpone} type="button">
          {t('event.postponeEventModal.buttonPostpone')}
        </Button>
        <Button onClick={onClose} variant="secondary" type="button">
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmUpdateModal;
