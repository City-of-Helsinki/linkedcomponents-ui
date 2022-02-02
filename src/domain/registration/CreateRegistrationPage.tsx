/* eslint-disable max-len */
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import * as Yup from 'yup';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../constants';
import {
  CreateRegistrationMutationInput,
  useCreateRegistrationMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import Section from '../app/layout/Section';
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
import { getRegistrationPayload } from './utils';
import { registrationSchema, showErrors } from './validation';

const CreateRegistrationPage: React.FC = () => {
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const { t } = useTranslation();
  const [saving, setSaving] = React.useState<boolean>(false);
  const [createRegistrationMutation] = useCreateRegistrationMutation();
  const history = useHistory();
  const location = useLocation();
  const locale = useLocale();
  const { user } = useUser();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useRegistrationServerErrors();

  const goToRegistrationSavedPage = (id: string) => {
    history.push(`/${locale}${ROUTES.REGISTRATION_SAVED.replace(':id', id)}`);
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
            showErrors({
              error: error as Yup.ValidationError,
              setErrors,
              setTouched,
            });
          }
        };

        return (
          <Form noValidate={true}>
            <FormikPersist
              name={FORM_NAMES.REGISTRATION_FORM}
              isSessionStorage={true}
            />
            <PageWrapper
              className={styles.registrationPage}
              title={`createRegistrationPage.pageTitle`}
            >
              <MainContent>
                <Container className={styles.createContainer} withOffset={true}>
                  <AuthenticationNotification
                    action={REGISTRATION_ACTIONS.CREATE}
                  />
                  <ServerErrorSummary errors={serverErrorItems} />
                  <Section title={t('registration.form.sections.event')}>
                    <EventSection />
                  </Section>
                  <Section
                    title={t('registration.form.sections.enrolmentTime')}
                  >
                    <EnrolmentTimeSection />
                  </Section>
                  <Section
                    title={t('registration.form.sections.attendeeCount')}
                  >
                    <AttendeeCapacitySection />
                  </Section>
                  <Section title={t('registration.form.sections.waitingList')}>
                    <WaitingListSection />
                  </Section>
                  <Section title={t('registration.form.sections.instructions')}>
                    <InstructionsSection />
                  </Section>
                  <Section
                    title={t('registration.form.sections.confirmationMessage')}
                  >
                    <ConfirmationMessageSection />
                  </Section>
                  <Section title={t('registration.form.sections.audienceAge')}>
                    <AudienceAgeSection />
                  </Section>
                </Container>
                {/* TODO: Set correct saving state when integrating with API */}
                <CreateButtonPanel onSave={handleSubmit} saving={saving} />
              </MainContent>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

const CreateRegistrationPageWrapper: React.FC = () => {
  const { loading: loadingUser } = useUser();

  return (
    <LoadingSpinner isLoading={loadingUser}>
      <CreateRegistrationPage />
    </LoadingSpinner>
  );
};

export default CreateRegistrationPageWrapper;
