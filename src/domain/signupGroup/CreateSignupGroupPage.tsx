import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
import { isRegistrationPossible, isSignupEnded } from '../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../seatsReservation/utils';
import useRegistrationAndEventData from '../signup/hooks/useRegistrationAndEventData';
import SignupPageBreadcrumb from '../signup/signupPageBreadbrumb/SignupPageBreadcrumb';
import { SignupServerErrorsProvider } from '../signup/signupServerErrorsContext/SignupServerErrorsContext';
import useUser from '../user/hooks/useUser';
import { SIGNUP_GROUP_ACTIONS } from './constants';
import {
  checkCanUserDoSignupGroupAction,
  checkCanUserSignupAfterSignupIsEnded,
} from './permissions';
import SignupGroupForm from './signupGroupForm/SignupGroupForm';
import { SignupGroupFormProvider } from './signupGroupFormContext/SignupGroupFormContext';
import styles from './signupGroupPage.module.scss';
import SignupIsEnded from './signupIsEnded/SignupIsEnded';
import { getSignupGroupDefaultInitialValues } from './utils';

type Props = {
  event: EventFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const CreateSignupGroupPage: React.FC<Props> = ({ event, registration }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const initialValues = getSignupGroupDefaultInitialValues();

  const formDisabled = useMemo(() => {
    const data = getSeatsReservationData(registration.id as string);
    if (data && !isSeatsReservationExpired(data)) {
      return false;
    }

    return (
      !isRegistrationPossible({ organizationAncestors, registration, user }) ||
      !checkCanUserDoSignupGroupAction({
        action: SIGNUP_GROUP_ACTIONS.CREATE,
        organizationAncestors,
        registration,
        user,
      })
    );
  }, [organizationAncestors, registration, user]);

  return (
    <PageWrapper title={`createSignupGroupPage.pageTitle`}>
      <MainContent>
        <Container contentWrapperClassName={styles.createContainer} withOffset>
          <SignupPageBreadcrumb
            activeLabel={t(`createSignupGroupPage.pageTitle`)}
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
  const { event, loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: true,
  });
  const { loading: loadingUser, user } = useUser();
  const publisher = getValue(registration?.publisher, '');
  const { loading: loadingOrganizationAncestors, organizationAncestors } =
    useOrganizationAncestors(publisher);

  return (
    <LoadingSpinner
      isLoading={loading || loadingUser || loadingOrganizationAncestors}
    >
      {event && registration ? (
        <>
          {isSignupEnded(registration) &&
          !checkCanUserSignupAfterSignupIsEnded({
            organizationAncestors,
            registration,
            user,
          }) ? (
            <SignupIsEnded registration={registration} />
          ) : (
            <SignupGroupFormProvider registration={registration}>
              <SignupServerErrorsProvider>
                <CreateSignupGroupPage
                  event={event}
                  registration={registration}
                />
              </SignupServerErrorsProvider>
            </SignupGroupFormProvider>
          )}
        </>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default CreateSignupGroupPageWrapper;
