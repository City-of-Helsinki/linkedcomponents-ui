/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import {
  Enrolment,
  EnrolmentQuery,
  EnrolmentQueryVariables,
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useEnrolmentQuery,
  useEventQuery,
  useRegistrationQuery,
} from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import AuthRequiredNotification from '../registration/authRequiredNotification/AuthRequiredNotification';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import { registrationPathBuilder } from '../registration/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EnrolmentFormFields from './enrolmentFormFields/EnrolmentFormFields';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import useEnrolmentServerErrors from './hooks/useEnrolmentServerErrors';
import useEnrolmentUpdateActions from './hooks/useEnrolmentUpdateActions';
import { EnrolmentFormFields as EnrolmentFormFieldsType } from './types';
import { enrolmentPathBuilder, getEnrolmentInitialValues } from './utils';
import { enrolmentSchema, scrollToFirstError, showErrors } from './validation';

type Props = {
  enrolment: Enrolment;
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
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();
  const { saving, updateEnrolment } = useEnrolmentUpdateActions({
    enrolment,
    registration,
  });

  const initialValues = React.useMemo(
    () => getEnrolmentInitialValues(enrolment),
    [enrolment]
  );

  const onUpdate = (values: EnrolmentFormFieldsType) => {
    updateEnrolment(values, {
      onError: (error: any) => showServerErrors({ error }),
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

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
            setServerErrorItems([]);
            clearErrors();

            await enrolmentSchema.validate(values, { abortEarly: false });

            onUpdate(values);
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
                    <ServerErrorSummary errors={serverErrorItems} />
                    <EventInfo event={event} />
                    <div className={styles.divider} />
                    <EnrolmentFormFields />
                  </FormContainer>
                </Container>
                <EditButtonPanel
                  enrolment={enrolment}
                  registration={registration}
                  onSave={handleSubmit}
                  saving={saving}
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

  const {
    data: enrolmentData,
    loading: loadingEnrolment,
    refetch,
  } = useEnrolmentQuery({
    skip: !enrolmentId || !user,
    variables: {
      id: enrolmentId,
      createPath: getPathBuilder(enrolmentPathBuilder),
    },
  });

  const enrolment = enrolmentData?.enrolment;
  const event = eventData?.event;
  const loading =
    loadingUser || loadingRegistration || loadingEvent || loadingEnrolment;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration && enrolment ? (
        <EditEnrolmentPage
          enrolment={enrolment}
          event={event}
          refetch={refetch}
          registration={registration}
        />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditEnrolmentPageWrapper;
