import React from 'react';
import { useTranslation } from 'react-i18next';

import { Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useTimeFormat from '../../../hooks/useTimeFormat';
import formatDate from '../../../utils/formatDate';
import PublisherName from '../../events/eventCard/PublisherName';
import { getEventItemId } from '../../eventSearch/utils';
import ActionsDropdown from '../actionsDropdown/ActionsDropdown';
import { getRegistrationFields } from '../utils';
import styles from './registrationsTable.module.scss';

interface Props {
  registration: Registration;
  onRowClick: (registration: Registration) => void;
}

const RegistrationsTableRow: React.FC<Props> = ({
  registration,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const actionsDropdownRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const timeFormat = useTimeFormat();

  const {
    currentAttendeeCount,
    currentWaitingAttendeeCount,
    enrolmentStartTime,
    enrolmentEndTime,
    id,
    maximumAttendeeCapacity,
    name,
    publisher,
    waitingAttendeeCapacity,
  } = getRegistrationFields(registration, locale);

  const handleRowClick = (ev: React.MouseEvent) => {
    /* istanbul ignore else */
    if (
      ev.target instanceof Node &&
      !actionsDropdownRef.current?.contains(ev.target)
    ) {
      onRowClick(registration);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === rowRef.current) {
      onRowClick(registration);
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        role="button"
        aria-label={name}
        id={getEventItemId(id)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <td className={styles.nameColumn}>
          <div className={styles.nameWrapper}>
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
        <td className={styles.participantsColumn}>
          {currentAttendeeCount} / {maximumAttendeeCapacity}
        </td>
        <td className={styles.waitingListColumn}>
          {currentWaitingAttendeeCount} / {waitingAttendeeCapacity}
        </td>
        <td className={styles.enrolmentStartTimeColumn}>
          {enrolmentStartTime
            ? t('eventsPage.datetime', {
                date: formatDate(enrolmentStartTime),
                time: formatDate(enrolmentStartTime, timeFormat, locale),
              })
            : /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.enrolmentEndTimeColumn}>
          {enrolmentEndTime
            ? t('eventsPage.datetime', {
                date: formatDate(enrolmentEndTime),
                time: formatDate(enrolmentEndTime, timeFormat, locale),
              })
            : /* istanbul ignore next */ '-'}
        </td>
        <td className={styles.actionButtonsColumn}>
          <ActionsDropdown
            ref={actionsDropdownRef}
            registration={registration}
          />
        </td>
      </tr>
    </>
  );
};

export default RegistrationsTableRow;
