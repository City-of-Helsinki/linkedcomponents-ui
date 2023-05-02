import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmModal, {
  CommonConfirmModalProps,
} from '../../../../common/components/dialog/confirmModal/ConfirmModal';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

export type ConfirmDeleteEventModalProps = {
  event: EventFieldsFragment;
} & CommonConfirmModalProps;

const ConfirmDeleteEventModal: React.FC<ConfirmDeleteEventModalProps> = ({
  event,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      {...props}
      bodyContent={
        <>
          <p style={{ marginTop: 0 }}>{t('event.deleteEventModal.text2')}</p>
          <p>{t('event.deleteEventModal.text3')}</p>
          <EventHierarchy event={event} />
        </>
      }
      confirmButtonIcon={<IconCross aria-hidden={true} />}
      confirmButtonText={t('event.deleteEventModal.buttonDelete')}
      description={t('event.deleteEventModal.text1')}
      heading={t('event.deleteEventModal.title')}
      id="confirm-event-delete-modal"
      variant="danger"
    />
  );
};

export default ConfirmDeleteEventModal;
