import React from 'react';
import { useLocation, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery, useRegistrationQuery } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import { REGISTRATION_INCLUDES } from './constants';
import RegistrationForm from './registrationForm/RegistrationForm';
import styles from './registrationPage.module.scss';
import { registrationPathBuilder } from './utils';

const EditRegistrationPageWrapper: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { loading: loadingUser, user } = useUser();

  const {
    data: registrationData,
    loading: loadingRegistration,
    refetch,
  } = useRegistrationQuery({
    skip: !id || !user,
    variables: {
      id: id as string,
      include: REGISTRATION_INCLUDES,
      createPath: getPathBuilder(registrationPathBuilder),
    },
  });
  const registration = registrationData?.registration;

  const { data: eventData, loading: loadingEvent } = useEventQuery({
    skip: !registration?.event,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
  });

  const event = eventData?.event;
  const loading = loadingEvent || loadingRegistration || loadingUser;

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
            refetch={refetch}
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
