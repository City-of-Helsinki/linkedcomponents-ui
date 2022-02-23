import React from 'react';

import EditingInfo from '../../../common/components/editingInfo/EditingInfo';
import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import StatusTag from '../tags/StatusTag';
import SuperEventTypeTag from '../tags/SuperEventTypeTag';
import { getEventFields } from '../utils';
import styles from './eventInfo.module.scss';

interface Props {
  event: EventFieldsFragment;
}

const EventInfo: React.FC<Props> = ({ event }) => {
  const locale = useLocale();
  const {
    createdBy,
    eventStatus,
    lastModifiedTime,
    name,
    publicationStatus,
    superEventType,
  } = getEventFields(event, locale);

  return (
    <div className={styles.eventInfo}>
      <div className={styles.statusTag}>
        <StatusTag
          eventStatus={eventStatus}
          publicationStatus={publicationStatus}
        />
      </div>

      <div className={styles.heading}>
        <h1>{name}</h1>
        <SuperEventTypeTag superEventType={superEventType} />
      </div>

      <EditingInfo createdBy={createdBy} lastModifiedAt={lastModifiedTime} />
    </div>
  );
};

export default EventInfo;
