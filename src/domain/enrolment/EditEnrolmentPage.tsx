import { Form, Formik } from 'formik';
import debounce from 'lodash/debounce';
import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  Enrolment,
  EventFieldsFragment,
  Registration,
  useEventQuery,
} from '../../generated/graphql';
import useIsMounted from '../../hooks/useIsMounted';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { attendeesResponse } from '../enrolments/__mocks__/enrolmentsPage';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { registrationsResponse } from '../registrations/__mocks__/registrationsPage';
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
  registration: Registration;
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

const LOADING_USER_DEBOUNCE_TIME = 50;

const EditEnrolmentPageWrapper: React.FC = () => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { enrolmentId, registrationId } =
    useParams<{ enrolmentId: string; registrationId: string }>();
  // TODO: Use real registration data when API is available
  const registration = registrationsResponse.registrations.data.find(
    (item) => item.id === registrationId
  );
  // TODO: Use real enrolment data when API is available
  const enrolment = attendeesResponse.enrolments.data.find(
    (item) => item.id === enrolmentId
  );

  const [debouncedLoadingUser, setDebouncedLoadingUser] =
    React.useState(loadingUser);

  const debouncedSetLoading = React.useMemo(
    () =>
      debounce((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setDebouncedLoadingUser(loading);
      }, LOADING_USER_DEBOUNCE_TIME),
    [isMounted]
  );

  const handleLoadingUserChange = React.useCallback(
    (loading: boolean) => {
      /* istanbul ignore next */
      debouncedSetLoading(loading);
    },
    [debouncedSetLoading]
  );

  React.useEffect(() => {
    handleLoadingUserChange(loadingUser);
  }, [handleLoadingUserChange, loadingUser]);

  const { data: eventData, loading: loadingEvent } = useEventQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: debouncedLoadingUser || !registration?.eventId,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: registration?.eventId as string,
      include: EVENT_INCLUDES,
    },
  });
  const loading = debouncedLoadingUser || loadingEvent;

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
