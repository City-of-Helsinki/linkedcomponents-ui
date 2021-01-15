import React from 'react';

import { DATETIME_FORMAT } from '../../constants';
import { EventFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import formatDate from '../../utils/formatDate';
import styles from './eventInfo.module.scss';
import { getEventFields } from './utils';

interface Props {
  event: EventFieldsFragment;
}
const EventInfo: React.FC<Props> = ({ event }) => {
  const locale = useLocale();
  const { createdBy, lastModifiedTime, name } = getEventFields(event, locale);

  return (
    <div className={styles.eventInfo}>
      <h1>{name}</h1>
      <p className={styles.time}>
        <i>{formatDate(lastModifiedTime, DATETIME_FORMAT)}</i>
      </p>
      <p className={styles.author}>{createdBy || '-'}</p>
    </div>
  );
};

export default EventInfo;
