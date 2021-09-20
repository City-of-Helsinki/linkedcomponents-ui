import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import NoDataRow from '../../../common/components/table/NoDataRow';
import Table from '../../../common/components/table/Table';
import { Registration } from '../../../generated/graphql';
import useIsComponentFocused from '../../../hooks/useIsComponentFocused';
import useLocale from '../../../hooks/useLocale';
import useEventsQueryStringWithReturnPath from '../../eventSearch/hooks/useEventsQueryStringWithReturnPath';
import { getRegistrationFields } from '../utils';
import styles from './registrationsTable.module.scss';
import RegistrationsTableRow from './RegistrationsTableRow';

export interface RegistrationsTableProps {
  caption: string;
  className?: string;
  registrations: Registration[];
}

const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  caption,
  className,
  registrations,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const queryStringWithReturnPath = useEventsQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);
  const [focused, setFocused] = React.useState(false);

  const isComponentFocused = useIsComponentFocused(table);

  const onDocumentFocusin = () => {
    const isFocused = isComponentFocused();
    if (isFocused !== focused) {
      setFocused(isFocused);
    }
  };

  React.useEffect(() => {
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  const handleRowClick = (registration: Registration) => {
    const { registrationUrl } = getRegistrationFields(registration, locale);

    history.push({
      pathname: registrationUrl,
      search: queryStringWithReturnPath,
    });
  };

  return (
    <Table ref={table} className={classNames(styles.registrationsTable)}>
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
