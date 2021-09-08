/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik';
import debounce from 'lodash/debounce';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { Registration } from '../../generated/graphql';
import useIsMounted from '../../hooks/useIsMounted';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import Section from '../app/layout/Section';
import NotFound from '../notFound/NotFound';
import { registrationsResponse } from '../registrations/__mocks__/registrationsPage';
import { getRegistrationFields } from '../registrations/utils';
import useUser from '../user/hooks/useUser';
import AuthRequiredNotification from './authRequiredNotification/AuthRequiredNotification';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import AttendeeCapacitySection from './formSections/attendeeCapacitySection/AttendeeCapacitySection';
import AudienceAgeSection from './formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from './formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from './formSections/enrolmentTimeSection/EnrolmentTimeSection';
import InstructionsSection from './formSections/instructionsSection/InstructionsSection';
import WaitingListSection from './formSections/waitingListSection/WaitingListSection';
import RegistrationInfo from './registrationInfo/RegistrationInfo';
import styles from './registrationPage.module.scss';
import { RegistrationFormFields } from './types';
import { getRegistrationInitialValues } from './utils';
import { registrationSchema, showErrors } from './validation';

interface EditRegistrationPageProps {
  registration: Registration;
}

const EditEventPage: React.FC<EditRegistrationPageProps> = ({
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const initialValues = React.useMemo(
    () => getRegistrationInitialValues(registration),
    [registration]
  );

  const { name } = getRegistrationFields(registration, locale);

  const updateRegistration = (values: RegistrationFormFields) => {
    toast.error('TODO: Update registration when API is available');
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={registrationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setErrors, setTouched }) => {
        const clearErrors = () => setErrors({});
        const handleUpdate = async () => {
          try {
            clearErrors();

            await registrationSchema.validate(values, { abortEarly: false });

            await updateRegistration(values);
          } catch (error) {
            showErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });
          }
        };

        return (
          <>
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.registrationPage}
                noFooter
                titleText={name}
              >
                <MainContent>
                  <Container
                    contentWrapperClassName={styles.editPageContentContainer}
                    withOffset={true}
                  >
                    <AuthRequiredNotification />
                    <RegistrationInfo registration={registration} />
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
                    <Section
                      title={t('registration.form.sections.waitingList')}
                    >
                      <WaitingListSection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.instructions')}
                    >
                      <InstructionsSection />
                    </Section>
                    <Section
                      title={t(
                        'registration.form.sections.confirmationMessage'
                      )}
                    >
                      <ConfirmationMessageSection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.audienceAge')}
                    >
                      <AudienceAgeSection />
                    </Section>
                  </Container>
                  <EditButtonPanel
                    onDelete={() => alert('TODO: Delete registration')}
                    onUpdate={handleUpdate}
                    registration={registration}
                    saving={false}
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

const LOADING_USER_DEBOUNCE_TIME = 50;

const EditRegistrationPageWrapper: React.FC = () => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { loading: loadingUser } = useUser();
  const { id } = useParams<{ id: string }>();
  // TODO: Use real registration data when API is available
  const registration = registrationsResponse.registrations.data.find(
    (item) => item.id === id
  );

  const [debouncedLoadingUser, setDebouncedLoadingUser] =
    React.useState(loadingUser);

  const debouncedSetLoading = React.useMemo(
    () =>
      debounce((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setDebouncedLoadingUser(loading);
      }, LOADING_USER_DEBOUNCE_TIME),
    [isMounted]
  );

  const handleLoadingUserChange = React.useCallback(
    (loading: boolean) => {
      /* istanbul ignore next */
      debouncedSetLoading(loading);
    },
    [debouncedSetLoading]
  );

  React.useEffect(() => {
    handleLoadingUserChange(loadingUser);
  }, [handleLoadingUserChange, loadingUser]);

  const loading = debouncedLoadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <EditEventPage registration={registration} />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditRegistrationPageWrapper;
