import React from 'react';
import { useLocation, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import useRegistrationAndEventData from '../enrolment/hooks/useRegistrationAndEventData';
import NotFound from '../notFound/NotFound';
import RegistrationForm from './registrationForm/RegistrationForm';
import styles from './registrationPage.module.scss';

const EditRegistrationPageWrapper: React.FC = () => {
  const location = useLocation();
  const { id: registrationId } = useParams<{ id: string }>();
  const { event, loading, refetchRegistration, registration } =
    useRegistrationAndEventData({
      overrideEventQueryOptions: {},
      registrationId,
      shouldFetchEvent: true,
    });

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration ? (
        <PageWrapper
          backgroundColor="coatOfArms"
          className={styles.registrationPage}
          noFooter
          title={'editRegistrationPage.title'}
        >
          <RegistrationForm
            event={event}
            refetch={refetchRegistration}
            registration={registration}
          />
        </PageWrapper>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditRegistrationPageWrapper;
