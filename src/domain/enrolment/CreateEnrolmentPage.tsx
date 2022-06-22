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
import EnrolmentPageContext, {
  useEnrolmentPageContextValue,
} from './enrolmentPageContext/EnrolmentPageContext';
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
        <Container
          contentWrapperClassName={styles.breadcrumbContainer}
          withOffset
        >
          <Breadcrumb>
            <Breadcrumb.Item to={ROUTES.HOME}>
              {t('common.home')}
            </Breadcrumb.Item>
            <Breadcrumb.Item to={ROUTES.REGISTRATIONS}>
              {t('registrationsPage.title')}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              to={ROUTES.EDIT_REGISTRATION.replace(
                ':id',
                registration.id as string
              )}
            >
              {t(`editRegistrationPage.title`)}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              to={ROUTES.REGISTRATION_ENROLMENTS.replace(
                ':registrationId',
                registration.id as string
              )}
            >
              {t(`enrolmentsPage.title`)}
            </Breadcrumb.Item>
            <Breadcrumb.Item active={true}>
              {t(`createEnrolmentPage.pageTitle`)}
            </Breadcrumb.Item>
          </Breadcrumb>
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

  const { openParticipant, setOpenParticipant, toggleOpenParticipant } =
    useEnrolmentPageContextValue();

  const event = eventData?.event;
  const loading = loadingUser || loadingRegistration || loadingEvent;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration ? (
        <EnrolmentPageContext.Provider
          value={{ openParticipant, setOpenParticipant, toggleOpenParticipant }}
        >
          <CreateEnrolmentPage event={event} registration={registration} />
        </EnrolmentPageContext.Provider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
