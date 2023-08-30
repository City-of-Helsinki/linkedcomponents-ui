import React, { useMemo } from 'react';
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
import { ENROLMENT_ACTIONS } from '../enrolment/constants';
import EnrolmentPageBreadcrumb from '../enrolment/enrolmentPageBreadbrumb/EnrolmentPageBreadcrumb';
import { EnrolmentPageProvider } from '../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from '../enrolment/enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import useRegistrationAndEventData from '../enrolment/hooks/useRegistrationAndEventData';
import {
  checkCanUserDoAction,
  getSignupGroupDefaultInitialValues,
} from '../enrolment/utils';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import { isRegistrationPossible } from '../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../reserveSeats/utils';
import useUser from '../user/hooks/useUser';
import SignupGroupForm from './signupGroupForm/SignupGroupForm';
import styles from './signupGroupPage.module.scss';

type Props = {
  event: EventFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const CreateSignupGroupPage: React.FC<Props> = ({ event, registration }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const initialValues = getSignupGroupDefaultInitialValues(registration);

  const formDisabled = useMemo(() => {
    const data = getSeatsReservationData(registration.id as string);
    if (data && !isSeatsReservationExpired(data)) {
      return false;
    }

    return (
      !isRegistrationPossible(registration) ||
      !checkCanUserDoAction({
        action: ENROLMENT_ACTIONS.CREATE,
        organizationAncestors,
        publisher,
        user,
      })
    );
  }, [organizationAncestors, publisher, registration, user]);

  return (
    <PageWrapper title={`createSignupGroupPage.pageTitle`}>
      <MainContent>
        <Container contentWrapperClassName={styles.createContainer} withOffset>
          <EnrolmentPageBreadcrumb
            activeLabel={t(`createEnrolmentPage.pageTitle`)}
            registration={registration}
          />
        </Container>
        <SignupGroupForm
          disabled={formDisabled}
          event={event}
          initialValues={initialValues}
          registration={registration}
        />
      </MainContent>
    </PageWrapper>
  );
};

const CreateSignupGroupPageWrapper: React.FC = () => {
  const location = useLocation();
  const { event, loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: true,
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <CreateSignupGroupPage event={event} registration={registration} />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default CreateSignupGroupPageWrapper;
