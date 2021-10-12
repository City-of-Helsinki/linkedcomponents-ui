/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { Registration } from '../../generated/graphql';
import useIsMounted from '../../hooks/useIsMounted';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import NotFound from '../notFound/NotFound';
import AuthRequiredNotification from '../registration/authRequiredNotification/AuthRequiredNotification';
import RegistrationInfo from '../registration/registrationInfo/RegistrationInfo';
import { registrationsResponse } from '../registrations/__mocks__/registrationsPage';
import { getRegistrationFields } from '../registrations/utils';
import useUser from '../user/hooks/useUser';
import AttendeeList from './attendeeList/AttendeeList';
import ButtonPanel from './buttonPanel/ButtonPanel';
import styles from './enrolmentsPage.module.scss';
import FilterSummary from './filterSummary/FilterSummary';
import SearchPanel from './searchPanel/SearchPanel';
import { EnrolmentsLocationState } from './types';
import { getEnrolmentItemId, scrollToEnrolmentItem } from './utils';
import WaitingList from './waitingList/WaitingList';

interface EnrolmentsPageProps {
  registration: Registration;
}

const EnrolmentsPage: React.FC<EnrolmentsPageProps> = ({ registration }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation<EnrolmentsLocationState>();
  const history = useHistory();

  const { name } = getRegistrationFields(registration, locale);

  React.useEffect(() => {
    if (location.state?.enrolmentId) {
      scrollToEnrolmentItem(getEnrolmentItemId(location.state.enrolmentId));
      // Clear registrationId value to keep scroll position correctly
      const state = omit(location.state, 'enrolmentId');
      // location.search seems to reset if not added here (...location)
      history.replace({ ...location, state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      className={styles.enrolmentsPage}
      noFooter
      titleText={t('enrolmentsPage.pageTitle', { name })}
    >
      <MainContent>
        <Container
          contentWrapperClassName={styles.pageContentContainer}
          withOffset={true}
        >
          <AuthRequiredNotification />
          <RegistrationInfo registration={registration} />

          <SearchPanel registration={registration} />
          <FilterSummary />

          <AttendeeList registration={registration} />
          <WaitingList registration={registration} />
        </Container>
        <ButtonPanel registration={registration} />
      </MainContent>
    </PageWrapper>
  );
};

const LOADING_USER_DEBOUNCE_TIME = 50;

const EnrolmentsPageWrapper: React.FC = () => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { registrationId } = useParams<{ registrationId: string }>();
  // TODO: Use real registration data when API is available
  const registration = registrationsResponse.registrations.data.find(
    (item) => item.id === registrationId
  );

  const [debouncedLoadingUser, setDebouncedLoadingUser] =
    React.useState(loadingUser);

  const debouncedSetLoading = React.useMemo(
    () =>
      debounce((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setDebouncedLoadingUser(loading);
      }, LOADING_USER_DEBOUNCE_TIME),
    [isMounted]
  );

  const handleLoadingUserChange = React.useCallback(
    (loading: boolean) => {
      /* istanbul ignore next */
      debouncedSetLoading(loading);
    },
    [debouncedSetLoading]
  );

  React.useEffect(() => {
    handleLoadingUserChange(loadingUser);
  }, [handleLoadingUserChange, loadingUser]);

  const loading = debouncedLoadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <EnrolmentsPage registration={registration} />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EnrolmentsPageWrapper;
