import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useEventQuery,
  useRegistrationQuery,
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import {
  isRegistrationPossible,
  registrationPathBuilder,
} from '../registration/utils';
import useUser from '../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from './constants';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import {
  checkCanUserDoAction,
  getEnrolmentDefaultInitialValues,
} from './utils';

type Props = {
  event: EventFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const CreateEnrolmentPage: React.FC<Props> = ({ event, registration }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    event.publisher as string
  );

  const initialValues = getEnrolmentDefaultInitialValues(registration);
  const formDisabled =
    !isRegistrationPossible(registration) ||
    !checkCanUserDoAction({
      action: ENROLMENT_ACTIONS.CREATE,
      organizationAncestors,
      publisher: event.publisher as string,
      user,
    });

  return (
    <PageWrapper title={`createEnrolmentPage.pageTitle`}>
      <MainContent>
        <Container contentWrapperClassName={styles.createContainer} withOffset>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              { label: t('registrationsPage.title'), to: ROUTES.REGISTRATIONS },
              {
                label: t(`editRegistrationPage.title`),
                to: ROUTES.EDIT_REGISTRATION.replace(
                  ':id',
                  registration.id as string
                ),
              },
              {
                label: t(`enrolmentsPage.title`),
                to: ROUTES.REGISTRATION_ENROLMENTS.replace(
                  ':registrationId',
                  registration.id as string
                ),
              },
              { active: true, label: t(`createEnrolmentPage.pageTitle`) },
            ]}
          />
        </Container>
        <EnrolmentForm
          disabled={formDisabled}
          event={event}
          initialValues={initialValues}
          registration={registration}
        />
      </MainContent>
    </PageWrapper>
  );
};

const CreateEnrolmentPageWrapper: React.FC = () => {
  const location = useLocation();
  const { registrationId } = useParams<{ registrationId: string }>();
  const { loading: loadingUser, user } = useUser();

  const { data: registrationData, loading: loadingRegistration } =
    useRegistrationQuery({
      skip: !registrationId || !user,
      variables: {
        id: registrationId as string,
        include: REGISTRATION_INCLUDES,
        createPath: getPathBuilder(registrationPathBuilder),
      },
    });

  const registration = registrationData?.registration;

  const { data: eventData, loading: loadingEvent } = useEventQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: loadingUser || !registration?.event,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
  });

  const event = eventData?.event;
  const loading = loadingUser || loadingRegistration || loadingEvent;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <CreateEnrolmentPage event={event} registration={registration} />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
