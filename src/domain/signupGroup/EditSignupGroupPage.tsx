import { ApolloQueryResult } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
  SignupGroupQuery,
  SignupGroupQueryVariables,
  useSignupGroupQuery,
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
import useUser from '../user/hooks/useUser';
import { SIGNUP_GROUP_ACTIONS } from './constants';
import { checkCanUserDoSignupGroupAction } from './permissions';
import SignupGroupForm from './signupGroupForm/SignupGroupForm';
import { SignupGroupFormProvider } from './signupGroupFormContext/SignupGroupFormContext';
import styles from './signupGroupPage.module.scss';
import { getSignupGroupInitialValues } from './utils';

type Props = {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<SignupGroupQueryVariables>
  ) => Promise<ApolloQueryResult<SignupGroupQuery>>;
  registration: RegistrationFieldsFragment;
  signupGroup: SignupGroupFieldsFragment;
};

const EditSignupGroupPage: React.FC<Props> = ({
  event,
  refetch,
  registration,
  signupGroup,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const isEditingAllowed = checkCanUserDoSignupGroupAction({
    action: SIGNUP_GROUP_ACTIONS.UPDATE,
    organizationAncestors,
    registration,
    user,
  });

  const initialValues = React.useMemo(
    () => getSignupGroupInitialValues(signupGroup),
    [signupGroup]
  );

  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      noFooter
      title={`editSignupGroupPage.pageTitle`}
    >
      <MainContent>
        <Container
          contentWrapperClassName={styles.breadcrumbContainer}
          withOffset
        >
          <SignupPageBreadcrumb
            activeLabel={t(`editSignupGroupPage.pageTitle`)}
            registration={registration}
          />
        </Container>
        <SignupGroupForm
          disabled={!isEditingAllowed}
          event={event}
          initialValues={initialValues}
          refetchSignupGroup={refetch}
          registration={registration}
          signupGroup={signupGroup}
        />
      </MainContent>
    </PageWrapper>
  );
};

const EditSignupGroupPageWrapper: React.FC = () => {
  const { signupGroupId } = useParams<{
    signupGroupId: string;
  }>();
  const { user } = useUser();

  const {
    event,
    loading: loadingRegistrationAndEvent,
    registration,
  } = useRegistrationAndEventData({ shouldFetchEvent: true });

  const {
    data: signupGroupData,
    loading: loadingSignupGroup,
    refetch,
  } = useSignupGroupQuery({
    skip: !signupGroupId || !user,
    variables: { id: getValue(signupGroupId, '') },
  });

  const signupGroup = signupGroupData?.signupGroup;
  const loading = loadingRegistrationAndEvent || loadingSignupGroup;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration && signupGroup ? (
        <SignupGroupFormProvider registration={registration}>
          <SignupServerErrorsProvider>
            <EditSignupGroupPage
              event={event}
              refetch={refetch}
              registration={registration}
              signupGroup={signupGroup}
            />
          </SignupServerErrorsProvider>
        </SignupGroupFormProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditSignupGroupPageWrapper;
