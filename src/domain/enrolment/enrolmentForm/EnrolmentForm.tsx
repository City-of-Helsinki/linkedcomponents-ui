/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Form, Formik, FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import Notification from '../../../common/components/notification/Notification';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../../constants';
import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQuery,
  EnrolmentQueryVariables,
  EventFieldsFragment,
  RegistrationFieldsFragment,
  useCreateEnrolmentMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import { showFormErrors } from '../../../utils/validationUtils';
import { clearEnrolmentsQueries } from '../../app/apollo/clearCacheUtils';
import Container from '../../app/layout/container/Container';
import { reportError } from '../../app/sentry/utils';
import { getRegistrationWarning } from '../../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import {
  clearSeatsReservationData,
  getSeatsReservationData,
} from '../../reserveSeats/utils';
import useUser from '../../user/hooks/useUser';
import {
  ENROLMENT_ACTIONS,
  ENROLMENT_FIELDS,
  ENROLMENT_MODALS,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EnrolmentAuthenticationNotification from '../enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import EnrolmentFormFields from '../enrolmentFormFields/EnrolmentFormFields';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import EventInfo from '../eventInfo/EventInfo';
import FormContainer from '../formContainer/FormContainer';
import useEnrolmentUpdateActions from '../hooks/useEnrolmentUpdateActions';
import ConfirmCancelModal from '../modals/confirmCancelModal/ConfirmCancelModal';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import { useReservationTimer } from '../reservationTimer/hooks/useReservationTimer';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import { ReservationTimerProvider } from '../reservationTimer/ReservationTimerContext';
import {
  AttendeeFields,
  EnrolmentFormFields as EnrolmentFormFieldsType,
} from '../types';
import {
  clearCreateEnrolmentFormData,
  getEnrolmentPayload,
  isRestoringFormDataDisabled,
} from '../utils';
import { enrolmentSchema, scrollToFirstError } from '../validation';
import styles from './enrolmentForm.module.scss';

type EnrolmentFormWrapperProps = {
  disabled: boolean;
  enrolment?: EnrolmentFieldsFragment;
  event: EventFieldsFragment;
  initialValues: EnrolmentFormFieldsType;
  refetchEnrolment?: (
    variables?: Partial<EnrolmentQueryVariables>
  ) => Promise<ApolloQueryResult<EnrolmentQuery>>;
  registration: RegistrationFieldsFragment;
};

type EnrolmentFormProps = Omit<EnrolmentFormWrapperProps, 'initialValues'> & {
  setErrors: (errors: FormikErrors<EnrolmentFormFieldsType>) => void;
  setTouched: (
    touched: FormikTouched<EnrolmentFormFieldsType>,
    shouldValidate?: boolean
  ) => void;
  values: EnrolmentFormFieldsType;
};

const EnrolmentForm: React.FC<EnrolmentFormProps> = ({
  disabled,
  enrolment,
  event,
  refetchEnrolment,
  registration,
  setErrors,
  setTouched,
  values,
}) => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();

  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const { cancelEnrolment, saving, updateEnrolment } =
    useEnrolmentUpdateActions({
      enrolment,
      registration,
    });

  const {
    callbacksDisabled,
    disableCallbacks: disableReservationTimerCallbacks,
  } = useReservationTimer();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const [createEnrolmentMutation] = useCreateEnrolmentMutation();

  const [creatingEnrolment, setCreatingEnrolment] =
    React.useState<boolean>(false);
  const formSavingDisabled = React.useRef(!!enrolment);

  const { closeModal, openModal, setOpenModal, setOpenParticipant } =
    useEnrolmentPageContext();

  const registrationWarning = getRegistrationWarning(registration, t);

  const goToEnrolmentsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )
    );

    navigate(
      {
        pathname: `/${locale}${returnPath}`,
        search: replaceParamsToRegistrationQueryString(remainingQueryString, {
          attendeePage: null,
          waitingPage: null,
        }),
      },
      { state: { enrolmentId: enrolment?.id } }
    );
  };

  const goToEnrolmentsPageAfterCreate = () => {
    // Disable reservation timer callbacks
    // so user is not redirected to create enrolment page
    disableReservationTimerCallbacks();

    formSavingDisabled.current = true;
    clearCreateEnrolmentFormData(registration.id as string);
    clearSeatsReservationData(registration.id as string);

    navigate(
      `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )}`
    );
  };

  const onCancel = () => {
    cancelEnrolment({
      onSuccess: () => goToEnrolmentsPage(),
    });
  };

  const clearErrors = () => setErrors({});

  const onUpdate = (values: EnrolmentFormFieldsType) => {
    updateEnrolment(values, {
      onError: (error: any) => showServerErrors({ error }, 'enrolment'),
      onSuccess: async () => {
        refetchEnrolment && (await refetchEnrolment());
        window.scrollTo(0, 0);
      },
    });
  };

  const createSingleEnrolment = async (
    payload: CreateEnrolmentMutationInput
  ) => {
    try {
      const data = await createEnrolmentMutation({
        variables: { input: payload, registration: registration.id as string },
      });

      return data.data?.createEnrolment;
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error }, 'enrolment');
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
    setCreatingEnrolment(true);

    const reservationData = getSeatsReservationData(registration.id as string);
    const payload = getEnrolmentPayload({
      formValues: values,
      reservationCode: reservationData?.code as string,
    });

    const createdEnrolments = await createSingleEnrolment(payload);

    if (createdEnrolments) {
      // Clear all enrolments queries from apollo cache to show added enrolment
      // in enrolment list
      clearEnrolmentsQueries(apolloClient);

      goToEnrolmentsPageAfterCreate();
    }

    setCreatingEnrolment(false);
  };

  const handleSubmit = async () => {
    try {
      setServerErrorItems([]);
      clearErrors();

      await enrolmentSchema.validate(values, { abortEarly: false });

      if (enrolment) {
        onUpdate(values);
      } else {
        createEnrolment(values);
      }
    } catch (error) {
      showFormErrors({
        error: error as ValidationError,
        setErrors,
        setTouched,
      });

      scrollToFirstError({
        error: error as ValidationError,
        setOpenAccordion: setOpenParticipant,
      });
    }
  };

  return (
    <>
      {enrolment && (
        <ConfirmCancelModal
          enrolment={enrolment}
          isOpen={openModal === ENROLMENT_MODALS.CANCEL}
          isSaving={saving === ENROLMENT_ACTIONS.CANCEL}
          onClose={closeModal}
          onCancel={onCancel}
          registration={registration}
        />
      )}

      <Form noValidate>
        <FormikPersist
          isSessionStorage={true}
          name={`${FORM_NAMES.CREATE_ENROLMENT_FORM}-${registration.id}`}
          restoringDisabled={isRestoringFormDataDisabled({
            enrolment,
            registrationId: registration.id as string,
          })}
          savingDisabled={callbacksDisabled || formSavingDisabled.current}
        >
          <Container
            contentWrapperClassName={styles.editPageContentContainer}
            withOffset
          >
            <FormContainer>
              <EnrolmentAuthenticationNotification
                action={ENROLMENT_ACTIONS.UPDATE}
                registration={registration}
              />
              <ServerErrorSummary errors={serverErrorItems} />
              <EventInfo event={event} />
              <div className={styles.divider} />
              {!enrolment && registrationWarning && (
                <Notification type="info" className={styles.warning}>
                  {registrationWarning}
                </Notification>
              )}
              {!enrolment && (
                <>
                  <ReservationTimer />
                  <div className={styles.divider} />
                </>
              )}
              <h2>{t('enrolment.form.titleRegistration')}</h2>

              <ParticipantAmountSelector
                disabled={disabled || !!enrolment}
                registration={registration}
              />

              <EnrolmentFormFields
                disabled={disabled}
                registration={registration}
              />
            </FormContainer>
          </Container>
          {enrolment ? (
            <EditButtonPanel
              enrolment={enrolment}
              onCancel={() => setOpenModal(ENROLMENT_MODALS.CANCEL)}
              onSave={handleSubmit}
              registration={registration}
              saving={saving}
            />
          ) : (
            <CreateButtonPanel
              disabled={disabled}
              onSave={handleSubmit}
              registration={registration}
              saving={creatingEnrolment}
            />
          )}
        </FormikPersist>
      </Form>
    </>
  );
};

const EnrolmentFormWrapper: React.FC<EnrolmentFormWrapperProps> = ({
  enrolment,
  initialValues,
  registration,
  ...rest
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={enrolmentSchema}
    >
      {({ setErrors, setFieldValue, setTouched, values }) => {
        const setAttendees = (attendees: AttendeeFields[]) => {
          setFieldValue(ENROLMENT_FIELDS.ATTENDEES, attendees);
        };

        return (
          <ReservationTimerProvider
            attendees={values.attendees}
            initializeReservationData={!enrolment}
            registration={registration}
            setAttendees={setAttendees}
          >
            <EnrolmentForm
              enrolment={enrolment}
              registration={registration}
              {...rest}
              setErrors={setErrors}
              setTouched={setTouched}
              values={values}
            />
          </ReservationTimerProvider>
        );
      }}
    </Formik>
  );
};

export default EnrolmentFormWrapper;
