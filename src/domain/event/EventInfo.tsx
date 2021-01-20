import React from 'react';

import { DATETIME_FORMAT } from '../../constants';
import { EventFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import formatDate from '../../utils/formatDate';
import styles from './eventInfo.module.scss';
import StatusTag from './tags/StatusTag';
import SuperEventTypeTag from './tags/SuperEventTypeTag';
import { getEventFields } from './utils';

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

      <h1 className={styles.heading}>
        {name} <SuperEventTypeTag superEventType={superEventType} />
      </h1>

      <p className={styles.time}>
        <i>{formatDate(lastModifiedTime, DATETIME_FORMAT)}</i>
      </p>
      <p className={styles.author}>{createdBy || '-'}</p>
    </div>
  );
};

export default EventInfo;
