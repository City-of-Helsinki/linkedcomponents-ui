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
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupGroupQuery,
  SignupGroupQueryVariables,
  SignupQuery,
  SignupQueryVariables,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import getValue from '../../../utils/getValue';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { isRegistrationPossible } from '../../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import { clearSeatsReservationData } from '../../seatsReservation/utils';
import { SIGNUP_ACTIONS, SIGNUP_MODALS } from '../../signup/constants';
import EditSignupButtonPanel from '../../signup/editSignupButtonPanel/EditSignupButtonPanel';
import useSignupActions from '../../signup/hooks/useSignupActions';
import ConfirmDeleteSignupOrSignupGroupModal from '../../signup/modals/confirmDeleteSignupOrSignupGroupModal/ConfirmDeleteSignupOrSignupGroupModal';
import SendMessageModal from '../../signup/modals/sendMessageModal/SendMessageModal';
import SignupAuthenticationNotification from '../../signup/signupAuthenticationNotification/SignupAuthenticationNotification';
import { useSignupServerErrorsContext } from '../../signup/signupServerErrorsContext/hooks/useSignupServerErrorsContext';
import { SIGNUP_GROUP_ACTIONS, SIGNUP_GROUP_FIELDS } from '../constants';
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
  SignupFormFields,
  SignupGroupFormFields as SignupGroupFormFieldsType,
} from '../types';
import {
  clearCreateSignupGroupFormData,
  isRestoringSignupGroupFormDataDisabled,
} from '../utils';
import { getSignupGroupSchema, scrollToFirstError } from '../validation';
import AvailableSeatsText from './availableSeatsText/AvailableSeatsText';
import styles from './signupGroupForm.module.scss';

type CreateSignupGroupFormProps = {
  refetchSignup?: undefined;
  refetchSignupGroup?: undefined;
  signup?: undefined;
  signupGroup?: undefined;
};

type UpdateSignupFormProps = {
  refetchSignup: (
    variables?: Partial<SignupQueryVariables>
  ) => Promise<ApolloQueryResult<SignupQuery>>;
  refetchSignupGroup?: undefined;
  signup: SignupFieldsFragment;
  signupGroup?: undefined;
};

type UpdateSignupGroupFormProps = {
  refetchSignup?: undefined;
  refetchSignupGroup: (
    variables?: Partial<SignupGroupQueryVariables>
  ) => Promise<ApolloQueryResult<SignupGroupQuery>>;
  signup?: undefined;
  signupGroup: SignupGroupFieldsFragment;
};

type SignupGroupFormWrapperProps = (
  | CreateSignupGroupFormProps
  | UpdateSignupFormProps
  | UpdateSignupGroupFormProps
) & {
  disabled: boolean;
  event: EventFieldsFragment;
  initialValues: SignupGroupFormFieldsType;
  registration: RegistrationFieldsFragment;
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
  refetchSignup,
  refetchSignupGroup,
  registration,
  setErrors,
  setTouched,
  signup,
  signupGroup,
  values,
}) => {
  const { t } = useTranslation();

  const { addNotification } = useNotificationsContext();
  const [{ value: signups }, , { setValue: setSignups }] = useField<
    SignupFormFields[]
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
      signup ??
      signupGroup?.signups?.find((su) => su?.responsibleForGroup) ??
      undefined,
    [signup, signupGroup]
  );

  const {
    deleteSignup,
    saving: savingSignup,
    sendMessage,
    updateSignup,
  } = useSignupActions({
    registration,
    signup,
  });

  const {
    createSignupGroup,
    deleteSignupGroup,
    saving: savingSignupGroup,
    updateSignupGroup,
  } = useSignupGroupActions({
    registration,
    signupGroup,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useSignupServerErrorsContext();

  const formSavingDisabled = React.useRef(!!signup || !!signupGroup);

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
      { state: { signupId: signup?.id ?? responsiblePerson?.id } }
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
    if (signupGroup) {
      deleteSignupGroup({
        onSuccess: () => {
          goToSignupsPage();
          addNotification({
            label: t('signup.form.notificationSignupGroupDeleted'),
            type: 'success',
          });
        },
      });
    } else {
      deleteSignup({
        onSuccess: () => {
          goToSignupsPage();
          addNotification({
            label: t('signup.form.notificationSignupDeleted'),
            type: 'success',
          });
        },
      });
    }
  };

  const handleUpdate = (values: SignupGroupFormFieldsType) => {
    if (signupGroup) {
      updateSignupGroup(values, {
        onError: (error: any) => showServerErrors({ error }, 'signup'),
        onSuccess: async () => {
          refetchSignupGroup && (await refetchSignupGroup());
          window.scrollTo(0, 0);
          addNotification({
            label: t('signup.form.notificationSignupGroupUpdated'),
            type: 'success',
          });
        },
      });
    } else {
      updateSignup(values, {
        onError: (error: any) => showServerErrors({ error }, 'signup'),
        onSuccess: async () => {
          refetchSignup && (await refetchSignup());
          window.scrollTo(0, 0);
          addNotification({
            label: t('signup.form.notificationSignupUpdated'),
            type: 'success',
          });
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setServerErrorItems([]);
      clearErrors();

      await getSignupGroupSchema(registration).validate(values, {
        abortEarly: false,
      });

      if (signup || signupGroup) {
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
      {openModal === SIGNUP_MODALS.DELETE && (
        <ConfirmDeleteSignupOrSignupGroupModal
          isSaving={savingSignupGroup === SIGNUP_GROUP_ACTIONS.DELETE}
          isOpen={openModal === SIGNUP_MODALS.DELETE}
          onClose={closeModal}
          onConfirm={handleDelete}
          registration={registration}
          signup={signup}
          signupGroup={signupGroup as any}
        />
      )}
      {responsiblePerson && (
        <SendMessageModal
          isOpen={openModal === SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP}
          isSaving={savingSignup === SIGNUP_ACTIONS.SEND_MESSAGE}
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
            signup,
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
                action={
                  signup || savingSignup
                    ? SIGNUP_ACTIONS.UPDATE
                    : SIGNUP_ACTIONS.CREATE
                }
                registration={registration}
              />
              <ServerErrorSummary errors={serverErrorItems} />
              <EventInfo event={event} />

              {!signup && !signupGroup ? (
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
              ) : (
                <h2>{t('signup.form.titleSignups')}</h2>
              )}

              <SignupGroupFormFields
                disabled={disabled}
                registration={registration}
                signupGroup={signupGroup}
              />
            </FormContainer>
          </Container>

          {signupGroup && (
            <EditSignupGroupButtonPanel
              onDelete={() => setOpenModal(SIGNUP_MODALS.DELETE)}
              onSendMessage={() =>
                setOpenModal(SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP)
              }
              onUpdate={handleSubmit}
              registration={registration}
              saving={savingSignupGroup}
              signupGroup={signupGroup}
            />
          )}
          {signup && (
            <EditSignupButtonPanel
              onDelete={() => setOpenModal(SIGNUP_MODALS.DELETE)}
              onSendMessage={() =>
                setOpenModal(SIGNUP_MODALS.SEND_MESSAGE_TO_SIGNUP)
              }
              onUpdate={handleSubmit}
              registration={registration}
              saving={savingSignup}
              signup={signup}
            />
          )}
          {!signup && !signupGroup && (
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
