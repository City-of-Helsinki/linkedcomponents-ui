import omit from 'lodash/omit';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import Table from '../../../common/components/table/Table';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupsQueryVariables,
  useSignupGroupQuery,
  useSignupsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import useLocale from '../../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../../hooks/useQueryStringWithReturnPath';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import skipFalsyType from '../../../utils/skipFalsyType';
import { SIGNUPS_PAGE_SIZE } from '../constants';
import SignupActionsDropdown from '../signupActionsDropdown/SignupActionsDropdown';
import { SignupsLocationState } from '../types';
import {
  getSignupFields,
  getSignupItemId,
  getSignupSearchInitialValues,
  signupsPathBuilder,
} from '../utils';
import styles from './signupsTable.module.scss';

type ColumnProps = {
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
};

const NameColumn: FC<ColumnProps> = ({ registration, signup }) => {
  const language = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { fullName, signupGroupUrl, signupUrl } = getSignupFields({
    language,
    registration,
    signup,
  });

  return (
    <div className={styles.nameWrapper}>
      <Link
        className={styles.signupName}
        title={fullName}
        to={{
          pathname: signupGroupUrl ?? signupUrl,
          search: queryStringWithReturnPath,
        }}
      >
        {fullName}
      </Link>
    </div>
  );
};

const EmailColumn: FC<ColumnProps> = ({ registration, signup }) => {
  const language = useLocale();
  const { email, signupGroup } = getSignupFields({
    language,
    registration,
    signup,
  });

  const { data: signupGroupData, loading } = useSignupGroupQuery({
    skip: !signupGroup,
    variables: { id: signupGroup as string },
  });

  return (
    <LoadingSpinner
      className={styles.columnLoadingSpinner}
      isLoading={loading}
      small
    >
      {getValue(
        signupGroupData?.signupGroup.contactPerson?.email ?? email,
        '-'
      )}
    </LoadingSpinner>
  );
};

const PhoneColumn: FC<ColumnProps> = ({ registration, signup }) => {
  const language = useLocale();
  const { phoneNumber, signupGroup } = getSignupFields({
    language,
    registration,
    signup,
  });
  const { data: signupGroupData, loading } = useSignupGroupQuery({
    skip: !signupGroup,
    variables: { id: signupGroup as string },
  });

  return (
    <LoadingSpinner
      className={styles.columnLoadingSpinner}
      isLoading={loading}
      small
    >
      {getValue(
        signupGroupData?.signupGroup.contactPerson?.phoneNumber ?? phoneNumber,
        '-'
      )}
    </LoadingSpinner>
  );
};

const AttendeeStatusColumn: FC<ColumnProps> = ({ registration, signup }) => {
  const { t } = useTranslation();
  const language = useLocale();
  const { attendeeStatus } = getSignupFields({
    language,
    registration,
    signup,
  });

  return <>{t(`signup.attendeeStatus.${attendeeStatus}`)}</>;
};

export interface SignupsTableProps {
  caption: string;
  heading: string;
  pagePath: 'attendeePage' | 'waitingPage';
  registration: RegistrationFieldsFragment;
  signupsVariables: Partial<SignupsQueryVariables>;
}

const SignupsTable: React.FC<SignupsTableProps> = ({
  caption,
  heading,
  pagePath,
  registration,
  signupsVariables,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();

  const signupListId = useIdWithPrefix({
    prefix: 'signup-attendee-list-',
  });

  const { signupText, [pagePath]: page } = getSignupSearchInitialValues(
    location.search
  );

  const { data: signupsData, loading } = useSignupsQuery({
    variables: {
      ...signupsVariables,
      page,
      pageSize: SIGNUPS_PAGE_SIZE,
      registration: [getValue(registration.id, '')],
      text: signupText,
      createPath: getPathBuilder(signupsPathBuilder),
    },
  });

  const signups = getValue(signupsData?.signups.data, []).filter(skipFalsyType);

  const { onPageChange, pageCount, pageHref } = useCommonListProps({
    defaultSort: '',
    listId: signupListId,
    meta: signupsData?.signups.meta,
    pagePath,
    pageSize: SIGNUPS_PAGE_SIZE,
  });

  const handleRowClick = (signup: object) => {
    const { signupUrl, signupGroupUrl } = getSignupFields({
      language: locale,
      registration,
      signup: signup as SignupFieldsFragment,
    });
    navigate({
      pathname: signupGroupUrl || signupUrl,
      search: queryStringWithReturnPath,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as SignupsLocationState;
    if (
      locationState?.signupId &&
      signups.find((item) => item?.id === locationState.signupId)
    ) {
      scrollToItem(getSignupItemId(locationState.signupId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(locationState, 'signupId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupsData]);

  const MemoizedNameColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <NameColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedEmailColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <EmailColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedPhoneColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <PhoneColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedAttendeeStatusColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <AttendeeStatusColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedSignupActionsDropdown = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <SignupActionsDropdown registration={registration} signup={signup} />
    ),
    [registration]
  );

  return (
    <div id={signupListId}>
      <h2 className={styles.heading}>{heading}</h2>

      <TableWrapper>
        <Table
          caption={caption}
          className={styles.signupsTable}
          cols={[
            {
              className: styles.nameColumn,
              key: 'name',
              headerName: t('signupsPage.signupsTableColumns.name'),
              onClick: (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
              },
              transform: MemoizedNameColumn,
            },
            {
              className: styles.emailColumn,
              key: 'email',
              headerName: t('signupsPage.signupsTableColumns.email'),
              transform: MemoizedEmailColumn,
            },
            {
              className: styles.phoneColumn,
              key: 'phone',
              headerName: t('signupsPage.signupsTableColumns.phone'),
              transform: MemoizedPhoneColumn,
            },
            {
              className: styles.statusColumn,
              key: 'status',
              headerName: t('signupsPage.signupsTableColumns.status'),
              transform: MemoizedAttendeeStatusColumn,
            },
            {
              className: styles.actionButtonsColumn,
              key: 'actionButtons',
              headerName: '',
              onClick: (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
              },
              transform: MemoizedSignupActionsDropdown,
            },
          ]}
          getRowProps={(signup) => {
            const { id, fullName } = getSignupFields({
              language: locale,
              registration,
              signup: signup as SignupFieldsFragment,
            });

            return {
              'aria-label': fullName,
              'data-testid': id,
              id: getSignupItemId(id),
            };
          }}
          indexKey="id"
          loading={loading}
          onRowClick={handleRowClick}
          rows={signups}
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

export default SignupsTable;
