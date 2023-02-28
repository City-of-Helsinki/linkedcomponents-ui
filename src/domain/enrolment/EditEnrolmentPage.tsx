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
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from './constants';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import useRegistrationAndEventData from './hooks/useRegistrationAndEventData';
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
    getValue(event.publisher, '')
  );
  const isEditingAllowed = checkCanUserDoAction({
    action: ENROLMENT_ACTIONS.EDIT,
    organizationAncestors,
    publisher: getValue(event.publisher, ''),
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
  const { enrolmentId } = useParams<{ enrolmentId: string }>();
  const { user } = useUser();

  const {
    event,
    loading: loadingRegistrationAndEvent,
    registration,
  } = useRegistrationAndEventData({ shouldFetchEvent: true });

  const {
    data: enrolmentData,
    loading: loadingEnrolment,
    refetch,
  } = useEnrolmentQuery({
    skip: !enrolmentId || !user,
    variables: {
      id: getValue(enrolmentId, ''),
      createPath: getPathBuilder(enrolmentPathBuilder),
    },
  });

  const enrolment = enrolmentData?.enrolment;
  const loading = loadingRegistrationAndEvent || loadingEnrolment;

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
