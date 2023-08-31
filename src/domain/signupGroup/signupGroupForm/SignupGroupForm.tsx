/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik, FormikErrors, FormikTouched, useField } from 'formik';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
  SignupGroupQuery,
  SignupGroupQueryVariables,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import { ENROLMENT_ACTIONS, ENROLMENT_MODALS } from '../../enrolment/constants';
import EnrolmentAuthenticationNotification from '../../enrolment/enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../../enrolment/enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useEnrolmentActions from '../../enrolment/hooks/useEnrolmentActions';
import SendMessageModal from '../../enrolment/modals/sendMessageModal/SendMessageModal';
import RegistrationWarning from '../../enrolment/registrationWarning/RegistrationWarning';
import { isRegistrationPossible } from '../../registration/utils';
import { clearSeatsReservationData } from '../../seatsReservation/utils';
import { SIGNUP_GROUP_FIELDS } from '../constants';
import CreateSignupGroupButtonPanel from '../createButtonPanel/CreateSignupGroupButtonPanel';
import Divider from '../divider/Divider';
import EditSignupGroupButtonPanel from '../editButtonPanel/EditSignupGroupButtonPanel';
import EventInfo from '../eventInfo/EventInfo';
import FormContainer from '../formContainer/FormContainer';
import useSignupGroupActions from '../hooks/useSignupGroupActions';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import EnrolmentFormFields from '../signupGroupFormFields/SignupGroupFormFields';
import {
  SignupFields,
  SignupGroupFormFields as SignupGroupFormFieldsType,
} from '../types';
import {
  clearCreateSignupGroupFormData,
  isRestoringSignupGroupFormDataDisabled,
} from '../utils';
import { getSignupGroupSchema, scrollToFirstError } from '../validation';
import AvailableSeatsText from './availableSeatsText/AvailableSeatsText';
import styles from './signupGroupForm.module.scss';

type SignupGroupFormWrapperProps = {
  disabled: boolean;
  event: EventFieldsFragment;
  initialValues: SignupGroupFormFieldsType;
  refetchSignupGroup?: (
    variables?: Partial<SignupGroupQueryVariables>
  ) => Promise<ApolloQueryResult<SignupGroupQuery>>;
  registration: RegistrationFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
};

type SignupGroupFormProps = Omit<
  SignupGroupFormWrapperProps,
  'initialValues'
> & {
  setErrors: (errors: FormikErrors<SignupGroupFormFieldsType>) => void;
  setTouched: (
    touched: FormikTouched<SignupGroupFormFieldsType>,
    shouldValidate?: boolean
  ) => void;
  values: SignupGroupFormFieldsType;
};

const SignupGroupForm: React.FC<SignupGroupFormProps> = ({
  disabled,

  event,
  refetchSignupGroup,
  registration,
  setErrors,
  setTouched,
  signupGroup,
  values,
}) => {
  const { t } = useTranslation();

  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFields[]
  >(SIGNUP_GROUP_FIELDS.SIGNUPS);
  const locale = useLocale();
  const navigate = useNavigate();

  const timerCallbacksDisabled = useRef(false);

  const disableTimerCallbacks = useCallback(() => {
    timerCallbacksDisabled.current = true;
  }, []);

  const responsiblePerson = useMemo(
    () =>
      signupGroup?.signups?.find((su) => su?.responsibleForGroup) ?? undefined,
    [signupGroup]
  );

  const { saving: savingResponsiblePerson, sendMessage } = useEnrolmentActions({
    enrolment: responsiblePerson,
    registration,
  });

  const {
    createSignupGroup,
    saving: savingSignupGroup,
    updateSignupGroup,
  } = useSignupGroupActions({
    registration,
    signupGroup,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const formSavingDisabled = React.useRef(!!signupGroup);

  const { closeModal, openModal, setOpenModal, setOpenParticipant } =
    useEnrolmentPageContext();

  const goToSignupsPageAfterCreate = () => {
    const registrationId = getValue(registration.id, '');
    // Disable reservation timer callbacks
    // so user is not redirected to create enrolment page
    disableTimerCallbacks();

    formSavingDisabled.current = true;
    clearCreateSignupGroupFormData(registrationId);
    clearSeatsReservationData(registrationId);

    navigate(
      `/${locale}${ROUTES.REGISTRATION_SIGNUPS.replace(
        ':registrationId',
        registrationId
      )}`
    );
  };

  const clearErrors = () => setErrors({});

  const handleCreate = (values: SignupGroupFormFieldsType) => {
    createSignupGroup(values, {
      onError: (error) => showServerErrors({ error }, 'enrolment'),
      onSuccess: goToSignupsPageAfterCreate,
    });
  };

  const handleUpdate = (values: SignupGroupFormFieldsType) => {
    updateSignupGroup(values, {
      onError: (error: any) => showServerErrors({ error }, 'enrolment'),
      onSuccess: async () => {
        refetchSignupGroup && (await refetchSignupGroup());
        window.scrollTo(0, 0);
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setServerErrorItems([]);
      clearErrors();

      await getSignupGroupSchema(registration).validate(values, {
        abortEarly: false,
      });

      if (signupGroup) {
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
      {responsiblePerson && (
        <SendMessageModal
          isOpen={openModal === ENROLMENT_MODALS.SEND_MESSAGE_TO_SIGNUP}
          isSaving={savingResponsiblePerson === ENROLMENT_ACTIONS.SEND_MESSAGE}
          onClose={closeModal}
          onSendMessage={sendMessage}
          signup={responsiblePerson}
        />
      )}

      <Form noValidate>
        <FormikPersist
          isSessionStorage={true}
          name={`${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registration.id}`}
          restoringDisabled={isRestoringSignupGroupFormDataDisabled({
            signupGroup,
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

              {!signupGroup && (
                <>
                  <Divider />
                  <RegistrationWarning registration={registration} />
                  {isRegistrationPossible(registration) && (
                    <>
                      <ReservationTimer
                        callbacksDisabled={timerCallbacksDisabled.current}
                        disableCallbacks={disableTimerCallbacks}
                        initReservationData={true}
                        registration={registration}
                        setSignups={setSignups}
                        signups={signups}
                      />
                      <Divider />
                    </>
                  )}
                  <h2>{t('signup.form.titleRegistration')}</h2>
                  <AvailableSeatsText registration={registration} />

                  <ParticipantAmountSelector
                    disabled={disabled || !!signupGroup}
                    registration={registration}
                  />
                </>
              )}

              <EnrolmentFormFields
                disabled={disabled}
                registration={registration}
                signupGroup={signupGroup}
              />
            </FormContainer>
          </Container>
          {signupGroup ? (
            <EditSignupGroupButtonPanel
              onSendMessage={() =>
                setOpenModal(ENROLMENT_MODALS.SEND_MESSAGE_TO_SIGNUP)
              }
              registration={registration}
              saving={savingSignupGroup}
              signupGroup={signupGroup}
              onUpdate={handleSubmit}
            />
          ) : (
            <CreateSignupGroupButtonPanel
              disabled={disabled}
              onCreate={handleSubmit}
              registration={registration}
              saving={savingSignupGroup}
            />
          )}
        </FormikPersist>
      </Form>
    </>
  );
};

const SignupGroupFormWrapper: React.FC<SignupGroupFormWrapperProps> = ({
  initialValues,
  registration,
  signupGroup,
  ...rest
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={() => getSignupGroupSchema(registration)}
    >
      {({ setErrors, setTouched, values }) => {
        return (
          <SignupGroupForm
            registration={registration}
            signupGroup={signupGroup}
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

export default SignupGroupFormWrapper;
