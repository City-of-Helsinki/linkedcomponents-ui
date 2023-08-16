import classNames from 'classnames';
import { IconAngleDown, IconAngleUp } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import useTimeFormat from '../../../../hooks/useTimeFormat';
import formatDate from '../../../../utils/formatDate';
import getValue from '../../../../utils/getValue';
import { usePageSettings } from '../../../app/hooks/usePageSettings';
import StatusTag from '../../../event/tags/statusTag/StatusTag';
import SuperEventTypeTag from '../../../event/tags/superEventTypeTag/SuperEventTypeTag';
import { getEventFields } from '../../../event/utils';
import OrganizationName from '../../../organization/organizationName/OrganizationName';
import EventActionsDropdown from '../../eventActionsDropdown/EventActionsDropdown';
import { getEventItemId } from '../../utils';
import styles from '../eventsTable.module.scss';
import SubEventRows from '../subEventRows/SubEventRows';

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
  const {
    events: { addExpandedEvent, expandedEvents, removeExpandedEvent },
  } = usePageSettings();

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
      removeExpandedEvent(id);
    } else {
      addExpandedEvent(id);
    }
  };

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (ev.target instanceof Node && rowRef.current?.contains(ev.target)) {
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
        className={classNames(
          styles.clickableRow,
          open || hideBorder ? styles.noBorder : undefined
        )}
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
                    ? getValue(
                        t('eventsPage.eventsTable.hideSubEvents', {
                          name,
                        }),
                        undefined
                      )
                    : getValue(
                        t('eventsPage.eventsTable.showSubEvents', {
                          name,
                        }),
                        undefined
                      )
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
          {publisher !== 'others' ? (
            <OrganizationName id={publisher} />
          ) : (
            <span className={styles.externalPublisher}>
              <OrganizationName id={publisher} />
            </span>
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
        <td
          className={styles.actionButtonsColumn}
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
        >
          <EventActionsDropdown event={event} />
        </td>
      </tr>
      {!!subEventAtIds.length && open && (
        <SubEventRows eventId={id} level={level} onRowClick={onRowClick} />
      )}
    </>
  );
};

export default EventTableRow;
