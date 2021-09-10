import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

import FeedbackButton from '../../../common/components/feedbackButton/FeedbackButton';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventsQueryVariables, Registration } from '../../../generated/graphql';
import Container from '../../app/layout/Container';
import {
  getRegistrationItemId,
  scrollToRegistrationItem,
} from '../../registration/utils';
import { registrationsResponse } from '../__mocks__/registrationsPage';
import {
  DEFAULT_REGISTRATION_SORT,
  REGISTRATION_SORT_OPTIONS,
} from '../constants';
import useRegistrationSortOptions from '../hooks/useRegistrationSortOptions';
import RegistrationsTable from '../registrationsTable/RegistrationsTable';
import { RegistrationsLocationState } from '../types';
import styles from './registrationList.module.scss';

export interface EventListContainerProps {
  baseVariables: EventsQueryVariables;
}

export const testIds = {
  resultList: 'registration-result-list',
};

type RegistrationListProps = {
  registrations: Registration[];
  sort: REGISTRATION_SORT_OPTIONS;
};

const RegistrationList: React.FC<RegistrationListProps> = ({
  registrations,
  sort,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<RegistrationsLocationState>();
  const sortOptions = useRegistrationSortOptions();

  const getTableCaption = () => {
    return t(`registrationsPage.registrationsTableCaption`, {
      sort: sortOptions.find((option) => option.value === sort)?.label,
    });
  };

  React.useEffect(() => {
    if (location.state?.registrationId) {
      scrollToRegistrationItem(
        getRegistrationItemId(location.state.registrationId)
      );
      // Clear registrationId value to keep scroll position correctly
      const state = omit(location.state, 'registrationId');
      // location.search seems to reset if not added here (...location)
      history.replace({ ...location, state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.contentWrapperTable}>
      <Container withOffset={true}>
        <div className={styles.table}>
          <RegistrationsTable
            caption={getTableCaption()}
            registrations={registrations}
          />
        </div>
        <FeedbackButton theme="black" />
      </Container>
    </div>
  );
};

const RegistrationListContainer: React.FC = () => {
  const [registrationListId] = React.useState(() =>
    uniqueId('registration-list-')
  );
  const { t } = useTranslation();

  /* istanbul ignore next */
  const registrations = registrationsResponse?.registrations?.data || [];
  /* istanbul ignore next */
  const registrationsCount =
    registrationsResponse?.registrations?.meta.count || 0;

  return (
    <div
      id={registrationListId}
      className={styles.registrationList}
      data-testid={testIds.resultList}
    >
      <Container withOffset={true}>
        <span className={styles.count}>
          {t('registrationsPage.count', { count: registrationsCount })}
        </span>
      </Container>
      <LoadingSpinner isLoading={false}>
        <RegistrationList
          registrations={registrations}
          sort={DEFAULT_REGISTRATION_SORT}
        />
      </LoadingSpinner>
    </div>
  );
};

export default RegistrationListContainer;
