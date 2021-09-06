/* eslint-disable max-len */
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { FORM_NAMES } from '../../constants';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import Section from '../app/layout/Section';
import useUser from '../user/hooks/useUser';
import AuthRequiredNotification from './authRequiredNotification/AuthRequiredNotification';
import { REGISTRATION_INITIAL_VALUES } from './constants';
import CreateButtonPanel from './createButtonPanel/CreateButtonPanel';
import AttendeeCountSection from './formSections/attendeeCountSection/AttendeeCountSection';
import AudienceAgeSection from './formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from './formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from './formSections/enrolmentTimeSection/EnrolmentTimeSection';
import InstructionsSection from './formSections/instructionsSection/InstructionsSection';
import WaitingListSection from './formSections/waitingListSection/WaitingListSection';
import styles from './registrationPage.module.scss';
import { RegistrationFormFields } from './types';

const CreateRegistrationPage: React.FC = () => {
  const { t } = useTranslation();

  const createRegistration = (values: RegistrationFormFields) => {
    toast.error('TODO: Save registration when API is available');
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
    >
      {({ values }) => {
        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          await createRegistration(values);
        };

        return (
          <Form onSubmit={(event) => handleSubmit(event)} noValidate={true}>
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
                  <AuthRequiredNotification />
                  <Section
                    title={t('registration.form.sections.enrolmentTime')}
                  >
                    <EnrolmentTimeSection />
                  </Section>
                  <Section
                    title={t('registration.form.sections.attendeeCount')}
                  >
                    <AttendeeCountSection />
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
                <CreateButtonPanel saving={false} />
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
