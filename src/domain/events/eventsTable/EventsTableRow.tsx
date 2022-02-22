import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useTimeFormat from '../../../hooks/useTimeFormat';
import formatDate from '../../../utils/formatDate';
import StatusTag from '../../event/tags/StatusTag';
import SuperEventTypeTag from '../../event/tags/SuperEventTypeTag';
import { getEventFields } from '../../event/utils';
import { getEventItemId } from '../../eventSearch/utils';
import { addExpandedEvent, removeExpandedEvent } from '../actions';
import EventActionsDropdown from '../eventActionsDropdown/EventActionsDropdown';
import PublisherName from '../eventCard/PublisherName';
import { expandedEventsSelector } from '../selectors';
import styles from './eventsTable.module.scss';
import SubEventRows from './SubEventRows';

interface Props {
  event: EventFieldsFragment;
  hideBorder?: boolean;
  level?: number;
  onRowClick: (event: EventFieldsFragment) => void;
}

const EventTableRow: React.FC<Props> = ({
  event,
  hideBorder,
  level = 0,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const timeFormat = useTimeFormat();
  const dispatch = useDispatch();
  const expandedEvents = useSelector(expandedEventsSelector);
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const {
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

  const toggle = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (open) {
      dispatch(removeExpandedEvent(id));
    } else {
      dispatch(addExpandedEvent(id));
    }
  };

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      rowRef.current?.contains(ev.target) &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(event);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(event);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        className={open || hideBorder ? styles.noBorder : undefined}
        id={getEventItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div
            className={styles.nameWrapper}
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
            <span className={styles.eventName} title={name}>
              {name}
            </span>
          </div>
        </td>
        <td className={styles.publisherColumn}>
          {publisher ? (
            <PublisherName id={publisher} />
          ) : (
            /* istanbul ignore next */ '-'
          )}
        </td>
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
        <td className={styles.actionButtonsColumn}>
          <EventActionsDropdown ref={actionsDropdownRef} event={event} />
        </td>
      </tr>
      {!!subEventAtIds.length && open && (
        <SubEventRows eventId={id} level={level} onRowClick={onRowClick} />
      )}
    </>
  );
};

export default EventTableRow;
