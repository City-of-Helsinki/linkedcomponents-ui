import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useTimeFormat from '../../../hooks/useTimeFormat';
import formatDate from '../../../utils/formatDate';
import { getEventFields } from '../../event/utils';
import PublisherName from '../eventCard/PublisherName';
import styles from './eventsTable.module.scss';
import PublicationStatusTag from './PublicationStatusTag';

interface Props {
  event: EventFieldsFragment;
}

const EventTableRow: React.FC<Props> = ({ event }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const timeFormat = useTimeFormat();

  const {
    eventUrl,
    endTime,
    id,
    name,
    publicationStatus,
    publisher,
    startTime,
  } = getEventFields(event, locale);

  return (
    <tr>
      <td>
        <Link aria-label={name} to={eventUrl}>
          {id}
        </Link>
      </td>
      <td>
        {publisher ? (
          <PublisherName id={publisher} />
        ) : (
          /* istanbul ignore next */ '-'
        )}
      </td>
      <td>{name}</td>
      <td className={styles.timeColumn}>
        {startTime
          ? t('eventsPage.datetime', {
              date: formatDate(startTime),
              time: formatDate(startTime, timeFormat, locale),
            })
          : /* istanbul ignore next */ '-'}
      </td>
      <td className={styles.timeColumn}>
        {endTime
          ? t('eventsPage.datetime', {
              date: formatDate(endTime),
              time: formatDate(endTime, timeFormat, locale),
            })
          : '-'}
      </td>
      <td>
        <PublicationStatusTag publicationStatus={publicationStatus} />
      </td>
    </tr>
  );
};

export default EventTableRow;
