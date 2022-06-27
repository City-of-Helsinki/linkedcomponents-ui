/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import isPast from 'date-fns/isPast';
import { Form, Formik } from 'formik';
import React, { useContext } from 'react';
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
  useCreateEnrolmentMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import unixTimeToMs from '../../../utils/unixTimeToMs';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import { reportError } from '../../app/sentry/utils';
import { getRegistrationWarning } from '../../registration/utils';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EnrolmentAuthenticationNotification from '../enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import EnrolmentFormFields from '../enrolmentFormFields/EnrolmentFormFields';
import EnrolmentPageContext from '../enrolmentPageContext/EnrolmentPageContext';
import EventInfo from '../eventInfo/EventInfo';
import FormContainer from '../formContainer/FormContainer';
import useEnrolmentServerErrors from '../hooks/useEnrolmentServerErrors';
import useEnrolmentUpdateActions, {
  ENROLMENT_MODALS,
} from '../hooks/useEnrolmentUpdateActions';
import ConfirmCancelModal from '../modals/confirmCancelModal/ConfirmCancelModal';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import { EnrolmentFormFields as EnrolmentFormFieldsType } from '../types';
import {
  clearCreateEnrolmentFormData,
  clearEnrolmentReservationData,
  clearEnrolmentsQueries,
  getEnrolmentPayload,
  getEnrolmentReservationData,
} from '../utils';
import { enrolmentSchema, scrollToFirstError } from '../validation';
import styles from './enrolmentForm.module.scss';

type Props = {
  disabled: boolean;
  enrolment?: EnrolmentFieldsFragment;
  event: EventFieldsFragment;
  initialValues: EnrolmentFormFieldsType;
  refetchEnrolment?: (
    variables?: Partial<EnrolmentQueryVariables>
  ) => Promise<ApolloQueryResult<EnrolmentQuery>>;
};

const EnrolmentForm: React.FC<Props> = ({
  disabled,
  enrolment,
  event,
  initialValues,
  refetchEnrolment,
}) => {
  const { registration } = useContext(EnrolmentPageContext);
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const formSavingDisabled = React.useRef(!!enrolment);

  const { setOpenParticipant } = useContext(EnrolmentPageContext);

  const { user } = useUser();

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

  const [creatingEnrolment, setCreatingEnrolment] =
    React.useState<boolean>(false);
  const [createEnrolmentMutation] = useCreateEnrolmentMutation();

  const goToEnrolmentsPageAfterCreate = () => {
    formSavingDisabled.current = true;
    clearCreateEnrolmentFormData(registration.id as string);
    clearEnrolmentReservationData(registration.id as string);

    navigate(
      `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )}`
    );
  };

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

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();

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
    setCreatingEnrolment(true);

    const payload = getEnrolmentPayload(values, registration);

    const createdEventId = await createSingleEnrolment(payload);

    if (createdEventId) {
      // Clear all enrolments queries from apollo cache to show added enrolment
      // in enrolment list
      clearEnrolmentsQueries(apolloClient);

      goToEnrolmentsPageAfterCreate();
    }

    setCreatingEnrolment(false);
  };

  const onCancel = () => {
    cancelEnrolment({
      onSuccess: () => goToEnrolmentsPage(),
    });
  };

  const onUpdate = (values: EnrolmentFormFieldsType) => {
    updateEnrolment(values, {
      onError: (error: any) => showServerErrors({ error }),
      onSuccess: async () => {
        refetchEnrolment && (await refetchEnrolment());
        window.scrollTo(0, 0);
      },
    });
  };

  const registrationWarning = getRegistrationWarning(registration, t);

  const isRestoringDisabled = () => {
    const data = getEnrolmentReservationData(registration.id as string);
    return !enrolment && (!data || isPast(unixTimeToMs(data.expires)));
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
                restoringDisabled={isRestoringDisabled()}
                savingDisabled={formSavingDisabled.current}
              />
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
                      <ReservationTimer registration={registration} />
                      <div className={styles.divider} />
                    </>
                  )}
                  <h2>{t('enrolment.form.titleRegistration')}</h2>

                  <ParticipantAmountSelector
                    disabled={disabled || !!enrolment}
                  />

                  <EnrolmentFormFields disabled={disabled} />
                </FormContainer>
              </Container>
              {enrolment ? (
                <EditButtonPanel
                  enrolment={enrolment}
                  onCancel={() => setOpenModal(ENROLMENT_MODALS.CANCEL)}
                  onSave={handleSubmit}
                  saving={saving}
                />
              ) : (
                <CreateButtonPanel
                  disabled={disabled}
                  onSave={handleSubmit}
                  saving={creatingEnrolment}
                />
              )}
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
