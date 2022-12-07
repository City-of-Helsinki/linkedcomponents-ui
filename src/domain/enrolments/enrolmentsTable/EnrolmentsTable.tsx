import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import NoDataRow from '../../../common/components/table/noDataRow/NoDataRow';
import Table from '../../../common/components/table/Table';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import {
  EnrolmentFieldsFragment,
  EnrolmentsQueryVariables,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import useSetFocused from '../../../hooks/useSetFocused';
import getPageCount from '../../../utils/getPageCount';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { ENROLMENTS_PAGE_SIZE } from '../constants';
import {
  filterEnrolments,
  getEnrolmentFields,
  getEnrolmentSearchInitialValues,
} from '../utils';
import styles from './enrolmentsTable.module.scss';
import EnrolmentTableRow from './enrolmentsTableRow/EnrolmentsTableRow';

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
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const enrolmentListId = useIdWithPrefix({
    prefix: 'enrolment-attendee-list-',
  });

  const { enrolmentText, [pagePath]: page } = getEnrolmentSearchInitialValues(
    location.search
  );
  // const { id } = getRegistrationFields(registration, locale);
  // const { data: enrolmentsData, loading } = useEnrolmentsQuery({
  //   variables: {
  //     createPath: getPathBuilder(enrolmentsPathBuilder),
  //     registrations: [id],
  //     text: enrolmentText,
  //     ...enrolmentsVariables,
  //   },
  // });
  // const enrolments =
  //   (enrolmentsData?.enrolments as EnrolmentFieldsFragment[]) || [];

  const loading = !registration;
  const enrolments = filterEnrolments({
    enrolments: (registration?.signups ||
      /* istanbul ignore next */ []) as EnrolmentFieldsFragment[],
    query: {
      text: enrolmentText,
      ...enrolmentsVariables,
    },
  });

  const onPageChange = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();

    const pageNumber = index + 1;
    navigate({
      pathname: location.pathname,
      search: replaceParamsToRegistrationQueryString(location.search, {
        [pagePath]: pageNumber > 1 ? pageNumber : null,
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
              /* istanbul ignore next */
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
            pageHref={(index: number) => {
              return `${
                location.pathname
              }${replaceParamsToRegistrationQueryString(location.search, {
                [pagePath]: index > 1 ? index : null,
              })}`;
            }}
            pageIndex={page - 1}
            onChange={onPageChange}
          />
        )}
      </TableWrapper>
    </div>
  );
};

export default EnrolmentsTable;
