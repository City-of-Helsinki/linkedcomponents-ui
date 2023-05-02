import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
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
import EnrolmentPageBreadcrumb from './enrolmentPageBreadbrumb/EnrolmentPageBreadcrumb';
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
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const initialValues = getEnrolmentDefaultInitialValues(registration);
  const formDisabled =
    !isRegistrationPossible(registration) ||
    !checkCanUserDoAction({
      action: ENROLMENT_ACTIONS.CREATE,
      organizationAncestors,
      publisher,
      user,
    });

  return (
    <PageWrapper title={`createEnrolmentPage.pageTitle`}>
      <MainContent>
        <Container contentWrapperClassName={styles.createContainer} withOffset>
          <EnrolmentPageBreadcrumb
            activeLabel={t(`createEnrolmentPage.pageTitle`)}
            registration={registration}
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
