import { ApolloQueryResult } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupQuery,
  SignupQueryVariables,
  useSignupGroupQuery,
  useSignupQuery,
} from '../../generated/graphql';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useRegistrationAndEventData from '../signup/hooks/useRegistrationAndEventData';
import SignupPageBreadcrumb from '../signup/signupPageBreadbrumb/SignupPageBreadcrumb';
import { SignupServerErrorsProvider } from '../signup/signupServerErrorsContext/SignupServerErrorsContext';
import SignupGroupForm from '../signupGroup/signupGroupForm/SignupGroupForm';
import { SignupGroupFormProvider } from '../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import styles from '../signupGroup/signupGroupPage.module.scss';
import useUser from '../user/hooks/useUser';
import { SIGNUP_ACTIONS } from './constants';
import { checkCanUserDoSignupAction } from './permissions';
import { getSignupGroupInitialValuesFromSignup } from './utils';

type Props = {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<SignupQueryVariables>
  ) => Promise<ApolloQueryResult<SignupQuery>>;
  registration: RegistrationFieldsFragment;
  signup: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
};

const EditSignupPage: React.FC<Props> = ({
  event,
  refetch,
  registration,
  signup,
  signupGroup,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const isEditingAllowed = checkCanUserDoSignupAction({
    action: SIGNUP_ACTIONS.UPDATE,
    organizationAncestors,
    publisher,
    user,
  });

  const initialValues = React.useMemo(
    () => getSignupGroupInitialValuesFromSignup(signup, signupGroup),
    [signup, signupGroup]
  );

  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      noFooter
      title={`editSignupPage.pageTitle`}
    >
      <MainContent>
        <Container
          contentWrapperClassName={styles.breadcrumbContainer}
          withOffset
        >
          <SignupPageBreadcrumb
            activeLabel={t(`editSignupPage.pageTitle`)}
            registration={registration}
          />
        </Container>
        <SignupGroupForm
          contactPersonFieldsDisabled={!!signup.signupGroup}
          disabled={!isEditingAllowed}
          event={event}
          initialValues={initialValues}
          refetchSignup={refetch}
          registration={registration}
          signup={signup}
        />
      </MainContent>
    </PageWrapper>
  );
};

const EditSignupPageWrapper: React.FC = () => {
  const location = useLocation();
  const { signupId } = useParams<{ signupId: string }>();
  const { user } = useUser();

  const {
    event,
    loading: loadingRegistrationAndEvent,
    registration,
  } = useRegistrationAndEventData({ shouldFetchEvent: true });

  const {
    data: signupData,
    loading: loadingSignup,
    refetch,
  } = useSignupQuery({
    skip: !signupId || !user,
    variables: { id: getValue(signupId, '') },
  });

  const { data: signupGroupData, loading: loadingSignupGroup } =
    useSignupGroupQuery({
      skip: !signupData?.signup.signupGroup,
      variables: { id: signupData?.signup.signupGroup as string },
    });

  const signup = signupData?.signup;
  const signupGroup = signupGroupData?.signupGroup;
  const loading =
    loadingRegistrationAndEvent || loadingSignup || loadingSignupGroup;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration && signup ? (
        <SignupGroupFormProvider registration={registration}>
          <SignupServerErrorsProvider>
            <EditSignupPage
              event={event}
              refetch={refetch}
              registration={registration}
              signup={signup}
              signupGroup={signupGroup}
            />
          </SignupServerErrorsProvider>
        </SignupGroupFormProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditSignupPageWrapper;
