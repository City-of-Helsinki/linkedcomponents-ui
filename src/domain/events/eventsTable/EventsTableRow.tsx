import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useTimeFormat from '../../../hooks/useTimeFormat';
import formatDate from '../../../utils/formatDate';
import StatusTag from '../../event/tags/StatusTag';
import SuperEventTypeTag from '../../event/tags/SuperEventTypeTag';
import { getEventFields } from '../../event/utils';
import { addExpandedEvent, removeExpandedEvent } from '../actions';
import PublisherName from '../eventCard/PublisherName';
import { expandedEventsSelector } from '../selectors';
import styles from './eventsTable.module.scss';
import SubEventRows from './SubEventRows';

interface Props {
  event: EventFieldsFragment;
  hideBorder?: boolean;
  level?: number;
}

const EventTableRow: React.FC<Props> = ({ event, hideBorder, level = 0 }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const timeFormat = useTimeFormat();
  const dispatch = useDispatch();
  const expandedEvents = useSelector(expandedEventsSelector);

  const {
    eventUrl,
    endTime,
    eventStatus,
    id,
    name,
    publicationStatus,
    publisher,
    startTime,
    subEventAtIds,
    superEventType,
  } = getEventFields(event, locale);
  const open = expandedEvents.includes(id);

  const toggle = () => {
    if (open) {
      dispatch(removeExpandedEvent(id));
    } else {
      dispatch(addExpandedEvent(id));
    }
  };

  return (
    <>
      <tr className={open || hideBorder ? styles.noBorder : undefined}>
        <td>
          <div
            className={styles.idWrapper}
            style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
          >
            {!!subEventAtIds.length && (
              <button
                aria-label={
                  open
                    ? t('eventsPage.eventsTable.hideSubEvents', { name })
                    : t('eventsPage.eventsTable.showSubEvents', { name })
                }
                onClick={toggle}
              >
                {open ? (
                  <IconAngleUp aria-hidden={true} size="s" />
                ) : (
                  <IconAngleDown aria-hidden={true} size="s" />
                )}
              </button>
            )}
            <SuperEventTypeTag
              className={styles.superEventTypeTag}
              superEventType={superEventType}
            />
            <Link aria-label={name} to={eventUrl}>
              {id}
            </Link>
          </div>
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
          <div className={styles.tags}>
            <StatusTag
              eventStatus={eventStatus}
              publicationStatus={publicationStatus}
            />
          </div>
        </td>
      </tr>
      {!!subEventAtIds.length && open && (
        <SubEventRows eventId={id} level={level} />
      )}
    </>
  );
};

export default EventTableRow;
