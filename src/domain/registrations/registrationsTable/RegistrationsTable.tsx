import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import NoDataRow from '../../../common/components/table/NoDataRow';
import Table from '../../../common/components/table/Table';
import {
  RegistrationFieldsFragment,
  RegistrationsQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import { getRegistrationFields } from '../../registration/utils';
import useRegistrationsQueryStringWithReturnPath from '../hooks/useRegistrationsQueryStringWithReturnPath';
import styles from './registrationsTable.module.scss';
import RegistrationsTableRow from './RegistrationsTableRow';

export interface RegistrationsTableProps {
  caption: string;
  className?: string;
  registrations: RegistrationsQuery['registrations']['data'];
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  caption,
  className,
  registrations,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const queryStringWithReturnPath = useRegistrationsQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const { focused } = useSetFocused(table);

  const handleRowClick = (registration: RegistrationFieldsFragment) => {
    const { registrationUrl } = getRegistrationFields(registration, locale);

    navigate({
      pathname: registrationUrl,
      search: queryStringWithReturnPath,
    });
  };

  return (
    <Table ref={table} className={className}>
      <caption aria-live={focused ? 'polite' : undefined}>{caption}</caption>
      <thead>
        <tr>
          <th className={styles.nameColumn}>
            {t('registrationsPage.registrationsTableColumns.name')}
          </th>
          <th className={styles.nameColumn}>
            {t('registrationsPage.registrationsTableColumns.publisher')}
          </th>
          <th className={styles.enrolmentsColumn}>
            {t('registrationsPage.registrationsTableColumns.enrolments')}
          </th>
          <th className={styles.waitingListColumn}>
            {t('registrationsPage.registrationsTableColumns.waitingList')}
          </th>
          <th className={styles.enrolmentStartTimeColumn}>
            {t(
              'registrationsPage.registrationsTableColumns.enrolmentStartTime'
            )}
          </th>
          <th className={styles.enrolmentEndTimeColumn}>
            {t('registrationsPage.registrationsTableColumns.enrolmentEndTime')}
          </th>
          <th className={styles.actionButtonsColumn}></th>
        </tr>
      </thead>
      <tbody>
        {registrations.map(
          (registration) =>
            registration && (
              <RegistrationsTableRow
                key={registration.id}
                onRowClick={handleRowClick}
                registration={registration}
              />
            )
        )}
        {!registrations.length && <NoDataRow colSpan={6} />}
      </tbody>
    </Table>
  );
};

export default RegistrationsTable;
