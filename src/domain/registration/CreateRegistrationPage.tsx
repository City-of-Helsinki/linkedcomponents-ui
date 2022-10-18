/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../constants';
import {
  CreateRegistrationMutationInput,
  useCreateRegistrationMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../utils/validationUtils';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import Section from '../app/layout/section/Section';
import { reportError } from '../app/sentry/utils';
import { REGISTRATION_ACTIONS } from '../registrations/constants';
import { clearRegistrationsQueries } from '../registrations/utils';
import useUser from '../user/hooks/useUser';
import { REGISTRATION_INITIAL_VALUES } from './constants';
import CreateButtonPanel from './createButtonPanel/CreateButtonPanel';
import AttendeeCapacitySection from './formSections/attendeeCapacitySection/AttendeeCapacitySection';
import AudienceAgeSection from './formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from './formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from './formSections/enrolmentTimeSection/EnrolmentTimeSection';
import EventSection from './formSections/eventSection/EventSection';
import InstructionsSection from './formSections/instructionsSection/InstructionsSection';
import WaitingListSection from './formSections/waitingListSection/WaitingListSection';
import useRegistrationServerErrors from './hooks/useRegistrationServerErrors';
import AuthenticationNotification from './registrationAuthenticationNotification/RegistrationAuthenticationNotification';
import styles from './registrationPage.module.scss';
import { RegistrationFormFields } from './types';
import { checkCanUserDoAction, getRegistrationPayload } from './utils';
import { getFocusableFieldId, registrationSchema } from './validation';

const CreateRegistrationPage: React.FC = () => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const [saving, setSaving] = React.useState<boolean>(false);
  const [createRegistrationMutation] = useCreateRegistrationMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const { user } = useUser();

  const isEditingAllowed = checkCanUserDoAction({
    action: REGISTRATION_ACTIONS.CREATE,
    organizationAncestors: [],
    publisher: '',
    user,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useRegistrationServerErrors();

  const goToRegistrationSavedPage = (id: string) => {
    navigate(`/${locale}${ROUTES.REGISTRATION_SAVED.replace(':id', id)}`);
  };

  const createSingleRegistration = async (
    payload: CreateRegistrationMutationInput
  ) => {
    try {
      const data = await createRegistrationMutation({
        variables: { input: payload },
      });

      return data.data?.createRegistration.id as string;
    } catch (error) /* istanbul ignore next */ {
      showServerErrors({ error });
      // // Report error to Sentry
      reportError({
        data: {
          error: error as Record<string, unknown>,
          payload,
          payloadAsString: JSON.stringify(payload),
        },
        location,
        message: 'Failed to create registration',
        user,
      });
    }
  };

  const createRegistration = async (values: RegistrationFormFields) => {
    setSaving(true);

    const payload = getRegistrationPayload(values);

    const createdEventId = await createSingleRegistration(payload);

    if (createdEventId) {
      // Clear all registrations queries from apollo cache to show added registrations
      // in registration list
      clearRegistrationsQueries(apolloClient);

      goToRegistrationSavedPage(createdEventId);
    }

    setSaving(false);
  };

  return (
    <Formik
      initialValues={REGISTRATION_INITIAL_VALUES}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={false}
      validateOnChange={true}
      validationSchema={registrationSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await registrationSchema.validate(values, { abortEarly: false });

            await createRegistration(values);
          } catch (error) {
            showFormErrors({
              error: error as Yup.ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as Yup.ValidationError,
              getFocusableFieldId,
            });
          }
        };

        return (
          <Form noValidate={true}>
            <FormikPersist
              name={FORM_NAMES.REGISTRATION_FORM}
              isSessionStorage={true}
            >
              <MainContent>
                <Container className={styles.createContainer} withOffset={true}>
                  <Breadcrumb className={styles.breadcrumb}>
                    <Breadcrumb.Item to={ROUTES.HOME}>
                      {t('common.home')}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item to={ROUTES.REGISTRATIONS}>
                      {t('registrationsPage.title')}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active={true}>
                      {t(`createRegistrationPage.title`)}
                    </Breadcrumb.Item>
                  </Breadcrumb>

                  <AuthenticationNotification
                    action={REGISTRATION_ACTIONS.CREATE}
                  />
                  <ServerErrorSummary errors={serverErrorItems} />

                  <Section title={t('registration.form.sections.event')}>
                    <EventSection isEditingAllowed={isEditingAllowed} />
                  </Section>
                  <Section
                    title={t('registration.form.sections.enrolmentTime')}
                  >
                    <EnrolmentTimeSection isEditingAllowed={isEditingAllowed} />
                  </Section>
                  <Section
                    title={t('registration.form.sections.attendeeCount')}
                  >
                    <AttendeeCapacitySection
                      isEditingAllowed={isEditingAllowed}
                    />
                  </Section>
                  <Section title={t('registration.form.sections.waitingList')}>
                    <WaitingListSection isEditingAllowed={isEditingAllowed} />
                  </Section>
                  <Section title={t('registration.form.sections.instructions')}>
                    <InstructionsSection isEditingAllowed={isEditingAllowed} />
                  </Section>
                  <Section
                    title={t('registration.form.sections.confirmationMessage')}
                  >
                    <ConfirmationMessageSection
                      isEditingAllowed={isEditingAllowed}
                    />
                  </Section>
                  <Section title={t('registration.form.sections.audienceAge')}>
                    <AudienceAgeSection isEditingAllowed={isEditingAllowed} />
                  </Section>
                </Container>

                <CreateButtonPanel onSave={handleSubmit} saving={saving} />
              </MainContent>
            </FormikPersist>
          </Form>
        );
      }}
    </Formik>
  );
};

const CreateRegistrationPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <PageWrapper
      className={styles.registrationPage}
      title={`createRegistrationPage.pageTitle`}
    >
      <LoadingSpinner isLoading={loadingUser}>
        <CreateRegistrationPage />
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateRegistrationPageWrapper;
