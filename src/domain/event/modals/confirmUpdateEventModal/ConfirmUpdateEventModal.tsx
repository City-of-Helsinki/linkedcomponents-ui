import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

export type ConfirmUpdateEventModalProps = {
  event: EventFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmUpdateEventModal: React.FC<ConfirmUpdateEventModalProps> = ({
  event,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
          <p>{t('event.updateEventModal.text2')}</p>
          <EventHierarchy event={event} />
          <p>
            <strong>
              {t('event.updateEventModal.titlePastEventAreNotUpdated')}
            </strong>
            <br />
            {t('event.updateEventModal.textPastEventAreNotUpdated')}
          </p>
        </>
      }
      confirmButtonIcon={<IconPen aria-hidden={true} />}
      confirmButtonText={t('common.save')}
      description={t('event.updateEventModal.text1')}
      heading={t('event.updateEventModal.title')}
      id="confirm-event-postpone-modal"
      variant="primary"
    />
  );
};

export default ConfirmUpdateEventModal;
