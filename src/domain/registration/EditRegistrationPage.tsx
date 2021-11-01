/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../constants';
import {
  Registration,
  RegistrationQuery,
  RegistrationQueryVariables,
  useRegistrationQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import extractLatestReturnPath from '../../utils/extractLatestReturnPath';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import Section from '../app/layout/Section';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_EDIT_ACTIONS } from '../registrations/constants';
import {
  getRegistrationFields,
  replaceParamsToRegistrationQueryString,
} from '../registrations/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import AuthRequiredNotification from './authRequiredNotification/AuthRequiredNotification';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import AttendeeCapacitySection from './formSections/attendeeCapacitySection/AttendeeCapacitySection';
import AudienceAgeSection from './formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from './formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from './formSections/enrolmentTimeSection/EnrolmentTimeSection';
import InstructionsSection from './formSections/instructionsSection/InstructionsSection';
import WaitingListSection from './formSections/waitingListSection/WaitingListSection';
import useRegistrationServerErrors from './hooks/useRegistrationServerErrors';
import useRegistrationUpdateActions, {
  MODALS,
} from './hooks/useRegistrationUpdateActions';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import RegistrationInfo from './registrationInfo/RegistrationInfo';
import styles from './registrationPage.module.scss';
import { RegistrationFormFields } from './types';
import { getRegistrationInitialValues, registrationPathBuilder } from './utils';
import { registrationSchema, showErrors } from './validation';

interface EditRegistrationPageProps {
  refetch: (
    variables?: Partial<RegistrationQueryVariables>
  ) => Promise<ApolloQueryResult<RegistrationQuery>>;
  registration: Registration;
}

const EditEventPage: React.FC<EditRegistrationPageProps> = ({
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const history = useHistory();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useRegistrationServerErrors();

  const {
    closeModal,
    deleteRegistration,
    openModal,
    saving,
    setOpenModal,
    updateRegistration,
  } = useRegistrationUpdateActions({
    registration,
  });

  const initialValues = React.useMemo(
    () => getRegistrationInitialValues(registration),
    [registration]
  );

  const { name } = getRegistrationFields(registration, locale);

  const goToRegistrationsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATIONS
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: replaceParamsToRegistrationQueryString(remainingQueryString, {
        page: null,
      }),
      state: { registrationId: registration.id },
    });
  };

  const onDelete = () => {
    deleteRegistration({
      onSuccess: () => goToRegistrationsPage(),
    });
  };

  const onUpdate = (values: RegistrationFormFields) => {
    updateRegistration(values, {
      onError: (error: any) => showServerErrors({ error }),
      onSuccess: async () => {
        // await refetch();
        window.scrollTo(0, 0);
      },
    });
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
            setServerErrorItems([]);
            clearErrors();

            await registrationSchema.validate(values, { abortEarly: false });

            onUpdate(values);
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
            <ConfirmDeleteModal
              isOpen={openModal === MODALS.DELETE}
              isSaving={saving === REGISTRATION_EDIT_ACTIONS.DELETE}
              onClose={closeModal}
              onDelete={onDelete}
            />
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
                    <ServerErrorSummary errors={serverErrorItems} />
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
                    onDelete={() => setOpenModal(MODALS.DELETE)}
                    onUpdate={handleUpdate}
                    registration={registration}
                    saving={saving}
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

const EditRegistrationPageWrapper: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const loadingUser = useDebouncedLoadingUser();

  const {
    data: registrationData,
    loading: loadingRegistration,
    refetch,
  } = useRegistrationQuery({
    skip: !id || !user,
    variables: {
      id,
      createPath: getPathBuilder(registrationPathBuilder),
    },
  });

  const loading = loadingRegistration || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {registrationData?.registration ? (
        <EditEventPage
          refetch={refetch}
          registration={registrationData.registration}
        />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditRegistrationPageWrapper;
