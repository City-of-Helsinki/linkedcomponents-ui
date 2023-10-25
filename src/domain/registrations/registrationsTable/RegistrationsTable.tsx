import isNumber from 'lodash/isNumber';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import Table from '../../../common/components/table/Table';
import {
  RegistrationFieldsFragment,
  RegistrationsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import useTimeFormat from '../../../hooks/useTimeFormat';
import formatDate from '../../../utils/formatDate';
import getValue from '../../../utils/getValue';
import OrganizationName from '../../organization/organizationName/OrganizationName';
import {
  getRegistrationFields,
  getRegistrationItemId,
} from '../../registration/utils';
import RegistrationActionsDropdown from '../registrationActionsDropdown/RegistrationActionsDropdown';
import styles from './registrationsTable.module.scss';

export interface RegistrationsTableProps {
  caption: string;
  className?: string;
  registrations: RegistrationsQuery['registrations']['data'];
}

const NameColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { event } = getRegistrationFields(registration, locale);

  return (
    <div className={styles.nameWrapper}>
      <span className={styles.registrationName} title={event?.name}>
        {event?.name}
      </span>
    </div>
  );
};

const PublisherColumn = (registration: RegistrationFieldsFragment) => {
  return <OrganizationName id={getValue(registration.publisher, '')} />;
};

const SignupsColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { currentAttendeeCount, maximumAttendeeCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(maximumAttendeeCapacity)
    ? `${currentAttendeeCount} / ${maximumAttendeeCapacity}`
    : `${currentAttendeeCount}`;
};

const WaitingListColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { currentWaitingListCount, waitingListCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(waitingListCapacity)
    ? `${currentWaitingListCount} / ${waitingListCapacity}`
    : `${currentWaitingListCount}`;
};

const StartTimeColumn = (registration: RegistrationFieldsFragment) => {
  const timeFormat = useTimeFormat();
  const locale = useLocale();
  const { t } = useTranslation();
  const { enrolmentStartTime } = getRegistrationFields(registration, locale);

  return (
    <>
      {enrolmentStartTime
        ? t('eventsPage.datetime', {
            date: formatDate(enrolmentStartTime),
            time: formatDate(enrolmentStartTime, timeFormat, locale),
          })
        : /* istanbul ignore next */ '-'}
    </>
  );
};

const EndTimeColumn = (registration: RegistrationFieldsFragment) => {
  const timeFormat = useTimeFormat();
  const locale = useLocale();
  const { t } = useTranslation();
  const { enrolmentEndTime } = getRegistrationFields(registration, locale);

  return (
    <>
      {enrolmentEndTime
        ? t('eventsPage.datetime', {
            date: formatDate(enrolmentEndTime),
            time: formatDate(enrolmentEndTime, timeFormat, locale),
          })
        : /* istanbul ignore next */ '-'}
    </>
  );
};

const ActionsColumn = (registration: RegistrationFieldsFragment) => {
  return <RegistrationActionsDropdown registration={registration} />;
};

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  caption,
  className,
  registrations,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const handleRowClick = (registration: object) => {
    const { registrationUrl } = getRegistrationFields(
      registration as RegistrationFieldsFragment,
      locale
    );

    navigate({
      pathname: registrationUrl,
      search: queryStringWithReturnPath,
    });
  };

  return (
    <Table
      caption={caption}
      className={className}
      cols={[
        {
          className: styles.nameColumn,
          key: 'name',
          headerName: t('registrationsPage.registrationsTableColumns.name'),
          transform: NameColumn,
        },
        {
          className: styles.publisherColumn,
          key: 'publisher',
          headerName: t(
            'registrationsPage.registrationsTableColumns.publisher'
          ),
          transform: PublisherColumn,
        },
        {
          className: styles.signupsColumn,
          key: 'signups',
          headerName: t('registrationsPage.registrationsTableColumns.signups'),
          transform: SignupsColumn,
        },
        {
          className: styles.waitingListColumn,
          key: 'waitingList',
          headerName: t(
            'registrationsPage.registrationsTableColumns.waitingList'
          ),
          transform: WaitingListColumn,
        },
        {
          className: styles.enrolmentStartTimeColumn,
          key: 'startTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.enrolmentStartTime'
          ),
          transform: StartTimeColumn,
        },
        {
          className: styles.enrolmentEndTimeColumn,
          key: 'endTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.enrolmentEndTime'
          ),
          transform: EndTimeColumn,
        },

        {
          className: styles.actionButtonsColumn,
          key: '',
          headerName: '',
          onClick: (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          },
          transform: ActionsColumn,
        },
      ]}
      getRowProps={(registration) => {
        const { id } = getRegistrationFields(
          registration as RegistrationFieldsFragment,
          locale
        );

        return {
          'aria-label': id,
          'data-testid': id,
          id: getRegistrationItemId(id),
        };
      }}
      indexKey="id"
      onRowClick={handleRowClick}
      renderIndexCol={false}
      rows={registrations as RegistrationFieldsFragment[]}
      variant="light"
    />
  );
};

export default RegistrationsTable;
