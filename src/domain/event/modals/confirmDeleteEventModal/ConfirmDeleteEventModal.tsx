import { IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDeleteModal, {
  CommonConfirmDeleteModalProps,
} from '../../../../common/components/dialog/confirmDeleteModal/ConfirmDeleteModal';
import { EventFieldsFragment } from '../../../../generated/graphql';
import EventHierarchy from '../../eventHierarchy/EventHierarchy';

export type ConfirmDeleteEventModalProps = {
  event: EventFieldsFragment;
} & CommonConfirmDeleteModalProps;

const ConfirmDeleteEventModal: React.FC<ConfirmDeleteEventModalProps> = ({
  event,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmDeleteModal
      {...props}
      bodyContent={
        <>
          <p style={{ marginTop: 0 }}>{t('event.deleteEventModal.text2')}</p>
          <p>{t('event.deleteEventModal.text3')}</p>
          <EventHierarchy event={event} />
        </>
      }
      deleteButtonIcon={<IconCross aria-hidden={true} />}
      deleteButtonText={t('event.deleteEventModal.buttonDelete')}
      description={t('event.deleteEventModal.text1')}
      heading={t('event.deleteEventModal.title')}
      id="confirm-event-delete-modal"
    />
  );
};

export default ConfirmDeleteEventModal;
