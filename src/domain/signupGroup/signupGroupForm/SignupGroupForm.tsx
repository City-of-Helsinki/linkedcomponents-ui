/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik, FormikErrors, FormikTouched, useField } from 'formik';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
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
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import getValue from '../../../utils/getValue';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import useSignupActions from '../../enrolment/hooks/useSignupActions';
import { isRegistrationPossible } from '../../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { clearSeatsReservationData } from '../../seatsReservation/utils';
import { SIGNUP_ACTIONS, SIGNUP_MODALS } from '../../signup/constants';
import ConfirmDeleteSignupOrSignupGroupModal from '../../signup/modals/confirmDeleteSignupOrSignupGroupModal/ConfirmDeleteSignupOrSignupGroupModal';
import SendMessageModal from '../../signup/modals/sendMessageModal/SendMessageModal';
import SignupAuthenticationNotification from '../../signup/signupAuthenticationNotification/SignupAuthenticationNotification';
import { useSignupServerErrorsContext } from '../../signup/signupServerErrorsContext/hooks/useSignupServerErrorsContext';
import {
  SIGNUP_GROUP_ACTIONS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_MODALS,
} from '../constants';
import CreateSignupGroupButtonPanel from '../createButtonPanel/CreateSignupGroupButtonPanel';
import Divider from '../divider/Divider';
import EditSignupGroupButtonPanel from '../editButtonPanel/EditSignupGroupButtonPanel';
import EventInfo from '../eventInfo/EventInfo';
import FormContainer from '../formContainer/FormContainer';
import useSignupGroupActions from '../hooks/useSignupGroupActions';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import RegistrationWarning from '../registrationWarning/RegistrationWarning';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import { useSignupGroupFormContext } from '../signupGroupFormContext/hooks/useSignupGroupFormContext';
import SignupGroupFormFields from '../signupGroupFormFields/SignupGroupFormFields';
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
  const location = useLocation();

  const timerCallbacksDisabled = useRef(false);

  const disableTimerCallbacks = useCallback(() => {
    timerCallbacksDisabled.current = true;
  }, []);

  const responsiblePerson = useMemo(
    () =>
      signupGroup?.signups?.find((su) => su?.responsibleForGroup) ?? undefined,
    [signupGroup]
  );

  const { saving: savingResponsiblePerson, sendMessage } = useSignupActions({
    registration,
    signup: responsiblePerson,
  });

  const {
    closeModal: closeSignupGroupModal,
    createSignupGroup,
    deleteSignupGroup,
    openModal: openSignupGroupModal,
    saving: savingSignupGroup,
    setOpenModal: setOpenSignupGroupModal,
    updateSignupGroup,
  } = useSignupGroupActions({
    registration,
    signupGroup,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const formSavingDisabled = React.useRef(!!signupGroup);

  const { closeModal, openModal, setOpenModal, setOpenParticipant } =
    useSignupGroupFormContext();

  const goToSignupsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATION_SIGNUPS.replace(
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
      { state: { enrolmentId: responsiblePerson?.id } }
    );
  };

  const goToSignupsPageAfterCreate = () => {
    const registrationId = getValue(registration.id, '');
    // Disable reservation timer callbacks
    // so user is not redirected to create signup page
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
      onError: (error) => showServerErrors({ error }, 'signup'),
      onSuccess: goToSignupsPageAfterCreate,
    });
  };

  const handleDelete = () => {
    deleteSignupGroup({ onSuccess: goToSignupsPage });
  };

  const handleUpdate = (values: SignupGroupFormFieldsType) => {
    updateSignupGroup(values, {
      onError: (error: any) => showServerErrors({ error }, 'signup'),
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
      {openSignupGroupModal === SIGNUP_GROUP_MODALS.DELETE && (
        <ConfirmDeleteSignupOrSignupGroupModal
          isSaving={savingSignupGroup === SIGNUP_GROUP_ACTIONS.DELETE}
          isOpen={openSignupGroupModal === SIGNUP_GROUP_MODALS.DELETE}
          onClose={closeSignupGroupModal}
          onConfirm={handleDelete}
          registration={registration}
          signupGroup={signupGroup}
        />
      )}
      {responsiblePerson && (
        <SendMessageModal
          isOpen={openModal === SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP}
          isSaving={savingResponsiblePerson === SIGNUP_ACTIONS.SEND_MESSAGE}
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
              <SignupAuthenticationNotification
                action={SIGNUP_ACTIONS.UPDATE}
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

              <SignupGroupFormFields
                disabled={disabled}
                registration={registration}
                signupGroup={signupGroup}
              />
            </FormContainer>
          </Container>
          {signupGroup ? (
            <EditSignupGroupButtonPanel
              onDelete={() =>
                setOpenSignupGroupModal(SIGNUP_GROUP_MODALS.DELETE)
              }
              onSendMessage={() =>
                setOpenModal(SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP)
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
