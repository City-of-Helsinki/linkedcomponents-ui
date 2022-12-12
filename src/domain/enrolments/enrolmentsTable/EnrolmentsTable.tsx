import omit from 'lodash/omit';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import Pagination from '../../../common/components/pagination/Pagination';
import Table from '../../../common/components/table/Table2';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import {
  EnrolmentFieldsFragment,
  EnrolmentsQueryVariables,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getPageCount from '../../../utils/getPageCount';
import { scrollToItem } from '../../../utils/scrollToItem';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { ENROLMENTS_PAGE_SIZE } from '../constants';
import EnrolmentActionsDropdown from '../enrolmentActionsDropdown/EnrolmentActionsDropdown';
import { EnrolmentsLocationState } from '../types';
import {
  filterEnrolments,
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
  const { name } = getEnrolmentFields({ enrolment, language, registration });

  return (
    <div className={styles.nameWrapper}>
      <span className={styles.enrolmentName} title={name}>
        {name}
      </span>
    </div>
  );
};

const EmailColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const language = useLocale();
  const { email } = getEnrolmentFields({ enrolment, language, registration });

  return <>{email || /* istanbul ignore next */ '-'}</>;
};

const PhoneColumn: FC<ColumnProps> = ({ enrolment, registration }) => {
  const language = useLocale();
  const { phoneNumber } = getEnrolmentFields({
    enrolment,
    language,
    registration,
  });

  return <>{phoneNumber || /* istanbul ignore next */ '-'}</>;
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
      paginatedEnrolments.find((item) => item.id === locationState.enrolmentId)
    ) {
      scrollToItem(getEnrolmentItemId(locationState.enrolmentId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(locationState, 'enrolmentId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              transform: (enrolment: EnrolmentFieldsFragment) => (
                <NameColumn enrolment={enrolment} registration={registration} />
              ),
            },
            {
              className: styles.emailColumn,
              key: 'email',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.email'),
              transform: (enrolment: EnrolmentFieldsFragment) => (
                <EmailColumn
                  enrolment={enrolment}
                  registration={registration}
                />
              ),
            },
            {
              className: styles.phoneColumn,
              key: 'phone',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.phone'),
              transform: (enrolment: EnrolmentFieldsFragment) => (
                <PhoneColumn
                  enrolment={enrolment}
                  registration={registration}
                />
              ),
            },
            {
              className: styles.statusColumn,
              key: 'status',
              headerName: t('enrolmentsPage.enrolmentsTableColumns.status'),
              transform: (enrolment: EnrolmentFieldsFragment) => (
                <AttendeeStatusColumn
                  enrolment={enrolment}
                  registration={registration}
                />
              ),
            },
            {
              className: styles.actionButtonsColumn,
              key: 'actionButtons',
              headerName: '',
              onClick: (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
              },
              transform: (enrolment: EnrolmentFieldsFragment) => (
                <EnrolmentActionsDropdown
                  enrolment={enrolment}
                  registration={registration}
                />
              ),
            },
          ]}
          getRowProps={(enrolment) => {
            const { id, name } = getEnrolmentFields({
              enrolment: enrolment as EnrolmentFieldsFragment,
              language: locale,
              registration,
            });

            return {
              'aria-label': name,
              'data-testid': id,
              id: getEnrolmentItemId(id),
            };
          }}
          indexKey="id"
          onRowClick={handleRowClick}
          rows={paginatedEnrolments as EnrolmentFieldsFragment[]}
          variant="light"
        />

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
