import { Form, Formik } from 'formik';
import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  Enrolment,
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useEventQuery,
  useRegistrationQuery,
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { attendeesResponse } from '../enrolments/__mocks__/enrolmentsPage';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import AuthRequiredNotification from '../registration/authRequiredNotification/AuthRequiredNotification';
import { registrationPathBuilder } from '../registration/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EnrolmentFormFields from './enrolmentFormFields/EnrolmentFormFields';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import { getEnrolmentInitialValues } from './utils';
import { enrolmentSchema, scrollToFirstError, showErrors } from './validation';

type Props = {
  enrolment: Enrolment;
  event: EventFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const EditEnrolmentPage: React.FC<Props> = ({
  enrolment,
  event,
  registration,
}) => {
  const initialValues = React.useMemo(
    () => getEnrolmentInitialValues(enrolment),
    [enrolment]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={enrolmentSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async () => {
          try {
            clearErrors();

            await enrolmentSchema.validate(values, { abortEarly: false });

            toast.error('TODO: Save enrolment');
          } catch (error) {
            showErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form noValidate>
            <PageWrapper
              backgroundColor="coatOfArms"
              noFooter
              title={`editEnrolmentPage.pageTitle`}
            >
              <MainContent>
                <Container
                  contentWrapperClassName={styles.editPageContentContainer}
                  withOffset
                >
                  <FormContainer>
                    <AuthRequiredNotification />
                    <EventInfo event={event} />
                    <div className={styles.divider} />
                    <EnrolmentFormFields />
                  </FormContainer>
                </Container>
                <EditButtonPanel
                  enrolment={enrolment}
                  registration={registration}
                  onSave={handleSubmit}
                />
              </MainContent>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

const EditEnrolmentPageWrapper: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  const loadingUser = useDebouncedLoadingUser();
  const { enrolmentId, registrationId } =
    useParams<{ enrolmentId: string; registrationId: string }>();

  const { data: registrationData, loading: loadingRegistration } =
    useRegistrationQuery({
      skip: !registrationId || !user,
      variables: {
        id: registrationId,
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

  const loading = loadingUser || loadingRegistration || loadingEvent;

  // TODO: Use real enrolment data when API is available
  const enrolment = attendeesResponse.enrolments.data.find(
    (item) => item.id === enrolmentId
  );

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event && registration && enrolment ? (
        <EditEnrolmentPage
          enrolment={enrolment}
          event={eventData?.event}
          registration={registration}
        />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditEnrolmentPageWrapper;
