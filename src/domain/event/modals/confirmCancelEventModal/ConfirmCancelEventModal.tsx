import { IconCalendarCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

export type ConfirmCancelEventModalProps = {
  event: EventFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmCancelEventModal: React.FC<ConfirmCancelEventModalProps> = ({
  event,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
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
        </>
      }
      confirmButtonIcon={<IconCalendarCross aria-hidden={true} />}
      confirmButtonText={t('event.cancelEventModal.buttonCancel')}
      description={t('event.cancelEventModal.text1')}
      extraWarning={
        <p>
          <strong>{t('event.cancelEventModal.warning')}</strong>
        </p>
      }
      heading={t('event.cancelEventModal.title')}
      id="confirm-event-cancel-modal"
      variant="danger"
    />
  );
};

export default ConfirmCancelEventModal;
