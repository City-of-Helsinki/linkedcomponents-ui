/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik, FormikErrors, FormikTouched, useField } from 'formik';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../../constants';
import {
  EnrolmentFieldsFragment,
  EnrolmentQuery,
  EnrolmentQueryVariables,
  EventFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import getValue from '../../../utils/getValue';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import { isRegistrationPossible } from '../../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { clearSeatsReservationData } from '../../reserveSeats/utils';
import {
  ENROLMENT_ACTIONS,
  ENROLMENT_FIELDS,
  ENROLMENT_MODALS,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import Divider from '../divider/Divider';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EnrolmentAuthenticationNotification from '../enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import EnrolmentFormFields from '../enrolmentFormFields/EnrolmentFormFields';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import EventInfo from '../eventInfo/EventInfo';
import FormContainer from '../formContainer/FormContainer';
import useEnrolmentActions from '../hooks/useEnrolmentActions';
import ConfirmCancelEnrolmentModal from '../modals/confirmCancelEnrolmentModal/ConfirmCancelEnrolmentModal';
import SendMessageModal from '../modals/sendMessageModal/SendMessageModal';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import RegistrationWarning from '../registrationWarning/RegistrationWarning';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import {
  AttendeeFields,
  EnrolmentFormFields as EnrolmentFormFieldsType,
} from '../types';
import {
  clearCreateEnrolmentFormData,
  isRestoringFormDataDisabled,
} from '../utils';
import { getEnrolmentSchema, scrollToFirstError } from '../validation';
import AvailableSeatsText from './availableSeatsText/AvailableSeatsText';
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
  const { t } = useTranslation();

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >(ENROLMENT_FIELDS.ATTENDEES);
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const timerCallbacksDisabled = useRef(false);

  const disableTimerCallbacks = useCallback(() => {
    timerCallbacksDisabled.current = true;
  }, []);

  const {
    cancelEnrolment,
    createEnrolment,
    saving,
    sendMessage,
    updateEnrolment,
  } = useEnrolmentActions({
    enrolment,
    registration,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const formSavingDisabled = React.useRef(!!enrolment);

  const { closeModal, openModal, setOpenModal, setOpenParticipant } =
    useEnrolmentPageContext();

  const goToEnrolmentsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        getValue(registration.id, '')
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
    const registrationId = getValue(registration.id, '');
    // Disable reservation timer callbacks
    // so user is not redirected to create enrolment page
    disableTimerCallbacks();

    formSavingDisabled.current = true;
    clearCreateEnrolmentFormData(registrationId);
    clearSeatsReservationData(registrationId);

    navigate(
      `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registrationId
      )}`
    );
  };

  const handleCancel = () => {
    cancelEnrolment({ onSuccess: goToEnrolmentsPage });
  };

  const clearErrors = () => setErrors({});

  const handleCreate = (values: EnrolmentFormFieldsType) => {
    createEnrolment(values, {
      onError: (error) => showServerErrors({ error }, 'enrolment'),
      onSuccess: goToEnrolmentsPageAfterCreate,
    });
  };

  const handleUpdate = (values: EnrolmentFormFieldsType) => {
    updateEnrolment(values, {
      onError: (error: any) => showServerErrors({ error }, 'enrolment'),
      onSuccess: async () => {
        refetchEnrolment && (await refetchEnrolment());
        window.scrollTo(0, 0);
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setServerErrorItems([]);
      clearErrors();

      await getEnrolmentSchema(registration).validate(values, {
        abortEarly: false,
      });

      if (enrolment) {
        handleUpdate(values);
      } else {
        handleCreate(values);
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
        <ConfirmCancelEnrolmentModal
          enrolment={enrolment}
          isOpen={openModal === ENROLMENT_MODALS.CANCEL}
          isSaving={saving === ENROLMENT_ACTIONS.CANCEL}
          onClose={closeModal}
          onConfirm={handleCancel}
          registration={registration}
        />
      )}
      {enrolment && (
        <SendMessageModal
          enrolment={enrolment}
          isOpen={openModal === ENROLMENT_MODALS.SEND_MESSAGE_TO_ENROLMENT}
          isSaving={saving === ENROLMENT_ACTIONS.SEND_MESSAGE}
          onClose={closeModal}
          onSendMessage={sendMessage}
        />
      )}

      <Form noValidate>
        <FormikPersist
          isSessionStorage={true}
          name={`${FORM_NAMES.CREATE_ENROLMENT_FORM}-${registration.id}`}
          restoringDisabled={isRestoringFormDataDisabled({
            enrolment,
            registrationId: getValue(registration.id, ''),
          })}
          savingDisabled={
            timerCallbacksDisabled.current || formSavingDisabled.current
          }
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
              <Divider />
              {!enrolment && (
                <RegistrationWarning registration={registration} />
              )}
              {isRegistrationPossible(registration) && !enrolment && (
                <>
                  <ReservationTimer
                    attendees={attendees}
                    callbacksDisabled={timerCallbacksDisabled.current}
                    disableCallbacks={disableTimerCallbacks}
                    initReservationData={true}
                    registration={registration}
                    setAttendees={setAttendees}
                  />
                  <Divider />
                </>
              )}
              <h2>{t('enrolment.form.titleRegistration')}</h2>
              <AvailableSeatsText registration={registration} />

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
              onSendMessage={() =>
                setOpenModal(ENROLMENT_MODALS.SEND_MESSAGE_TO_ENROLMENT)
              }
              registration={registration}
              saving={saving}
            />
          ) : (
            <CreateButtonPanel
              disabled={disabled}
              onSave={handleSubmit}
              registration={registration}
              saving={saving}
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
      validationSchema={() => getEnrolmentSchema(registration)}
    >
      {({ setErrors, setTouched, values }) => {
        return (
          <EnrolmentForm
            enrolment={enrolment}
            registration={registration}
            {...rest}
            setErrors={setErrors}
            setTouched={setTouched}
            values={values}
          />
        );
      }}
    </Formik>
  );
};

export default EnrolmentFormWrapper;
