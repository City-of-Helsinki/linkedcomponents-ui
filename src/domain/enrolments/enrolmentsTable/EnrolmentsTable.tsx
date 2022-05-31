import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import NoDataRow from '../../../common/components/table/NoDataRow';
import Table from '../../../common/components/table/Table';
import TableWrapper from '../../../common/components/table/TableWrapper';
import {
  EnrolmentFieldsFragment,
  EnrolmentsQueryVariables,
  RegistrationFieldsFragment,
  useEnrolmentsQuery,
} from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useLocale from '../../../hooks/useLocale';
import useSetFocused from '../../../hooks/useSetFocused';
import getPageCount from '../../../utils/getPageCount';
import getPathBuilder from '../../../utils/getPathBuilder';
import { getRegistrationFields } from '../../registration/utils';
// eslint-disable-next-line max-len
import useRegistrationsQueryStringWithReturnPath from '../../registrations/hooks/useRegistrationsQueryStringWithReturnPath';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { ENROLMENTS_PAGE_SIZE } from '../constants';
import {
  enrolmentsPathBuilder,
  getEnrolmentFields,
  getEnrolmentSearchInitialValues,
} from '../utils';
import styles from './enrolmentsTable.module.scss';
import EnrolmentTableRow from './EnrolmentTableRow';

export interface EnrolmentsTableProps {
  caption: string;
  enrolmentsVariables: EnrolmentsQueryVariables;
  heading: string;
  pagePath: 'attendeePage' | 'waitingPage';
  registration: RegistrationFieldsFragment;
}

const EnrolmentsTable: React.FC<EnrolmentsTableProps> = ({
  caption,
  enrolmentsVariables,
  heading,
  pagePath,
  registration,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const queryStringWithReturnPath = useRegistrationsQueryStringWithReturnPath();

  const enrolmentListId = useIdWithPrefix({
    prefix: 'enrolment-attendee-list-',
  });

  const { id } = getRegistrationFields(registration, locale);
  const { enrolmentText, [pagePath]: page } = getEnrolmentSearchInitialValues(
    location.search
  );
  const { data: enrolmentsData, loading } = useEnrolmentsQuery({
    variables: {
      createPath: getPathBuilder(enrolmentsPathBuilder),
      registrations: [id],
      text: enrolmentText,
      ...enrolmentsVariables,
    },
  });

  const enrolments =
    (enrolmentsData?.enrolments as EnrolmentFieldsFragment[]) || [];

  const onSelectedPageChange = (page: number) => {
    navigate({
      pathname: location.pathname,
      search: replaceParamsToRegistrationQueryString(location.search, {
        [pagePath]: page > 1 ? page : null,
      }),
    });
    // Scroll to the beginning of event list
    scroller.scrollTo(enrolmentListId, { offset: -100 });
  };

  const enrolmentCount = enrolments.length;
  const pageCount = getPageCount(enrolmentCount, ENROLMENTS_PAGE_SIZE);

  const paginatedEnrolments = enrolments.slice(
    (page - 1) * ENROLMENTS_PAGE_SIZE,
    page * ENROLMENTS_PAGE_SIZE
  );

  const table = React.useRef<HTMLTableElement>(null);

  const { focused } = useSetFocused(table);

  const handleRowClick = (enrolment: EnrolmentFieldsFragment) => {
    const { enrolmentUrl } = getEnrolmentFields({
      enrolment,
      language: locale,
      registration,
    });
    navigate({ pathname: enrolmentUrl, search: queryStringWithReturnPath });
  };

  return (
    <div id={enrolmentListId}>
      <h2 className={styles.heading}>{heading}</h2>
      <TableWrapper>
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
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <LoadingSpinner isLoading={true} />
                </td>
              </tr>
            ) : (
              <>
                {paginatedEnrolments.map(
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
                {!paginatedEnrolments.length && <NoDataRow colSpan={6} />}
              </>
            )}
          </tbody>
        </Table>
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            selectedPage={page}
            setSelectedPage={onSelectedPageChange}
          />
        )}
      </TableWrapper>
    </div>
  );
};

export default EnrolmentsTable;
