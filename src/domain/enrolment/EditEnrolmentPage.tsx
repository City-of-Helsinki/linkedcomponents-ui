import { ApolloQueryResult } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EnrolmentFieldsFragment,
  EnrolmentQuery,
  EnrolmentQueryVariables,
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useEnrolmentQuery,
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
import { registrationPathBuilder } from '../registration/utils';
import useUser from '../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from './constants';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import {
  checkCanUserDoAction,
  enrolmentPathBuilder,
  getEnrolmentInitialValues,
} from './utils';

type Props = {
  enrolment: EnrolmentFieldsFragment;
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<EnrolmentQueryVariables>
  ) => Promise<ApolloQueryResult<EnrolmentQuery>>;
  registration: RegistrationFieldsFragment;
};

const EditEnrolmentPage: React.FC<Props> = ({
  enrolment,
  event,
  refetch,
  registration,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    event.publisher as string
  );
  const isEditingAllowed = checkCanUserDoAction({
    action: ENROLMENT_ACTIONS.EDIT,
    organizationAncestors,
    publisher: event.publisher as string,
    user,
  });

  const initialValues = React.useMemo(
    () => getEnrolmentInitialValues(enrolment, registration),
    [enrolment, registration]
  );

  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      noFooter
      title={`editEnrolmentPage.pageTitle`}
    >
      <MainContent>
        <Container
          contentWrapperClassName={styles.breadcrumbContainer}
          withOffset
        >
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
              { active: true, label: t(`editEnrolmentPage.pageTitle`) },
            ]}
          />
        </Container>
        <EnrolmentForm
          disabled={!isEditingAllowed}
          enrolment={enrolment}
          event={event}
          initialValues={initialValues}
          refetchEnrolment={refetch}
          registration={registration}
        />
      </MainContent>
    </PageWrapper>
  );
};

const EditEnrolmentPageWrapper: React.FC = () => {
  const location = useLocation();
  const { loading: loadingUser, user } = useUser();
  const { enrolmentId, registrationId } = useParams<{
    enrolmentId: string;
    registrationId: string;
  }>();

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

  const {
    data: enrolmentData,
    loading: loadingEnrolment,
    refetch,
  } = useEnrolmentQuery({
    skip: !enrolmentId || !user,
    variables: {
      id: enrolmentId as string,
      createPath: getPathBuilder(enrolmentPathBuilder),
    },
  });

  const enrolment = enrolmentData?.enrolment;
  const event = eventData?.event;
  const loading =
    loadingUser || loadingRegistration || loadingEvent || loadingEnrolment;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration && enrolment ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <EditEnrolmentPage
              enrolment={enrolment}
              event={event}
              refetch={refetch}
              registration={registration}
            />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditEnrolmentPageWrapper;
