import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import NoDataRow from '../../../common/components/table/NoDataRow';
import Table from '../../../common/components/table/Table';
import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
// eslint-disable-next-line max-len
import useRegistrationsQueryStringWithReturnPath from '../../registrations/hooks/useRegistrationsQueryStringWithReturnPath';
import { getEnrolmentFields } from '../utils';
import styles from './enrolmentsTable.module.scss';
import EnrolmentTableRow from './EnrolmentTableRow';

export interface EnrolmentsTableProps {
  caption: string;
  enrolments: EnrolmentFieldsFragment[];
  heading: string;
  registration: RegistrationFieldsFragment;
}

const EnrolmentsTable: React.FC<EnrolmentsTableProps> = ({
  caption,
  enrolments,
  heading,
  registration,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const queryStringWithReturnPath = useRegistrationsQueryStringWithReturnPath();

  const table = React.useRef<HTMLTableElement>(null);

  const { focused } = useSetFocused(table);

  const handleRowClick = (enrolment: EnrolmentFieldsFragment) => {
    const { enrolmentUrl } = getEnrolmentFields({
      enrolment,
      language: locale,
      registration,
    });
    history.push({ pathname: enrolmentUrl, search: queryStringWithReturnPath });
  };

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.tableWrapper}>
        <Table ref={table} className={classNames(styles.enrolmentsTable)}>
          <caption aria-live={focused ? 'polite' : undefined}>
            {caption}
          </caption>
          <thead>
            <tr>
              <th className={styles.nameColumn}>
                {t('enrolmentsPage.enrolmentsTableColumns.name')}
              </th>
              <th className={styles.emailColumn}>
                {t('enrolmentsPage.enrolmentsTableColumns.email')}
              </th>
              <th className={styles.phoneColumn}>
                {t('enrolmentsPage.enrolmentsTableColumns.phone')}
              </th>
              <th className={styles.statusColumn}>
                {t('enrolmentsPage.enrolmentsTableColumns.status')}
              </th>
              <th className={styles.actionButtonsColumn}></th>
            </tr>
          </thead>
          <tbody>
            {enrolments.map(
              (enrolment) =>
                enrolment && (
                  <EnrolmentTableRow
                    key={enrolment.id}
                    enrolment={enrolment}
                    onRowClick={handleRowClick}
                    registration={registration}
                  />
                )
            )}
            {!enrolments.length && <NoDataRow colSpan={6} />}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default EnrolmentsTable;