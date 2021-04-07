import React from 'react';

import { DATETIME_FORMAT } from '../../constants';
import { EventFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import formatDate from '../../utils/formatDate';
import styles from './eventInfo.module.scss';
import StatusTag from './tags/StatusTag';
import SuperEventTypeTag from './tags/SuperEventTypeTag';
import { getEventFields } from './utils';

interface CreatorBadgeProps {
  createdBy: string;
}

const CreatorBadge: React.FC<CreatorBadgeProps> = ({ createdBy }) => {
  return createdBy ? (
    <span className={styles.creatorBadge}>{createdBy[0]}</span>
  ) : null;
};

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

      <p className={styles.editingInfo}>
        <span>{formatDate(lastModifiedTime, DATETIME_FORMAT)}</span>
        {createdBy && (
          <>
            <CreatorBadge createdBy={createdBy} />
            <span>{createdBy}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default EventInfo;
