/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Notification from '../../common/components/notification/Notification';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../constants';
import {
  CreateEnrolmentMutationInput,
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useCreateEnrolmentMutation,
  useEventQuery,
  useRegistrationQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { reportError } from '../app/sentry/utils';
import { clearEnrolmentsQueries } from '../enrolments/utils';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import {
  getRegistrationWarning,
  isRegistrationPossible,
  registrationPathBuilder,
} from '../registration/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from './constants';
import CreateButtonPanel from './createButtonPanel/CreateButtonPanel';
import EnrolmentAuthenticationNotification from './enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import EnrolmentFormFields from './enrolmentFormFields/EnrolmentFormFields';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import useEnrolmentServerErrors from './hooks/useEnrolmentServerErrors';
import { EnrolmentFormFields as EnrolmentFormFieldsType } from './types';
import { getEnrolmentDefaultInitialValues, getEnrolmentPayload } from './utils';
import { enrolmentSchema, scrollToFirstError, showErrors } from './validation';

type Props = {
  event: EventFieldsFragment;
  registration: RegistrationFieldsFragment;
};

const CreateEnrolmentPage: React.FC<Props> = ({ event, registration }) => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [saving, setSaving] = React.useState<boolean>(false);
  const [createEnrolmentMutation] = useCreateEnrolmentMutation();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const locale = useLocale();
  const { user } = useUser();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();

  const goToEnrolmentsPage = () => {
    history.push(
      `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )}`
    );
  };

  const createSingleEnrolment = async (
    payload: CreateEnrolmentMutationInput
  ) => {
    try {
      const data = await createEnrolmentMutation({
        variables: { input: payload },
      });

      return data.data?.createEnrolment.id as string;
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error });
      // Report error to Sentry
      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to create enrolment',
        user,
      });
    }
  };

  const createEnrolment = async (values: EnrolmentFormFieldsType) => {
    setSaving(true);

    const payload = getEnrolmentPayload(values, registration);

    const createdEventId = await createSingleEnrolment(payload);

    if (createdEventId) {
      // Clear all enrolments queries from apollo cache to show added enrolment
      // in enrolment list
      clearEnrolmentsQueries(apolloClient);

      goToEnrolmentsPage();
    }

    setSaving(false);
  };

  const initialValues = getEnrolmentDefaultInitialValues(registration);
  const formDisabled = !isRegistrationPossible(registration);
  const registrationWarning = getRegistrationWarning(registration, t);

  return (
    <PageWrapper
      className={styles.registrationPage}
      title={`createEnrolmentPage.pageTitle`}
    >
      <MainContent>
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

                createEnrolment(values);
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
                <Container withOffset>
                  <FormContainer>
                    <EnrolmentAuthenticationNotification
                      action={ENROLMENT_ACTIONS.CREATE}
                      registration={registration}
                    />
                    <ServerErrorSummary errors={serverErrorItems} />
                    <EventInfo event={event} />
                    <div className={styles.divider} />
                    {registrationWarning && (
                      <Notification type="info" className={styles.warning}>
                        {registrationWarning}
                      </Notification>
                    )}
                    <EnrolmentFormFields disabled={formDisabled} />
                  </FormContainer>
                </Container>
                <CreateButtonPanel
                  disabled={formDisabled}
                  onSave={handleSubmit}
                  registration={registration}
                  saving={saving}
                />
              </Form>
            );
          }}
        </Formik>
      </MainContent>
    </PageWrapper>
  );
};

const CreateEnrolmentPageWrapper: React.FC = () => {
  const location = useLocation();
  const { registrationId } = useParams<{ registrationId: string }>();
  const { user } = useUser();
  const loadingUser = useDebouncedLoadingUser();

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

  const loading = loadingUser || loadingRegistration || loadingEvent;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event && registration ? (
        <CreateEnrolmentPage
          event={eventData?.event}
          registration={registration}
        />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
