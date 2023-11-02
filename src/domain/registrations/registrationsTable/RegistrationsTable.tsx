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

export const SignupsColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { currentAttendeeCount, maximumAttendeeCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(maximumAttendeeCapacity)
    ? `${currentAttendeeCount} / ${maximumAttendeeCapacity}`
    : `${currentAttendeeCount}`;
};

export const WaitingListColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { currentWaitingListCount, waitingListCapacity } =
    getRegistrationFields(registration, locale);

  return isNumber(waitingListCapacity)
    ? `${currentWaitingListCount} / ${waitingListCapacity}`
    : `${currentWaitingListCount}`;
};

const EnrolmentTimeColumn = (registration: RegistrationFieldsFragment) => {
  const locale = useLocale();
  const { enrolmentStartTime, enrolmentEndTime } = getRegistrationFields(
    registration,
    locale
  );

  return <TimeText startTime={enrolmentStartTime} endTime={enrolmentEndTime} />;
};

const EventTimeColumn = (registration: RegistrationFieldsFragment) => {
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
          className: styles.enrolmentTimeColumn,
          key: 'enrolmentTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.enrolmentTime'
          ),
          transform: EnrolmentTimeColumn,
        },
        {
          className: styles.eventTime,
          key: 'eventTime',
          headerName: t(
            'registrationsPage.registrationsTableColumns.eventTime'
          ),
          transform: EventTimeColumn,
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
