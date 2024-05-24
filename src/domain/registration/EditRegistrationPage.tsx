import React from 'react';
import { useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import NotFound from '../notFound/NotFound';
import useRegistrationAndEventData from '../signup/hooks/useRegistrationAndEventData';
import RegistrationForm from './registrationForm/RegistrationForm';
import styles from './registrationPage.module.scss';

const EditRegistrationPageWrapper: React.FC = () => {
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
            refetch={refetchRegistration}
            registration={registration}
          />
        </PageWrapper>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditRegistrationPageWrapper;
