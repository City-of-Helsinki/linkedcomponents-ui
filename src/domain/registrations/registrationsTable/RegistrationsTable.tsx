import isNumber from 'lodash/isNumber';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Table from '../../../common/components/table/Table';
import {
  RegistrationFieldsFragment,
  RegistrationsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getValue from '../../../utils/getValue';
import OrganizationName from '../../organization/organizationName/OrganizationName';
import {
  getRegistrationFields,
  getRegistrationItemId,
} from '../../registration/utils';
import RegistrationActionsDropdown from '../registrationActionsDropdown/RegistrationActionsDropdown';
import styles from './registrationsTable.module.scss';
import TimeText from './timeText/TimeText';

export interface RegistrationsTableProps {
  caption: string;
  className?: string;
  registrations: RegistrationsQuery['registrations']['data'];
}

type ColumnProps = {
  registration: RegistrationFieldsFragment;
};

const NameColumn: FC<ColumnProps> = ({ registration }) => {
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { event, id, registrationUrl } = getRegistrationFields(
    registration,
    locale
  );

  return (
    <div className={styles.nameWrapper}>
      <Link
        className={styles.registrationName}
        id={getRegistrationItemId(id)}
        title={event?.name}
        to={{ pathname: registrationUrl, search: queryStringWithReturnPath }}
      >
        {event?.name}
      </Link>
    </div>
  );
};

const PublisherColumn: FC<ColumnProps> = ({ registration }) => {
  return <OrganizationName id={getValue(registration.publisher, '')} />;
};

export const SignupsColumn: FC<ColumnProps> = ({ registration }) => {
  const locale = useLocale();
  const { currentAttendeeCount, maximumAttendeeCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(maximumAttendeeCapacity)
    ? `${currentAttendeeCount} / ${maximumAttendeeCapacity}`
    : `${currentAttendeeCount}`;
};

export const WaitingListColumn: FC<ColumnProps> = ({ registration }) => {
  const locale = useLocale();
  const { currentWaitingListCount, waitingListCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(waitingListCapacity)
    ? `${currentWaitingListCount} / ${waitingListCapacity}`
    : `${currentWaitingListCount}`;
};

const EnrolmentTimeColumn: FC<ColumnProps> = ({ registration }) => {
  const locale = useLocale();
  const { enrolmentStartTime, enrolmentEndTime } = getRegistrationFields(
    registration,
    locale
  );

  return <TimeText startTime={enrolmentStartTime} endTime={enrolmentEndTime} />;
};

const EventTimeColumn: FC<ColumnProps> = ({ registration }) => {
  const locale = useLocale();
  const { event } = getRegistrationFields(registration, locale);

  return <TimeText startTime={event?.startTime} endTime={event?.endTime} />;
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

  const MemoizedNameColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <NameColumn registration={registration} />
    ),
    []
  );
  const MemoizedPublisherColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <PublisherColumn registration={registration} />
    ),
    []
  );
  const MemoizedSignupsColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <SignupsColumn registration={registration} />
    ),
    []
  );
  const MemoizedWaitingListColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <WaitingListColumn registration={registration} />
    ),
    []
  );
  const MemoizedEnrolmentTimeColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <EnrolmentTimeColumn registration={registration} />
    ),
    []
  );
  const MemoizedEventTimeColumn = useCallback(
    (registration: RegistrationFieldsFragment) => (
      <EventTimeColumn registration={registration} />
    ),
    []
  );

  return (
    <Table
      caption={caption}
      theme={{ '--header-background-color': 'transparent' }}
      inlineWithBackground
      wrapperClassName={className}
      cols={[
        {
          key: 'name',
          headerName: t('registrationsPage.registrationsTableColumns.name'),
          transform: MemoizedNameColumn,
        },
        {
          key: 'publisher',
          headerName: t(
            'registrationsPage.registrationsTableColumns.publisher'
          ),
          transform: MemoizedPublisherColumn,
        },
        {
          key: 'signups',
          headerName: t('registrationsPage.registrationsTableColumns.signups'),
          transform: MemoizedSignupsColumn,
        },
        {
          key: 'waitingList',
          headerName: t(
            'registrationsPage.registrationsTableColumns.waitingList'
          ),
          transform: MemoizedWaitingListColumn,
        },
        {
          key: 'enrolmentTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.enrolmentTime'
          ),
          transform: MemoizedEnrolmentTimeColumn,
        },
        {
          key: 'eventTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.eventTime'
          ),
          transform: MemoizedEventTimeColumn,
        },

        {
          key: '',
          headerName: '',
          transform: ActionsColumn,
        },
      ]}
      hasActionButtons
      indexKey="id"
      renderIndexCol={false}
      rows={registrations as RegistrationFieldsFragment[]}
      variant="light"
    />
  );
};

export default RegistrationsTable;
