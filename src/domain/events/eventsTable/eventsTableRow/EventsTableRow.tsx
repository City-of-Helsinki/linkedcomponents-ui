import classNames from 'classnames';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CollapseButton from '../../../../common/components/table/collapseButton/CollapseButton';
import { EventFieldsFragment } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import useTimeFormat from '../../../../hooks/useTimeFormat';
import formatDate from '../../../../utils/formatDate';
import { usePageSettings } from '../../../app/hooks/usePageSettings';
import StatusTag from '../../../event/tags/statusTag/StatusTag';
import SuperEventTypeTag from '../../../event/tags/superEventTypeTag/SuperEventTypeTag';
import { getEventFields } from '../../../event/utils';
import { EXTERNAL_PUBLISHER_ID } from '../../../organization/constants';
import OrganizationName from '../../../organization/organizationName/OrganizationName';
import EventActionsDropdown from '../../eventActionsDropdown/EventActionsDropdown';
import { getEventItemId } from '../../utils';
import styles from '../eventsTable.module.scss';
import SubEventRows from '../subEventRows/SubEventRows';

interface Props {
  event: EventFieldsFragment;
  hideBorder?: boolean;
  level?: number;
}

type ColumnProps = {
  event: EventFieldsFragment;
};

type NameColumnProps = {
  level?: number;
  open: boolean;
  toggle: () => void;
} & ColumnProps;

const NameColumn: FC<NameColumnProps> = ({ event, level, open, toggle }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { eventUrl, id, name, subEventAtIds, superEventType } = getEventFields(
    event,
    locale
  );

  return (
    <div
      className={styles.nameWrapper}
      style={{ paddingLeft: `calc(${level} * var(--spacing-m))` }}
    >
      {!!subEventAtIds.length && (
        <CollapseButton
          ariaLabel={t(
            open
              ? 'eventsPage.eventsTable.hideSubEvents'
              : 'eventsPage.eventsTable.showSubEvents',
            { name }
          )}
          onClick={toggle}
          open={open}
        />
      )}
      <SuperEventTypeTag
        className={styles.superEventTypeTag}
        superEventType={superEventType}
      />
      <Link id={getEventItemId(id)} to={eventUrl} title={name}>
        <span className={styles.eventName}>{name}</span>
      </Link>
    </div>
  );
};

const PublisherColumn: FC<ColumnProps> = ({ event }) => {
  const locale = useLocale();

  const { publisher } = getEventFields(event, locale);

  if (publisher !== EXTERNAL_PUBLISHER_ID) {
    return <OrganizationName id={publisher} />;
  }
  return (
    <span className={styles.externalPublisher}>
      <OrganizationName id={publisher} />
    </span>
  );
};

const TimeColumn: FC<{ time: Date | null }> = ({ time }) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const timeFormat = useTimeFormat();

  return time
    ? t('eventsPage.datetime', {
        date: formatDate(time),
        time: formatDate(time, timeFormat, locale),
      })
    : /* istanbul ignore next */ '-';
};

const EventTableRow: React.FC<Props> = ({ event, hideBorder, level = 0 }) => {
  const locale = useLocale();
  const {
    events: { addExpandedEvent, expandedEvents, removeExpandedEvent },
  } = usePageSettings();

  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const {
    endTime,
    eventStatus,
    id,
    publicationStatus,
    startTime,
    subEventAtIds,
  } = getEventFields(event, locale);
  const open = expandedEvents.includes(id);

  const toggle = () => {
    open ? removeExpandedEvent(id) : addExpandedEvent(id);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className={classNames(open || hideBorder ? styles.noBorder : undefined)}
      >
        <td className={styles.nameColumn}>
          <NameColumn event={event} level={level} open={open} toggle={toggle} />
        </td>
        <td className={styles.publisherColumn}>
          <PublisherColumn event={event} />
        </td>
        <td className={styles.timeColumn}>
          <TimeColumn time={startTime} />
        </td>
        <td className={styles.timeColumn}>
          <TimeColumn time={endTime} />
        </td>
        <td>
          <div className={styles.tags}>
            <StatusTag
              eventStatus={eventStatus}
              publicationStatus={publicationStatus}
            />
          </div>
        </td>
        <td>
          <EventActionsDropdown event={event} />
        </td>
      </tr>
      {!!subEventAtIds.length && open && (
        <SubEventRows eventId={id} level={level} />
      )}
    </>
  );
};

export default EventTableRow;
