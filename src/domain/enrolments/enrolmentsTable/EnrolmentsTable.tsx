import omit from 'lodash/omit';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Pagination from '../../../common/components/pagination/Pagination';
import Table from '../../../common/components/table/Table';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import {
  EnrolmentFieldsFragment,
  EnrolmentsQueryVariables,
  RegistrationFieldsFragment,
  useEnrolmentsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getPageCount from '../../../utils/getPageCount';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import skipFalsyType from '../../../utils/skipFalsyType';
import { ENROLMENTS_PAGE_SIZE } from '../constants';
import EnrolmentActionsDropdown from '../enrolmentActionsDropdown/EnrolmentActionsDropdown';
import { EnrolmentsLocationState } from '../types';
import {
  enrolmentsPathBuilder,
  getEnrolmentFields,
  getEnrolmentItemId,
  getEnrolmentSearchInitialValues,
} from '../utils';
import styles from './enrolmentsTable.module.scss';

type ColumnProps = {
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const NameColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const language = useLocale();
  const { fullName } = getEnrolmentFields({
    enrolment,
    language,
    registration,
  });

  return (
    <div className={styles.nameWrapper}>
      <span className={styles.enrolmentName} title={fullName}>
        {fullName}
      </span>
    </div>
  );
};

const EmailColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const language = useLocale();
  const { email } = getEnrolmentFields({ enrolment, language, registration });

  return <>{getValue(email, '-')}</>;
};

const PhoneColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const language = useLocale();
  const { phoneNumber } = getEnrolmentFields({
    enrolment,
    language,
    registration,
  });

  return <>{getValue(phoneNumber, '-')}</>;
};

const AttendeeStatusColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const { t } = useTranslation();
  const language = useLocale();
  const { attendeeStatus } = getEnrolmentFields({
    enrolment,
    language,
    registration,
  });

  return <>{t(`enrolment.attendeeStatus.${attendeeStatus}`)}</>;
};

export interface EnrolmentsTableProps {
  caption: string;
  enrolmentsVariables: Partial<EnrolmentsQueryVariables>;
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

  const { data: enrolmentsData, loading } = useEnrolmentsQuery({
    variables: {
      ...enrolmentsVariables,
      registration: [getValue(registration.id, '')],
      text: enrolmentText,
      createPath: getPathBuilder(enrolmentsPathBuilder),
    },
  });

  const enrolments = getValue(enrolmentsData?.enrolments.data, []).filter(
    skipFalsyType
  );

  const enrolmentCount = enrolments.length;
  const pageCount = getPageCount(enrolmentCount, ENROLMENTS_PAGE_SIZE);

  const paginatedEnrolments = enrolments.slice(
    (page - 1) * ENROLMENTS_PAGE_SIZE,
    page * ENROLMENTS_PAGE_SIZE
  );
  const { onPageChange, pageHref } = useCommonListProps({
    defaultSort: '',
    listId: enrolmentListId,
    meta: undefined,
    pagePath,
    pageSize: ENROLMENTS_PAGE_SIZE,
  });

  const handleRowClick = (enrolment: object) => {
    const { enrolmentUrl } = getEnrolmentFields({
      enrolment: enrolment as EnrolmentFieldsFragment,
      language: locale,
      registration,
    });
    navigate({ pathname: enrolmentUrl, search: queryStringWithReturnPath });
  };

  React.useEffect(() => {
    const locationState = location.state as EnrolmentsLocationState;
    if (
      locationState?.enrolmentId &&
      paginatedEnrolments.find((item) => item?.id === locationState.enrolmentId)
    ) {
      scrollToItem(getEnrolmentItemId(locationState.enrolmentId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(locationState, 'enrolmentId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolmentsData]);

  const MemoizedNameColumn = React.useCallback(
    (enrolment: EnrolmentFieldsFragment) => (
      <NameColumn enrolment={enrolment} registration={registration} />
    ),
    [registration]
  );

  const MemoizedEmailColumn = React.useCallback(
    (enrolment: EnrolmentFieldsFragment) => (
      <EmailColumn enrolment={enrolment} registration={registration} />
    ),
    [registration]
  );

  const MemoizedPhoneColumn = React.useCallback(
    (enrolment: EnrolmentFieldsFragment) => (
      <PhoneColumn enrolment={enrolment} registration={registration} />
    ),
    [registration]
  );

  const MemoizedAttendeeStatueColumn = React.useCallback(
    (enrolment: EnrolmentFieldsFragment) => (
      <AttendeeStatusColumn enrolment={enrolment} registration={registration} />
    ),
    [registration]
  );

  const MemoizedEnrolmentActionsDropdown = React.useCallback(
    (enrolment: EnrolmentFieldsFragment) => (
      <EnrolmentActionsDropdown
        enrolment={enrolment}
        registration={registration}
      />
    ),
    [registration]
  );

  return (
    <div id={enrolmentListId}>
      <h2 className={styles.heading}>{heading}</h2>

      <TableWrapper>
        <Table
          caption={caption}
          className={styles.enrolmentsTable}
          cols={[
            {
              className: styles.nameColumn,
              key: 'name',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.name'),
              transform: MemoizedNameColumn,
            },
            {
              className: styles.emailColumn,
              key: 'email',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.email'),
              transform: MemoizedEmailColumn,
            },
            {
              className: styles.phoneColumn,
              key: 'phone',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.phone'),
              transform: MemoizedPhoneColumn,
            },
            {
              className: styles.statusColumn,
              key: 'status',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.status'),
              transform: MemoizedAttendeeStatueColumn,
            },
            {
              className: styles.actionButtonsColumn,
              key: 'actionButtons',
              headerName: '',
              onClick: (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
              },
              transform: MemoizedEnrolmentActionsDropdown,
            },
          ]}
          getRowProps={(enrolment) => {
            const { id, fullName } = getEnrolmentFields({
              enrolment: enrolment as EnrolmentFieldsFragment,
              language: locale,
              registration,
            });

            return {
              'aria-label': fullName,
              'data-testid': id,
              id: getEnrolmentItemId(id),
            };
          }}
          indexKey="id"
          loading={loading}
          onRowClick={handleRowClick}
          rows={paginatedEnrolments}
          variant="light"
        />

        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            pageHref={pageHref}
            pageIndex={page - 1}
            onChange={onPageChange}
          />
        )}
      </TableWrapper>
    </div>
  );
};

export default EnrolmentsTable;
