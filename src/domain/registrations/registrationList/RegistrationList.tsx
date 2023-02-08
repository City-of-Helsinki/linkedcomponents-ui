import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { scroller } from 'react-scroll';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Pagination from '../../../common/components/pagination/Pagination';
import TableWrapper from '../../../common/components/table/tableWrapper/TableWrapper';
import { testIds } from '../../../constants';
import {
  EventsQueryVariables,
  RegistrationsQuery,
  useRegistrationsQuery,
} from '../../../generated/graphql';
import useIdWithPrefix from '../../../hooks/useIdWithPrefix';
import getPageCount from '../../../utils/getPageCount';
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
  replaceParamsToRegistrationQueryString,
} from '../utils';
import styles from './registrationList.module.scss';

export interface EventListContainerProps {
  baseVariables: EventsQueryVariables;
}

type RegistrationListProps = {
  onPageChange: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
  page: number;
  pageCount: number;
  registrations: RegistrationsQuery['registrations']['data'];
  sort: REGISTRATION_SORT_OPTIONS;
};

const RegistrationList: React.FC<RegistrationListProps> = ({
  onPageChange,
  page,
  pageCount,
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
        <TableWrapper className={styles.tableWrapper}>
          <RegistrationsTable
            caption={getTableCaption()}
            registrations={registrations}
          />
        </TableWrapper>
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            pageHref={(index: number) => {
              return `${
                location.pathname
              }${replaceParamsToRegistrationQueryString(location.search, {
                page: index > 1 ? index : null,
              })}`;
            }}
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
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { page } = getRegistrationSearchInitialValues(location.search);

  const registrationListId = useIdWithPrefix({ prefix: 'registration-list-' });

  const handlePageChange = (
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
        page: pageNumber > 1 ? pageNumber : null,
      }),
    });
    // Scroll to the beginning of registration list
    scroller.scrollTo(registrationListId, { offset: -100 });
  };

  const { data: registrationsData, loading } = useRegistrationsQuery({
    variables: getRegistrationsQueryVariables(location.search),
  });

  const registrations = getValue(registrationsData?.registrations?.data, []);
  /* istanbul ignore next */
  const registrationsCount = registrationsData?.registrations?.meta.count || 0;
  const pageCount = getPageCount(registrationsCount, REGISTRATIONS_PAGE_SIZE);

  return (
    <div
      id={registrationListId}
      className={styles.registrationList}
      data-testid={testIds.registrationList.resultList}
    >
      <Container withOffset={true}>
        <span className={styles.count}>
          {t('registrationsPage.count', { count: registrationsCount })}
        </span>
      </Container>
      <LoadingSpinner isLoading={loading}>
        <RegistrationList
          onPageChange={handlePageChange}
          page={page}
          pageCount={pageCount}
          registrations={registrations}
          sort={DEFAULT_REGISTRATION_SORT}
        />
      </LoadingSpinner>
    </div>
  );
};

export default RegistrationListContainer;
