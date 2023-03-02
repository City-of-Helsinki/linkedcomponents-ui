import { IconCalendarClock } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

export type ConfirmPostponeEventModalProps = {
  event: EventFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmPostponeEventModal: React.FC<ConfirmPostponeEventModalProps> = ({
  event,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
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
        </>
      }
      confirmButtonIcon={<IconCalendarClock aria-hidden={true} />}
      confirmButtonText={t('event.postponeEventModal.buttonPostpone')}
      description={t('event.postponeEventModal.text1')}
      extraWarning={
        <p className={styles.warning}>
          <strong>{t('common.warning')}</strong>
        </p>
      }
      heading={t('event.postponeEventModal.title')}
      id="confirm-event-postpone-modal"
      variant="primary"
    />
  );
};

export default ConfirmPostponeEventModal;
