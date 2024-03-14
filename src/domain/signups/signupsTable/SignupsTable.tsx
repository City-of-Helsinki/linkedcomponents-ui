import omit from 'lodash/omit';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import Table from '../../../common/components/table/Table';
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
  const { fullName, id, signupGroupUrl, signupUrl } = getSignupFields({
    language,
    registration,
    signup,
  });

  return (
    <div className={styles.nameWrapper}>
      <Link
        className={styles.signupName}
        id={getSignupItemId(id)}
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

const PhoneColumn: FC<ColumnProps> = ({ registration, signup }) => {
  const language = useLocale();
  const { phoneNumber } = getSignupFields({
    language,
    registration,
    signup,
  });

  return getValue(phoneNumber, '-');
};

const ContactPersonEmailColumn: FC<ColumnProps> = ({
  registration,
  signup,
}) => {
  const language = useLocale();
  const { contactPersonEmail, signupGroup } = getSignupFields({
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
        signupGroupData?.signupGroup.contactPerson?.email ?? contactPersonEmail,
        '-'
      )}
    </LoadingSpinner>
  );
};

const ContactPersonPhoneColumn: FC<ColumnProps> = ({
  registration,
  signup,
}) => {
  const language = useLocale();
  const { contactPersonPhoneNumber, signupGroup } = getSignupFields({
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
        signupGroupData?.signupGroup.contactPerson?.phoneNumber ??
          contactPersonPhoneNumber,
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
    meta: signupsData?.signups?.meta,
    pagePath,
    pageSize: SIGNUPS_PAGE_SIZE,
  });

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

  const MemoizedPhoneColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <PhoneColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedContactPersonEmailColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <ContactPersonEmailColumn signup={signup} registration={registration} />
    ),
    [registration]
  );

  const MemoizedContactPersonPhoneColumn = React.useCallback(
    (signup: SignupFieldsFragment) => (
      <ContactPersonPhoneColumn signup={signup} registration={registration} />
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

      <Table
        caption={caption}
        cols={[
          {
            key: 'name',
            headerName: t('signupsPage.signupsTableColumns.name'),
            transform: MemoizedNameColumn,
          },
          {
            key: 'phone',
            headerName: t('signupsPage.signupsTableColumns.phoneNumber'),
            transform: MemoizedPhoneColumn,
          },
          {
            key: 'contactPersonEmail',
            headerName: t('signupsPage.signupsTableColumns.contactPersonEmail'),
            transform: MemoizedContactPersonEmailColumn,
          },
          {
            key: 'contactPersonPhone',
            headerName: t(
              'signupsPage.signupsTableColumns.contactPersonPhoneNumber'
            ),
            transform: MemoizedContactPersonPhoneColumn,
          },
          {
            key: 'status',
            headerName: t('signupsPage.signupsTableColumns.status'),
            transform: MemoizedAttendeeStatusColumn,
          },
          {
            key: 'actionButtons',
            headerName: t('common.actions'),
            transform: MemoizedSignupActionsDropdown,
          },
        ]}
        hasActionButtons
        indexKey="id"
        loading={loading}
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
    </div>
  );
};

export default SignupsTable;
