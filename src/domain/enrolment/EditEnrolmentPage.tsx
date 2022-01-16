/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../constants';
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
import useLocale from '../../hooks/useLocale';
import extractLatestReturnPath from '../../utils/extractLatestReturnPath';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { ENROLMENT_EDIT_ACTIONS } from '../enrolments/constants';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import AuthenticationNotification from '../registration/registrationAuthenticationNotification/RegistrationAuthenticationNotification';
import { registrationPathBuilder } from '../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../registrations/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EnrolmentFormFields from './enrolmentFormFields/EnrolmentFormFields';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import useEnrolmentServerErrors from './hooks/useEnrolmentServerErrors';
import useEnrolmentUpdateActions, {
  ENROLMENT_MODALS,
} from './hooks/useEnrolmentUpdateActions';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
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
  const locale = useLocale();
  const history = useHistory();
  const location = useLocation();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();
  const {
    cancelEnrolment,
    closeModal,
    openModal,
    saving,
    setOpenModal,
    updateEnrolment,
  } = useEnrolmentUpdateActions({
    enrolment,
    registration,
  });

  const goToEnrolmentsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: replaceParamsToRegistrationQueryString(remainingQueryString, {
        enrolmentPage: null,
      }),
      state: { enrolmentId: enrolment.id },
    });
  };

  const initialValues = React.useMemo(
    () => getEnrolmentInitialValues(enrolment, registration),
    [enrolment, registration]
  );

  const onCancel = () => {
    cancelEnrolment({
      onSuccess: () => goToEnrolmentsPage(),
    });
  };

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
          <>
            <ConfirmCancelModal
              enrolment={enrolment}
              isOpen={openModal === ENROLMENT_MODALS.CANCEL}
              isSaving={saving === ENROLMENT_EDIT_ACTIONS.CANCEL}
              onClose={closeModal}
              onCancel={onCancel}
              registration={registration}
            />

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
                      <AuthenticationNotification />
                      <ServerErrorSummary errors={serverErrorItems} />
                      <EventInfo event={event} />
                      <div className={styles.divider} />
                      <EnrolmentFormFields />
                    </FormContainer>
                  </Container>
                  <EditButtonPanel
                    enrolment={enrolment}
                    registration={registration}
                    onCancel={() => setOpenModal(ENROLMENT_MODALS.CANCEL)}
                    onSave={handleSubmit}
                    saving={saving}
                  />
                </MainContent>
              </PageWrapper>
            </Form>
          </>
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
