import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
} from '../../generated/graphql';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import { isRegistrationPossible } from '../registration/utils';
import useUser from '../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from './constants';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import useRegistrationAndEventData from './hooks/useRegistrationAndEventData';
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
    getValue(event.publisher, '')
  );

  const initialValues = getEnrolmentDefaultInitialValues(registration);
  const formDisabled =
    !isRegistrationPossible(registration) ||
    !checkCanUserDoAction({
      action: ENROLMENT_ACTIONS.CREATE,
      organizationAncestors,
      publisher: getValue(event.publisher, ''),
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
                  getValue(registration.id, '')
                ),
              },
              {
                label: t(`enrolmentsPage.title`),
                to: ROUTES.REGISTRATION_ENROLMENTS.replace(
                  ':registrationId',
                  getValue(registration.id, '')
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
  const { event, loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: true,
  });

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
