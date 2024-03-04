import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import { testIds } from '../../../constants';
import {
  EventsQueryVariables,
  RegistrationsQuery,
  useRegistrationsQuery,
} from '../../../generated/graphql';
import useCommonListProps from '../../../hooks/useCommonListProps';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import { CommonListProps } from '../../../types';
import getValue from '../../../utils/getValue';
import { scrollToItem } from '../../../utils/scrollToItem';
import Container from '../../app/layout/container/Container';
import { getRegistrationItemId } from '../../registration/utils';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_SORT_OPTIONS,
  REGISTRATIONS_PAGE_SIZE,
} from '../constants';
import useRegistrationSortOptions from '../hooks/useRegistrationSortOptions';
import RegistrationsTable from '../registrationsTable/RegistrationsTable';
import { RegistrationsLocationState } from '../types';
import {
  getRegistrationSearchInitialValues,
  getRegistrationsQueryVariables,
} from '../utils';
import styles from './registrationList.module.scss';

export interface EventListContainerProps {
  baseVariables: EventsQueryVariables;
}

type RegistrationListProps = {
  page: number;
  registrations: RegistrationsQuery['registrations']['data'];
  sort: REGISTRATION_SORT_OPTIONS;
} & CommonListProps;

const RegistrationList: React.FC<RegistrationListProps> = ({
  onPageChange,
  page,
  pageCount,
  pageHref,
  registrations,
  sort,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sortOptions = useRegistrationSortOptions();

  const getTableCaption = () => {
    return t(`registrationsPage.registrationsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    const locationState = location.state as RegistrationsLocationState;
    if (locationState?.registrationId) {
      scrollToItem(getRegistrationItemId(locationState.registrationId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(locationState, 'registrationId');
      // location.search seems to reset if not added here (...location)
      navigate(location, { state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.contentWrapperTable}>
      <Container withOffset={true}>
        <RegistrationsTable
          caption={getTableCaption()}
          registrations={registrations}
        />
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            pageHref={pageHref}
            pageIndex={page - 1}
            onChange={onPageChange}
          />
        )}

        <FeedbackButton theme="black" />
      </Container>
    </div>
  );
};

const RegistrationListContainer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { page } = getRegistrationSearchInitialValues(location.search);
  const registrationListId = useIdWithPrefix({ prefix: 'registration-list-' });

  const { data: registrationsData, loading } = useRegistrationsQuery({
    variables: getRegistrationsQueryVariables(location.search),
  });

  const registrations = getValue(registrationsData?.registrations?.data, []);
  const { count, ...listProps } = useCommonListProps({
    defaultSort: DEFAULT_REGISTRATION_SORT,
    listId: registrationListId,
    meta: registrationsData?.registrations.meta,
    pageSize: REGISTRATIONS_PAGE_SIZE,
  });

  return (
    <div
      id={registrationListId}
      className={styles.registrationList}
      data-testid={testIds.registrationList.resultList}
    >
      <Container withOffset={true}>
        <span className={styles.count}>
          {t('registrationsPage.count', { count })}
        </span>
      </Container>
      <LoadingSpinner isLoading={loading}>
        <RegistrationList
          page={page}
          registrations={registrations}
          sort={DEFAULT_REGISTRATION_SORT}
          {...listProps}
        />
      </LoadingSpinner>
    </div>
  );
};

export default RegistrationListContainer;
